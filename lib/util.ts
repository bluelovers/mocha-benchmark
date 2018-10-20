
import _isAsyncFunction_1 = require('is-async-function');
import _isAsyncFunction_2 = require('is-async-func');

import functionArguments = require('function-arguments');
import Bluebird = require('bluebird');

import _parseFunction = require('func-args');

export const SUPPORT_PARSE_FUNC_ARGS = parseFuncArgs((a, b, c) => {}).length === 3;

export function parseFuncArgs(fn: Function): string[]
{
	//console.log(_parseFunction.parse(fn));

	return functionArguments(fn)
}

export function isAsyncFunc(fn): fn is Function
{
	if (typeof fn !== 'function')
	{
		throw new TypeError(`Expected an Function but got ${typeof fn}.`)
	}

	return _isAsyncFunction_1(fn) || _isAsyncFunction_2(fn);
}

export function isPromise<T>(p: Bluebird<T>): p is Bluebird<T>
export function isPromise<T>(p: Promise<T>): p is Promise<T>
export function isPromise<T>(p: PromiseLike<T>): p is PromiseLike<T>
export function isPromise<T>(p: T): boolean
export function isPromise(p): boolean
{
	return p instanceof Promise || (
		p &&
		typeof p === 'object' &&
		typeof p.then === 'function' &&
		typeof p.catch === 'function'
	);
}
