var Setup = require('./setup');

describe('html()', function() {
  var tpl, $parent, model, outerFn, innerFn;

  beforeEach(Setup.env);

  beforeEach(function() {
    outerFn = sinon.stub().returns("One");
    innerFn = sinon.stub().returns("Two");
  });

  beforeEach(function() {
    $parent = $("<div>")
      .html(
        "<span id='message' @html='-> outerFn()'>" +
          "<span id='inside' @html='-> innerFn()'></span>" +
        "</span>")
      .appendTo("body");

    tpl = new LM.template($parent)
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
