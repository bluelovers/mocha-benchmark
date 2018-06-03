const PREVIOUS = {abc: 666};
const LATEST = {abc: 777};

const bench = MochaBenchmark.create({
	Benchmark: Benchmark,
	versions: [
		['previous', PREVIOUS],
		['latest', LATEST]
	],
	optionsBenchmark: {
		maxTime: 0,
		delay: 0,
		minTime: 0,
	},
});

//Benchmark.options.maxTime = 0;
//Benchmark.options.delay = 0;
//Benchmark.options.minTime = 0;

bench.suite('integration', function (perf)
{
	it('perf.test', function ()
	{
		assert.ok(perf.test, 'has .test');
	});

	it('has compare', function ()
	{
		assert.ok(perf.compare, 'has compare');
	});

	it('optionsBenchmark', function ()
	{

		let {
			maxTime,
			delay,
			minTime,
			// @ts-ignore
		} = perf.bench.options;

		assert.deepEqual({
			maxTime,
			delay,
			minTime,
		}, {
			maxTime: 0,
			delay: 0,
			minTime: 0,
		})

	});

	describe('compare', function ()
	{
		perf.compare(function (currentContext, currentData, vContexts)
		{
			it('global', function ()
			{
				assert.equal(vContexts[0].data, PREVIOUS);
				assert.equal(vContexts[1].data, LATEST);

				assert.deepEqual(vContexts[0].data, {abc: 666});
				assert.deepEqual(vContexts[1].data, {abc: 777});
			});

			currentContext.test('1 + 2000 / 20', function ()
			{
				1 + 1000 / 20;
			});
		});
	});

	perf.test('20000 / 20', function ()
	{
		20000 / 20;
	});

});
