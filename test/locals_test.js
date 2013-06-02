var Setup = require('./setup');

describe('Locals', function() {
  beforeEach(Setup.env);

  var tpl, model, $parent, view;

  beforeEach(registerTemplate);
  beforeEach(setParent);
  beforeEach(setView);

  beforeEach(function() {
    tpl = LM.get('template_name', view.el);

    tpl.locals.view = view;

    model = new Backbone.Model();
    tpl.bind(model);
    tpl.render();
  });

  // -----

  it("should be fine", function() {
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

  function setView() {
    view = new Backbone.View({ el: $parent });
  }
});
