/**
 * Created by user on 2017/1/18.
 */
var perf = MochaBenchmark.create({
  Benchmark: Benchmark,
  versions: [
    /* order can be important when we introduce test failing options */
    ['previous', null],
    ['latest', null]
  ],
  /* could be describe */
//  suite: describe,
//  /* or it */
//  test: it,
});

// perf.suite only runs the last version (usually your latest)
perf.suite('libGlobal', function(perf, libGlobal) {
  perf.test('my lib should be fast', function() {
    //libGlobal.doStuff();
  });

  // all tests inside compare run for each version
  perf.compare(function(perf, libGlobal) {
    perf.test('my lib should be faster', function() {
      // libGlobal will be previous then latest
    });
  });
});
