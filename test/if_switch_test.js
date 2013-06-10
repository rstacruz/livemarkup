var Setup = require('./setup');

testSuite('if()', function() {
  var model;

  beforeEach(function() {
    model = new Backbone.Model({ editing: false });
    template(
      "<div>" +
      "<strong @if='attr(\"editing\")'>Editing</strong>" +
      "<span @if='attr(\"editing\") -> !val'>Showing</span>" +
      "</div>"
    ).bind(model).render();
  });

  it('should work', function() {
    assert.equal($('body').html(), '<div><span>Showing</span></div>');
  });

  it('should respond', function() {
    model.set('editing', true);
    assert.equal($('body').html(), '<div><strong>Editing</strong></div>');
  });
});
