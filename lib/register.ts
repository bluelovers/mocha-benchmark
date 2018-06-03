/// <reference types="mocha" />
/// <reference types="benchmark" />
/// <reference types="chai" />
/// <reference types="node" />

import * as _chai from 'chai';
import * as MochaBenchmark from '../mocha_benchmark';
import { IGlobal } from '../mocha_benchmark';
import Benchmark = require('benchmark');

import _OptionalRequire = require('optional-require');
const OptionalRequire = _OptionalRequire(require);

export function registerGlobal()
{
	let myGlobal = require('./global') as IGlobal;
	let chai: typeof _chai = OptionalRequire('chai');

	if (!('assert' in myGlobal))
	{
		if (chai && chai.assert)
		{
			myGlobal.assert = chai.assert;
		}
		else if (OptionalRequire('assert'))
		{
			myGlobal.assert = OptionalRequire('assert');
		}
	}

	if (!('should' in myGlobal) && chai)
	{
		// @ts-ignore
		myGlobal.should = chai.should;
	}

	if (!('expect' in myGlobal) && chai)
	{
		// @ts-ignore
		myGlobal.expect = chai.expect;
	}

	if (!('MochaBenchmark' in myGlobal))
	{
		myGlobal.MochaBenchmark = MochaBenchmark;
	}

	if (!('Benchmark' in myGlobal))
	{
		myGlobal.Benchmark = OptionalRequire('benchmark');
	}

	return myGlobal;
}

export default registerGlobal;
