/// <reference types="mocha" />
import Benchmark = require('benchmark');
import _Global = require('./lib/global');
import registerGlobal from './lib/register';
export declare let defaultOptions: Readonly<Partial<defaultOptions>>;
export declare type IGlobal = typeof _Global;
export declare type defaultOptions<T = any, R = any> = {
    versions?: [string, T][];
    test?: Mocha.ITestDefinition;
    suite?: Mocha.IContextDefinition;
    prefix?: string;
    Benchmark?: typeof Benchmark;
    optionsBenchmark?: Benchmark.Options;
};
export declare function getOptions(options: defaultOptions): defaultOptions;
export declare class MochaBenchmarkClass<T, R> {
    protected _data: {
        options?: defaultOptions<T, R>;
    };
    constructor(options: defaultOptions<T, R>);
    protected _init(): void;
    readonly options: defaultOptions<T, R>;
    suite(name: string, fn: IContextCompareCallback<T, R>): void;
    static create<T>(options: defaultOptions<T>): MochaBenchmarkClass<T, any>;
}
export declare const create: typeof MochaBenchmarkClass.create;
import * as MochaBenchmark from './mocha_benchmark';
export default MochaBenchmark;
export { MochaBenchmark };
export declare type IContextCompareCallback<T = IGlobal, R = any> = (currentContext: Context<T, R>, currentData: T, vContext: Context<T, R>[]) => void;
export declare class Context<T = IGlobal, R = any> {
    bench: Benchmark.Suite;
    global: T | any;
    prefix: string;
    options: defaultOptions<T, R>;
    isTopLevel?: boolean;
    parent?: Context<T, R>;
    name?: string;
    index?: number;
    data?: T;
    _version?: [string, T];
    vContexts?: Context<T, R>[];
    constructor(bench: Benchmark.Suite, global: R | T, prefix: string, options: defaultOptions<T>);
    it(name: string, test: any, options?: Benchmark.Options): void;
    test(name: string, test: (deferred: Benchmark.Deferred, currentData: T, currentContext: this) => any | void | Promise<any | void>, options?: Benchmark.Options): void;
    getPrefix(): string;
    describe(name: string, suiteFn: IContextCompareCallback<T, R>): any;
    describe(suiteFn: IContextCompareCallback<T, R>): any;
    suite(name: string, suiteFn: IContextCompareCallback<T, R>): any;
    suite(suiteFn: IContextCompareCallback<T, R>): any;
    compare(name: string, suiteFn: IContextCompareCallback<T, R>): any;
    compare(suiteFn: IContextCompareCallback<T, R>): any;
    protected _compare(_name: string, suiteFn: IContextCompareCallback<T, R>): void;
}
export { registerGlobal };
export declare function getDefaultOptions<T>(): Partial<defaultOptions<T>>;
