"use strict";
/// <reference types="mocha" />
/// <reference types="benchmark" />
/// <reference types="chai" />
Object.defineProperty(exports, "__esModule", { value: true });
const _OptionalRequire = require("optional-require");
//import _chai = require('chai');
const MochaLogger = require("mocha-logger");
const log_1 = require("./lib/log");
const register_1 = require("./lib/register");
exports.registerGlobal = register_1.default;
const OptionalRequire = _OptionalRequire(require);
function getOptions(options) {
    if (typeof options !== 'object') {
        throw new TypeError('must provide an options object');
    }
    const def = getDefaultOptions();
    let opts = Object.assign({}, def, options);
    opts.optionsBenchmark = Object.assign({}, def.optionsBenchmark, opts.optionsBenchmark);
    return opts;
}
exports.getOptions = getOptions;
class MochaBenchmarkClass {
    constructor(options) {
        this._data = {};
        let finalOptions = getOptions(options);
        if (!finalOptions.Benchmark || typeof finalOptions.Benchmark !== 'function') {
            throw new Error('Benchmark must be given');
        }
        this._data.options = finalOptions;
        this.suite = this.suite.bind(this);
        this._init();
    }
    _init() {
        let Benchmark = this.options.Benchmark;
        if (!('reject' in Benchmark.Deferred.prototype)) {
            /**
             * see https://github.com/bestiejs/benchmark.js/pull/205
             */
            Object.assign(Benchmark.Deferred.prototype, {
                reject(err) {
                    let error = err || new Error(err);
                    // @ts-ignore
                    error.originError = err;
                    let deferred = this, clone = deferred.benchmark, 
                    // @ts-ignore
                    bench = clone._original;
                    // @ts-ignore
                    let event = Benchmark.Event('error');
                    // @ts-ignore
                    clone.error = event.message = error;
                    clone.emit(event);
                }
            });
        }
    }
    get options() {
        return this._data.options;
    }
    suite(name, fn) {
        let opts = this.options;
        let libBenchmark = opts.Benchmark;
        let bench = new libBenchmark.Suite(name, opts.optionsBenchmark);
        let topLevelContext = new Context(bench, null, '', this.options);
        topLevelContext.isTopLevel = true;
        topLevelContext.describe(name, fn);
    }
    static create(options) {
        return new this(options);
    }
}
exports.MochaBenchmarkClass = MochaBenchmarkClass;
exports.create = MochaBenchmarkClass.create.bind(MochaBenchmarkClass);
const MochaBenchmark = require("./mocha_benchmark");
exports.MochaBenchmark = MochaBenchmark;
exports.default = MochaBenchmark;
class Context {
    constructor(bench, global, prefix, options) {
        this.parent = null;
        this.name = null;
        this.index = -1;
        this.vContexts = null;
        // benchmark suite
        this.bench = bench;
        // prefix used by reporting.
        this.prefix = prefix || '';
        // specific global version this context is tied to.
        this.global = global || null;
        // global options for this instance.
        this.options = options;
    }
    it(name, test, options) {
        return this.test(name, test, options);
    }
    test(name, test, options) {
        let context = this;
        options = Object.assign({}, this.options.optionsBenchmark, options, {
            name,
        });
        this.bench.add(this.getPrefix() + name, test, options);
    }
    getPrefix() {
        return (0 && this.parent && this.parent.prefix !== '' ? this.parent.prefix : '') + this.prefix;
    }
    describe(name, suiteFn) {
        return this.compare(name, suiteFn);
    }
    suite(name, suiteFn) {
        return this.compare(name, suiteFn);
    }
    compare(name, suiteFn) {
        if (typeof name == 'function') {
            [name, suiteFn] = [null, name];
        }
        let self = this;
        if (typeof name == 'undefined' || name === null) {
            self._compare(self.name || '', suiteFn);
        }
        else {
            self.options.suite(name, function () {
                self._compare(name, suiteFn);
            });
        }
    }
    _compare(_name, suiteFn) {
        let versions = this.options.versions;
        if (!versions.length) {
            throw new Error('must at least one version pairs!');
        }
        let self = this;
        let opts = self.options;
        let Benchmark = self.options.Benchmark;
        let bench = new Benchmark.Suite('', opts.optionsBenchmark);
        let context = new Context(bench, self.global, '', self.options);
        context.parent = self;
        const vContexts = versions.reduce(function (a, version, index) {
            let [name, global] = version;
            let vContext = new Context(bench, global, '', self.options);
            vContext.parent = context;
            vContext.name = name;
            vContext.index = index;
            vContext.data = global;
            vContext._version = version;
            a.push(vContext);
            return a;
        }, []);
        context.vContexts = vContexts;
        suiteFn(context, context.global, vContexts);
        context.bench.forEach(function (task) {
            let bench = new Benchmark.Suite(task.name, task.options);
            versions.map(function ([name, global], index) {
                let t = task.clone();
                const fn = t.fn;
                bench.add(name, function (deferred, ...argv) {
                    let _self = this;
                    new Promise(async function (resolve, reject) {
                        try {
                            let p = await fn.call(self, deferred || _self, global, vContexts[index], ...argv);
                            resolve(p);
                        }
                        catch (e) {
                            reject(e);
                        }
                    })
                        .catch(function (error) {
                        // @ts-ignore
                        deferred.reject(error);
                        /*
                        // @ts-ignore
                        let event = Benchmark.Event('error');
                        event.message = error;

//								deferred.error = error;

                        deferred.benchmark.error = error;
                        deferred.benchmark.emit(event);
                        */
                    })
                        .then(function (p) {
                        deferred.resolve(p);
                    });
                }, Object.assign({}, task.options, { name }));
            });
            opts.test(task.name, function (done) {
                if (bench.length === 0) {
                    return done();
                }
                this.timeout(0);
                // quick formatting hack
                console.log();
                bench.on('start', function (event) {
                    MochaLogger.pending(`${event.type}: ` + log_1.mcolor(log_1.styles.error.color, task.name));
                });
                bench.on('cycle', function (event) {
                    MochaLogger.pending(String(event.target));
                });
                bench.on('error', function (event) {
                    // pass mocha error
                    throw event.target.error;
                });
                bench.on('complete', function (event) {
                    log_1.logSuccess('Fastest is ' + this.filter('fastest').map('name'));
                    done();
                });
                bench.run();
            });
        });
    }
}
exports.Context = Context;
function getDefaultOptions() {
    let _msg = `are u inside at any mocha like env?`;
    if (typeof it === 'undefined') {
        throw new ReferenceError(`global \`it\` is not defined, ${_msg}`);
    }
    if (typeof describe === 'undefined') {
        throw new ReferenceError(`global \`describe\` is not defined, ${_msg}`);
    }
    // @ts-ignore
    return {
        // freeze so user does not accidentally add items.
        versions: [],
        test: it,
        suite: describe,
        prefix: '',
        Benchmark: OptionalRequire('benchmark'),
        optionsBenchmark: {
            async: true,
            defer: true,
        },
    };
}
exports.getDefaultOptions = getDefaultOptions;
Object.defineProperty(MochaBenchmark, 'defaultOptions', { get: getDefaultOptions });
