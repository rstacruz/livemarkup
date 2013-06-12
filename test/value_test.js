var Setup = require('./setup');

testSuite('@value()', function() {
  var tpl, model;

  beforeEach(function() {
    model = new Backbone.Model({ name: "John" });
  });

  it('should work', function() {
    render("<input id='textbox' type='text' @value='attr(\"name\")'>");
    assert.equal($('#textbox').val(), 'John');
  });

  it('should respond to changes', function() {
    render("<input id='textbox' type='text' @value='attr(\"name\")'>");
    assert.equal($('#textbox').val(), 'John');

    model.set('name', 'Jackie');
    assert.equal($('#textbox').val(), 'Jackie');
  });

  it('should be two-way', function() {
    render("<input id='textbox' type='text' @value='attr(\"name\")'>");
    $('#textbox').val('Jackson').trigger('change');

    assert.equal(model.get('name'), 'Jackson');
  });

  it('should stop listening to destroy', function() {
    render("<input id='textbox' type='text' @value='attr(\"name\")'>");
    tpl.destroy();
    $('#textbox').val('Jackson').trigger('change');

    assert.equal(model.get('name'), 'John');
  });

  function render(str) {
    tpl = new template(str).bind(model).render();
  }
});
