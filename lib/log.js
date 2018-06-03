"use strict";
/**
 * Created by user on 2018/6/2/002.
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const MochaReportersBase = require("mocha/lib/reporters/base");
exports.MochaReportersBase = MochaReportersBase;
__export(require("mocha/lib/reporters/base"));
const base_1 = require("mocha/lib/reporters/base");
exports.mcolor = base_1.color;
const mocha_logger_1 = require("mocha-logger");
exports.styles = mocha_logger_1.styles;
const mocha_logger_2 = require("mocha-logger");
exports.log = mocha_logger_2.log;
exports.pending = mocha_logger_2.pending;
exports.success = mocha_logger_2.success;
exports.error = mocha_logger_2.error;
function _log(msg, s, ...argv) {
    let fmt = [
        base_1.color('error stack', '    ' + (s || '-')),
        msg,
        ...argv,
    ].join(' ');
    console.log(fmt);
}
exports._log = _log;
function logSuccess(msg, ...argv) {
    _log(base_1.color('bright pass', msg), ...argv);
}
exports.logSuccess = logSuccess;
