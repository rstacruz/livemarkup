var Setup = require('./setup');

testSuite('@value() select', function() {
  var model;

  beforeEach(function() {
    model = new Backbone.Model();
    template(
      "<select name='number' @value='attr(\"number\")'>" +
        "<option value='one'>Uno</option>" +
        "<option value='two'>Dos</option>" +
        "<option value='three'>Tres</option>" +
      "</select>")
      .bind(model)
      .render();
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
});
