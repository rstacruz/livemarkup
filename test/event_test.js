var Setup = require('./setup');

describe('events', function() {
  var tpl, model, $parent;

  beforeEach(Setup.env);
  beforeEach(setParent);

  beforeEach(function() {
    model = new Backbone.Model();
    tpl = new LM.template($parent)
      .bind(model)
      .render();
  });

  // ----

  it('initial value', function() {
    assert.match($('#message').text(), /^hello.*/m);
  });

  it('changing', function() {
    var old = $('#message').text();
    model.trigger('eventname');
    var noo = $('#message').text();

    assert.notEqual(old, noo);
  });

  // -----

  function setParent() {
    $parent = $("<p class='paragraph'>")
      .appendTo("body")
      .html([
        '<span id="message" @text="on(\'eventname\') -> \'hello \' + Math.random()">',
        "</span>"
      ].join(""));
  }
});
