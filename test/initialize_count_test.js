var Setup = require('./setup');

testSuite('initialize count', function() {
  var tpl, $parent, model;

  beforeEach(function() {
    model = {
      on: sinon.spy(),
      get: sinon.stub().returns("Title here")
    };

    $parent = $("<p class='paragraph'>")
      .html("<span id='message' @text='attr(\"title\")'></span>")
      .appendTo("#body");

    tpl = new LM.template($parent)
      .bind(model)
      .render();
  });

  it('on() is called', function() {
    assert.isTrue(model.on.calledOnce);
  });

  it('get() is called', function() {
    assert.isTrue(model.get.calledOnce);
  });

  it('on() is only called once', function() {
    tpl.initialize();
    tpl.initialize();
    tpl.initialize();
    assert.isTrue(model.on.calledOnce);
  });
});
