var Setup = require('./setup');

describe('Locals', function() {
  beforeEach(Setup.env);

  var tpl, model, $parent, view;

  beforeEach(registerTemplate);
  beforeEach(setParent);
  beforeEach(setView);

  beforeEach(function() {
    tpl = LM.get('template_name', view);

    model = new Backbone.Model();
    tpl.bind(model);
    tpl.render();
  });

  // -----

  xit("should be fine", function() {
    var txt = $("#message").text();
  });

  // -----

  function registerTemplate() {
    LM.register('template_name', [
      "<span id='message'>",
      "  {{ text() -> view.name }}",
      "</span>"
    ].join(""));
  }

  function setParent() {
    $parent = $("<p class='paragraph'>").appendTo("body");
  }

  function setView() {
    view = new Backbone.View({ el: $parent });
    view.name = "View name";
  }
});
