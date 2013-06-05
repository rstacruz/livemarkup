var Setup = require('./setup');

describe('attr()', function() {
  var tpl, $el, model;

  beforeEach(Setup.env);
  beforeEach(setModel);

  describe('attr("name")', function() {
    beforeEach(function() {
      render("<span id='message' @text='attr(\"title\")'></span>");
    });

    it('on() is called', function() {
      assert.isTrue(model.on.calledOnce);
    });

    it('on() args', function() {
      var args = model.on.lastCall.args;
      assert.equal('change:title', args[0]);
    });

    it('get() is called', function() {
      assert.isTrue(model.get.calledOnce);
    });

    it('get() args', function() {
      var args = model.get.lastCall.args;
      assert.equal('title', args[0]);
    });
  });

  // ----

  describe('attr(model, "name")', function() {
    beforeEach(function() {
      render("<span id='message' @text='attr(doc, \"title\")'></span>");
    });

    it('on() is called', function() {
      assert.isTrue(model.on.calledOnce);
    });
  });

  // ----

  describe('attr("name") no model', function() {
    beforeEach(function() {
      $el = $("<span id='message' @text='attr(\"title\")'></span>");
    });

    it('render() throws an error', function() {
      assert.throws(function() {
        LM($el).render();
      }, /no model/);
    });
  });

  // -----

  function setModel() {
    model = {
      on: sinon.spy(),
      get: sinon.stub().returns("Title here")
    };
  };

  function render(html) {
    $el = $("<div>").html(html).appendTo('body');
    tpl = LM($el).locals({ doc: model }).bind(model).render();
  }
});
