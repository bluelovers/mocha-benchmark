/// <reference types="node" />
/// <reference types="chai" />
import * as MochaBenchmark from '../mocha_benchmark';
import Benchmark = require('benchmark');
export declare function registerGlobal(): NodeJS.Global & {
    assert?: Chai.Assert;
    expect?: Chai.ExpectStatic;
    should?(): Chai.Should;
    should?<T>(argv: T): Chai.Should;
    MochaBenchmark?: typeof MochaBenchmark;
    Benchmark?: typeof Benchmark;
};
export default registerGlobal;
