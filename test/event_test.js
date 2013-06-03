var Setup = require('./setup');

describe('Events', function() {
  beforeEach(Setup.env);

  var tpl, model, $parent;

  beforeEach(registerTemplate);
  beforeEach(setParent);

  beforeEach(function() {
    tpl = LM.get('template_name', $parent);

    model = new Backbone.Model();
    tpl.bind(model);
    tpl.render();
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

  function registerTemplate() {
    LM.register('template_name', [
      '<span id="message" @text="on(\'eventname\') -> \'hello \' + Math.random()">',
      "</span>"
    ].join(""));
  }

  function setParent() {
    $parent = $("<p class='paragraph'>").appendTo("body");
  }
});
