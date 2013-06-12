var Setup = require('./setup');

testSuite('@value() select', function() {
  var model;

  beforeEach(function() {
    model = new Backbone.Model();
    template(
      "<select name='number' multiple @value='attr(\"number\")'>" +
        "<option value='one'>Uno</option>" +
        "<option value='two'>Dos</option>" +
        "<option value='three'>Tres</option>" +
      "</select>")
      .bind(model)
      .render();
  });

  it("should work with arrays", function() {
    if (window.Zepto) return;
    model.set('number', ['three', 'two']);
    assert.equal($("select").val().toString(), ['two', 'three'].toString());
  });

  it("should work with strings", function() {
    if (window.Zepto) return;
    model.set('number', 'three');
    assert.equal($("select").val().toString(), ["three"].toString());
  });
});
