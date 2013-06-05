var Setup = require('./setup');

describe('@value() select', function() {
  var tpl, $parent, model;

  beforeEach(Setup.env);

  beforeEach(function() {
    render(
      "<select name='number' multiple @value='attr(\"number\")'>" +
        "<option value='one'>Uno</option>" +
        "<option value='two'>Dos</option>" +
        "<option value='three'>Tres</option>" +
      "</select>"
    );
  });

  it("should work with arrays", function() {
    model.set('number', ['three', 'two']);
    assert.equal($("select").val().toString(), ['two', 'three'].toString());
  });

  it("should work with strings", function() {
    model.set('number', 'three');
    assert.equal($("select").val().toString(), ["three"].toString());
  });

  // ---

  function render(str) {
    model = new Backbone.Model();
    $parent = $("<p>").appendTo("body").html(str);
    tpl = new LM($parent).bind(model).render();
  }
});
