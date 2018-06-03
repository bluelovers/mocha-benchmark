"use strict";
/// <reference types="mocha" />
/// <reference types="benchmark" />
/// <reference types="chai" />
/// <reference types="node" />
Object.defineProperty(exports, "__esModule", { value: true });
const MochaBenchmark = require("../mocha_benchmark");
const _OptionalRequire = require("optional-require");
const OptionalRequire = _OptionalRequire(require);
function registerGlobal() {
    let myGlobal = require('./global');
    let chai = OptionalRequire('chai');
    if (!('assert' in myGlobal)) {
        if (chai && chai.assert) {
            myGlobal.assert = chai.assert;
        }
        else if (OptionalRequire('assert')) {
            myGlobal.assert = OptionalRequire('assert');
        }
    }
    if (!('should' in myGlobal) && chai) {
        // @ts-ignore
        myGlobal.should = chai.should;
    }
    if (!('expect' in myGlobal) && chai) {
        // @ts-ignore
        myGlobal.expect = chai.expect;
    }
    if (!('MochaBenchmark' in myGlobal)) {
        myGlobal.MochaBenchmark = MochaBenchmark;
    }
    if (!('Benchmark' in myGlobal)) {
        myGlobal.Benchmark = OptionalRequire('benchmark');
    }
    return myGlobal;
}
exports.registerGlobal = registerGlobal;
exports.default = registerGlobal;
