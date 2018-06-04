"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _isAsyncFunction_1 = require("is-async-function");
const _isAsyncFunction_2 = require("is-async-func");
const functionArguments = require("function-arguments");
const _parseFunction = require("parse-function");
const _parseFunc = _parseFunction({
    ecmaVersion: 2017
});
exports.SUPPORT_PARSE_FUNC_ARGS = parseFuncArgs((a, b, c) => { }).length === 3;
console.log(parseFuncArgs((a, b, { k }, ...c) => { }));
function parseFuncArgs(fn) {
    console.log(_parseFunc.parse(fn));
    return functionArguments(fn);
}
exports.parseFuncArgs = parseFuncArgs;
function isAsyncFunc(fn) {
    if (typeof fn !== 'function') {
        throw new TypeError(`Expected an Function but got ${typeof fn}.`);
    }
    return _isAsyncFunction_1(fn) || _isAsyncFunction_2(fn);
}
exports.isAsyncFunc = isAsyncFunc;
function isPromise(p) {
    return p instanceof Promise || (p &&
        typeof p === 'object' &&
        typeof p.then === 'function' &&
        typeof p.catch === 'function');
}
exports.isPromise = isPromise;
