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
    assert.match($('#message').text(), /before\s*hello.*after/m);
  });

  it('changing', function() {
    var old = $('#message').text();
    model.trigger('eventname');
    var noo = $('#message').text();
  });

  // -----

  function registerTemplate() {
    LM.register('template_name', [
      "<span id='message'>",
      "  before",
      "  {{ on('eventname').text() -> 'hello ' + Math.random() }}",
      "  after",
      "</span>"
    ].join(""));
  }

  function setParent() {
    $parent = $("<p class='paragraph'>").appendTo("body");
  }
});
