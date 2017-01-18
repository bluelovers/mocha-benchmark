(function() {

  var isNode = typeof(window) === 'undefined';

  if (isNode) {

    global.suite = describe;
    global.test = it;

    global.assert = require('assert');
    global.MochaBenchmark = require('../mocha_benchmark');
    global.Benchmark = require('benchmark');
    return;
  }

  require('/test/assert.js');
  require('/node_modules/benchmark/benchmark.js');
  require('/mocha_benchmark.js');

}());
