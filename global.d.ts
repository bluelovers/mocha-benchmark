/// <reference types="mocha" />
/// <reference types="benchmark" />
/// <reference types="chai" />
/// <reference types="node" />

import _MochaBenchmark from './mocha_benchmark';
import * as _Benchmark from 'benchmark';

declare global
{
	export var assert: Chai.Assert;
	export var expect: Chai.ExpectStatic;
	export var should: () => Chai.Should;

	export var MochaBenchmark: typeof _MochaBenchmark;

	// @ts-ignore
	export var Benchmark: typeof _Benchmark;
}

declare var assert: Chai.Assert;
declare var expect: Chai.ExpectStatic;
declare var should: () => Chai.Should;

declare var MochaBenchmark: typeof _MochaBenchmark;
declare var Benchmark: typeof _Benchmark;
