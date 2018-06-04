import Bluebird = require('bluebird');
export declare const SUPPORT_PARSE_FUNC_ARGS: boolean;
export declare function parseFuncArgs(fn: Function): string[];
export declare function isAsyncFunc(fn: any): fn is Function;
export declare function isPromise<T>(p: Bluebird<T>): p is Bluebird<T>;
export declare function isPromise<T>(p: Promise<T>): p is Promise<T>;
export declare function isPromise<T>(p: PromiseLike<T>): p is PromiseLike<T>;
export declare function isPromise<T>(p: T): boolean;
