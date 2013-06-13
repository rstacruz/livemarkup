require('./setup');

testSuite('html()', function() {
  var tpl, $parent, model, outerFn, innerFn;

  beforeEach(function() {
    outerFn = sinon.stub().returns("One");
    innerFn = sinon.stub().returns("Two");
  });

  beforeEach(function() {
    template(
      "<span id='message' @html='-> outerFn()'>" +
        "<span id='inside' @html='-> innerFn()'></span>" +
      "</span>")
      .locals({ outerFn: outerFn, innerFn: innerFn })
      .render();
  });

  it("should work", function() {
    assert.equal($('#message').text(), 'One');
  });

  it("outer helper called once", function() {
    assert.isTrue(outerFn.calledOnce);
  });

  it("inner helper never called", function() {
    assert.isFalse(innerFn.called);
  });
});
