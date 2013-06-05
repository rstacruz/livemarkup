var Setup = require('./setup');

describe('@value() select', function() {
  var tpl, $parent, model;

  beforeEach(Setup.env);

  beforeEach(function() {
    render(
      "<select name='number' @value='attr(\"number\")'>" +
        "<option value='one'>Uno</option>" +
        "<option value='two'>Dos</option>" +
        "<option value='three'>Tres</option>" +
      "</select>"
    );
  });

  it("should default to nothing", function() {
    model.set('number', 'two');
    model.set('number', null);
    assert.equal($("select").val(), 'one');
  });

  it("should respond", function() {
    model.set('number', 'two');
    assert.equal($("select").val(), 'two');

    model.set('number', 'one');
    assert.equal($("select").val(), 'one');
  });

  it("reverse binding", function() {
    model.set('number', 'one');
    sinon.spy(model, 'set');

    $('select').val('three').trigger('change');

    assert.equal(model.get('number'), 'three');
    assert(model.set.calledOnce);
  });

  // ---

  function render(str) {
    model = new Backbone.Model();
    $parent = $("<p>").appendTo("body").html(str);
    tpl = new LM($parent).bind(model).render();
  }
});
