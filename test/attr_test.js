var Setup = require('./setup');

describe('attr()', function() {
  var tpl, $parent, model;

  beforeEach(Setup.env);

  beforeEach(function() {
    model = {
      on: sinon.spy(),
      get: sinon.stub().returns("Title here")
    };
  });

  // ----

  describe('attr("name")', function() {
    beforeEach(function() {
      $parent = $("<p class='paragraph'>")
        .html("<span id='message' @text='attr(\"title\")'></span>")
        .appendTo("body");

      tpl = new LM.template($parent)
        .bind(model)
        .render();
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
      $parent = $("<p class='paragraph'>")
        .html("<span id='message' @text='attr(doc, \"title\")'></span>")
        .appendTo("body");

      tpl = LM($parent)
        .locals({ doc: model })
        .render();
    });

    it('on() is called', function() {
      assert.isTrue(model.on.calledOnce);
    });
  });

  // ----

  describe('attr("name") no model', function() {
    beforeEach(function() {
      $parent = $("<p class='paragraph'>")
        .html("<span id='message' @text='attr(\"title\")'></span>")
        .appendTo("body");

      tpl = LM($parent);
    });

    it('render() throws an error', function() {
      assert.throws(function() {
        tpl.render();
      }, /no model/);
    });
  });
});
