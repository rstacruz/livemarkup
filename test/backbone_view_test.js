var Setup = require('./setup');

multi('backbone view test', function() {
  var tpl, $parent, model, view;

  it('should work', function() {
    model.set('name', 'John');
    render("<div id='name' @text='attr(\"name\")'></div>");

    assert.equal($('#name').html(), 'John');
  });

  it('should honor changes', function() {
    render("<div id='name' @text='attr(\"name\")'></div>");
    model.set('name', 'Gwen');

    assert.equal($('#name').html(), 'Gwen');
  });

  it('should honor View#stopListening()', function() {
    model.set('name', 'John');
    render("<div id='name' @text='attr(\"name\")'></div>");
    view.stopListening();
    model.set('name', 'Gwen');

    assert.equal($('#name').html(), 'John');
  });

  it('should honor View#remove()', function() {
    render("<div id='name' @text='attr(\"name\")'></div>");
    assert.equal(_.keys(model._events).length, 1);

    view.remove();
    assert.equal(_.keys(model._events).length, 0);
  });

  // ---

  beforeEach(function() {
    model = new Backbone.Model();
  });

  function render(str) {
    $parent = $("<p>").appendTo("body").html(str);
    view = new Backbone.View({ el: $parent });
    tpl = new LM(view).bind(model).render();
  }
});
