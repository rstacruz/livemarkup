var Setup = require('./setup');

multi('@class()', function() {
  var tpl, $parent, model;

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

  it('multiple classes', function() {
    model.set('enabled', true);
    render("<div class='active' @class(enabled.is-enabled)='attr(\"enabled\")'></div>");

    assert.equal($parent.html(), '<div class="active enabled is-enabled"></div>');
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
