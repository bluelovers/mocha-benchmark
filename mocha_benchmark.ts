/// <reference types="mocha" />
/// <reference types="benchmark" />
/// <reference types="chai" />

import Benchmark = require('benchmark');

import _OptionalRequire = require('optional-require');
import _Global = require('./lib/global');
//import _chai = require('chai');
import * as MochaLogger from 'mocha-logger';
import { logSuccess, mcolor, styles } from './lib/log';
import registerGlobal from './lib/register';
import { isAsyncFunc, isPromise, parseFuncArgs } from './lib/util';

const OptionalRequire = _OptionalRequire(require);

export let defaultOptions: Readonly<Partial<defaultOptions>>;

export type IGlobal = typeof _Global;

export type defaultOptions<T = any, R = any> = {
	versions?: [string, T][],

	test?: Mocha.ITestDefinition,
	suite?: Mocha.IContextDefinition,
	prefix?: string,

	Benchmark?: typeof Benchmark,

	optionsBenchmark?: Benchmark.Options,
}

export function getOptions(options: defaultOptions): defaultOptions
{
	if (typeof options !== 'object')
	{
		throw new TypeError('must provide an options object');
	}

	const def = getDefaultOptions();

	let opts = Object.assign({}, def, options);

	opts.optionsBenchmark = Object.assign({}, def.optionsBenchmark, opts.optionsBenchmark);

	return opts;
}

export class MochaBenchmarkClass<T, R>
{
	protected _data: {
		options?: defaultOptions<T, R>,
	} = {};

	constructor(options: defaultOptions<T, R>)
	{
		let finalOptions = getOptions(options);

		if (!finalOptions.Benchmark || typeof finalOptions.Benchmark !== 'function')
		{
			throw new Error('Benchmark must be given');
		}

		this._data.options = finalOptions;

		this.suite = this.suite.bind(this);

		this._init();
	}

