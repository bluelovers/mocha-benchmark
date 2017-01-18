
describe('mocha benchmark', function() {
  it('#create', function() {
    assert.ok(MochaBenchmark.create);
  });

  it('#create - no benchmark', function() {
    assert.throws(function() {
      subject.create();
    });
  });

  describe('create with benchmark', function() {
    var subject;

    before(function() {
      subject = MochaBenchmark.create({
        Benchmark: Benchmark
      });
    });

    it('.options.Benchmark', function() {
      assert.equal(subject.options.Benchmark, Benchmark);
    });

    it('#suite', function() {
      assert.ok(subject.suite);
    });
  });
});
