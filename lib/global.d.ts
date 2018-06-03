/// <reference types="node" />
/// <reference types="chai" />
import MochaBenchmark from '../mocha_benchmark';
import Benchmark = require('benchmark');
export declare function getGlobal(): NodeJS.Global & {
    assert?: Chai.Assert;
    expect?: Chai.ExpectStatic;
    should?(): Chai.Should;
    should?<T>(argv: T): Chai.Should;
    MochaBenchmark?: typeof MochaBenchmark;
    Benchmark?: typeof Benchmark;
};
declare const _default: NodeJS.Global & {
    assert?: Chai.Assert;
    expect?: Chai.ExpectStatic;
    should?(): Chai.Should;
    should?<T>(argv: T): Chai.Should;
    MochaBenchmark?: typeof MochaBenchmark;
    Benchmark?: typeof Benchmark;
};
export = _default;