	protected _init()
	{
		let Benchmark = this.options.Benchmark;

		if (!('reject' in Benchmark.Deferred.prototype))
		{
			/**
			 * see https://github.com/bestiejs/benchmark.js/pull/205
			 */
			Object.assign(Benchmark.Deferred.prototype, {
				reject<E extends Error>(err: E)
				{
					let error = err || new Error(err as any);
					// @ts-ignore
					error.originError = err;

					let deferred: Benchmark.Deferred = this,
						clone = deferred.benchmark,
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

	get options()
	{
		return this._data.options;
	}

	suite(name: string, fn: IContextCompareCallback<T, R>)
	{
		let opts = this.options;
		let libBenchmark = opts.Benchmark;

		let bench = new libBenchmark.Suite(name, opts.optionsBenchmark);
		let topLevelContext = new Context(
			bench,
			null,
			'',
			this.options,
		);

		topLevelContext.isTopLevel = true;

		topLevelContext.describe(name, fn);
	}

	static create<T>(options: defaultOptions<T>)
	{
		return new this(options);
	}
}

export const create = MochaBenchmarkClass.create.bind(MochaBenchmarkClass) as typeof MochaBenchmarkClass.create;

import * as MochaBenchmark from './mocha_benchmark';
export default MochaBenchmark
export { MochaBenchmark }

export type IContextCompareCallback<T = IGlobal, R = any> = (currentContext: Context<T, R>, currentData: T, vContext: Context<T, R>[]) => void;

export type IContextTestCallback<T = IGlobal, R = any, V extends any | void | Promise<any | void> = any | void | Promise<any | void>> = (deferred: Benchmark.Deferred, currentData: T, currentContext: Context<T, R>) => V;

export class Context<T = IGlobal, R = any>
{
	bench: Benchmark.Suite;
	global: T | any;
	prefix: string;
	options: defaultOptions<T, R>;

	isTopLevel?: boolean;

	parent?: Context<T, R> = null;

	name?: string = null;
	index?: number = -1;

	data?: T;
	_version?: [string, T];

	vContexts?: Context<T, R>[] = null;

	constructor(bench: Benchmark.Suite, global: R | T, prefix: string, options: defaultOptions<T>)
	{
		// benchmark suite
		this.bench = bench;

		// prefix used by reporting.
		this.prefix = prefix || '';

		// specific global version this context is tied to.
		this.global = global || null;

		// global options for this instance.
		this.options = options;
	}

	it(name: string, test: IContextTestCallback<T, R>, options?: Benchmark.Options)
	{
		return this.test(name, test, options);
	}

	add(name: string, test: IContextTestCallback<T, R>, options?: Benchmark.Options)
	{
		return this.test(name, test, options);
	}

	test(name: string, test: IContextTestCallback<T, R>, options?: Benchmark.Options)
	{
		let context = this;

		options = Object.assign({}, this.options.optionsBenchmark,  options, {
			name,
			//async: true,
			//defer: true,
		});

		this.bench.add(
			this.getPrefix() + name,
			test,
			options
		);
	}

	getPrefix(): string
	{
		return (0 && this.parent && this.parent.prefix !== '' ? this.parent.prefix : '') + this.prefix;
	}

	describe(name: string, suiteFn: IContextCompareCallback<T, R>)
	describe(suiteFn: IContextCompareCallback<T, R>)
	describe(name, suiteFn?: IContextCompareCallback<T, R>)
	{
		return this.compare(name, suiteFn);
	}

	suite(name: string, suiteFn: IContextCompareCallback<T, R>)
	suite(suiteFn: IContextCompareCallback<T, R>)
	suite(name, suiteFn?: IContextCompareCallback<T, R>)
	{
		return this.compare(name, suiteFn);
	}

	compare(name: string, suiteFn: IContextCompareCallback<T, R>)
	compare(suiteFn: IContextCompareCallback<T, R>)
	compare(name: string | IContextCompareCallback<T, R>, suiteFn?: IContextCompareCallback<T, R>)
	{
		if (typeof name == 'function')
		{
			[name, suiteFn] = [null, name];
		}

		let self = this;

		if (typeof name == 'undefined' || name === null)
		{
			self._compare(self.name || '', suiteFn);
		}
		else
		{
			self.options.suite(name as string, function ()
			{
				self._compare(name as string, suiteFn);
			});
		}
	}

	protected _compare(_name: string, suiteFn: IContextCompareCallback<T, R>)
	{
		let versions = this.options.versions;
		if (!versions.length)
		{
			throw new Error('must at least one version pairs!');
		}

		let self = this;

		let opts = self.options;
		let Benchmark = self.options.Benchmark;

		let bench = new Benchmark.Suite('', opts.optionsBenchmark);

		let context = new Context(
			bench,
			self.global,
			'',
			self.options
		);

		context.parent = self;

		const vContexts = versions.reduce(function (a, version, index)
		{
			let [name, global] = version;

			let vContext = new Context<T, R>(
				bench,
				global,
				'',
				self.options
			);

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

		context.bench.forEach(function (task)
		{
			let bench = new Benchmark.Suite(task.name, task.options);

//			console.dir({
//				name: task.name,
//				fn: task.fn,
//				isAsyncFunc: isAsyncFunc(task.fn),
//				parseFuncArgs: parseFuncArgs(task.fn),
//			});

			versions.map(function ([name, global], index)
			{
				let t = task.clone();
				const fn = t.fn;

				function wrapFn(options: Benchmark.Options)
				{
					if (!options.defer && !options.async)
					{
						return function (d, ...argv)
						{
							let _self = this;

							return fn.call(_self,
								d || _self, global, vContexts[index],
								...argv,
							);
						};
					}

					return function (deferred, ...argv)
					{
						let _self = this;

						new Promise(async function (resolve, reject)
						{
							try
							{
								let p = fn.call(_self, deferred, global, vContexts[index], ...argv);

								if (isPromise(p))
								{
									resolve(p);
								}
								else
								{
									resolve(p);
								}
							}
							catch (e)
							{
								reject(e)
							}
						})
							.catch(function (error)
							{
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
							.then(function (p)
							{
								deferred.resolve(p);
							})
					}
				}

				bench.add(
					name,
					wrapFn(task.options),
					{
						...task.options,
						name,
					}
				);
			});

			opts.test(task.name, function (done)
			{
				if (bench.length === 0)
				{
					return done();
				}

				this.timeout(0);
				// quick formatting hack
				console.log();

				bench.on('start', function (event)
				{
					MochaLogger.pending(`${event.type}: ` + mcolor(styles.error.color, task.name));
				});

				bench.on('cycle', function (event)
				{
					MochaLogger.pending(String(event.target));
				});

				bench.on('error', function (event)
				{
					// pass mocha error
					throw event.target.error;
				});

				bench.on('complete', function (event)
				{
					logSuccess('Fastest is ' + this.filter('fastest').map('name'))

					done();
				});

				bench.run();
			});
		});
	}
}

export { registerGlobal }

export function getDefaultOptions<T>(): Partial<defaultOptions<T>>
{
	let _msg = `are u inside at any mocha like env?`;

	if (typeof it === 'undefined')
	{
		throw new ReferenceError(`global \`it\` is not defined, ${_msg}`);
	}
	if (typeof describe === 'undefined')
	{
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

	} as defaultOptions<T>
}

Object.defineProperty(MochaBenchmark, 'defaultOptions', { get: getDefaultOptions });
