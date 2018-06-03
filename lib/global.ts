/// <reference types="mocha" />
/// <reference types="benchmark" />
/// <reference types="chai" />
/// <reference types="node" />

import MochaBenchmark from '../mocha_benchmark';
import Benchmark = require('benchmark');

export function getGlobal(): NodeJS.Global & {
	assert?: Chai.Assert,
	expect?: Chai.ExpectStatic,
	should?(): Chai.Should,
	should?<T>(argv: T): Chai.Should,
	MochaBenchmark?: typeof MochaBenchmark,
	Benchmark?: typeof Benchmark,
}
{
	if (typeof global !== 'undefined')
	{
		// @ts-ignore
		return global as NodeJS.Global;
	}
	else if (typeof window !== 'undefined')
	{
		// @ts-ignore
		return window as Window;
	}
	else if (typeof self !== 'undefined')
	{
		// @ts-ignore
		return self;
	}
	else if (typeof this !== 'undefined')
	{
		// @ts-ignore
		return this;
	}
	else
	{
		// @ts-ignore
		return {};
	}
}

// @ts-ignore
export = getGlobal.call(this) as ReturnType<typeof getGlobal>;
