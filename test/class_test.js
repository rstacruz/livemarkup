var Setup = require('./setup');

describe('@class()', function() {
  var tpl, $parent, model;

  beforeEach(Setup.env);

  it('should work', function() {
    model.set('enabled', true);
    render("<div @class(enabled)='attr(\"enabled\")'></div>");

    assert.equal($parent.html(), '<div class="enabled"></div>');
  });

  it('should work with existing', function() {
    model.set('enabled', true);
    render("<div class='active' @class(enabled)='attr(\"enabled\")'></div>");

    assert.equal($parent.html(), '<div class="active enabled"></div>');
  });

  // ---

  beforeEach(function() {
    model = new Backbone.Model();
  });

  function render(str) {
    $parent = $("<p>").appendTo("body").html(str);
    tpl = new LM($parent).bind(model).render();
  }
});
