global.testSuite = function(name, fn) {
  describe(name, function() {
    beforeEach(function() { $("#body").html(''); });
    fn.apply(this, []);
  });
};
