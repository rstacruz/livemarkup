var Setup = require('./setup');

testSuite('@class()', function() {
  var model;

  beforeEach(function() {
    model = new Backbone.Model();
  });

  it('should work', function() {
    model.set('enabled', true);
    template("<div @class:enabled='attr(\"enabled\")'></div>").bind(model).render();

    assert.equal($('body').html(), '<div class="enabled"></div>');
  });

  it('should work with existing', function() {
    model.set('enabled', true);
    template("<div class='active' @class:enabled='attr(\"enabled\")'></div>").bind(model).render();

    assert.equal($('body').html(), '<div class="active enabled"></div>');
  });

  it('multiple classes', function() {
    model.set('enabled', true);
    template("<div class='active' @class:enabled.is-enabled='attr(\"enabled\")'></div>").bind(model).render();

    assert.equal($('body').html(), '<div class="active enabled is-enabled"></div>');
  });

  it('multiple directives', function() {
    model.set('active', true);
    model.set('enabled', true);
    template(
      "<div class='aaa' @class:active='attr(\"active\")' @class:enabled='attr(\"enabled\")'></div>"
    ).bind(model).render();

    assert.equal($('body').html(), '<div class="aaa active enabled"></div>');
  });

});
