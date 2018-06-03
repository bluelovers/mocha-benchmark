/**
 * Created by user on 2018/6/2/002.
 */
import MochaBenchmark, { getDefaultOptions } from '../mocha_benchmark';

import { relative, expect } from './_local-dev'

let bench = MochaBenchmark.create({
	versions: [
		/* order can be important when we introduce test failing options */
		[
			'previous', {
			aaa: 777,
		}
		],
		[
			'latest', {
			aaa: 888,
		}
		]
	],

	prefix: '[this is prefix]',
});

bench.suite(relative(__filename), function (topLevelContext, topLevelData)
{

	topLevelContext.test('top async', async function (deferred, currentData, currentContext)
	{

	});

	topLevelContext.test('top sync', function (...argv)
	{
//			expect(1).to.equal(3);
	});

	// sub level
	topLevelContext.compare('sub', function (currentContext, currentData)
	{

		currentContext.test('async', async function (deferred, currentData, currentContext)
		{
			expect(1).to.equal(3);
		});

		let b;

		currentContext.test('sync', function (...argv)
		{
//			expect(1).to.equal(3);
		});

	})

	// same level
	topLevelContext.compare(function (currentContext, currentData)
	{
		currentContext.test('same async', async function (deferred, currentData, currentContext)
		{
			//expect(1).to.equal(3);
		});

		currentContext.test('same sync', function (...argv)
		{
//			expect(1).to.equal(3);
		});
	})

});
