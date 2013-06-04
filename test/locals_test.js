var Setup = require('./setup');

describe('Locals', function() {
  beforeEach(Setup.env);

  var tpl, model, $parent;

  beforeEach(registerTemplate);
  beforeEach(setParent);

  beforeEach(function() {
    function hello() {
      return "Hello there";
    }

    tpl = LM.get('template_name', $parent)
      .locals({ hello: hello })
      .render();
  });

  // ----

  it('initial value', function() {
    assert.match($('#message').text(), /Hello there/m);
  });

  // -----

  function registerTemplate() {
    LM.register('template_name', [
      '<span id="message" @text="-> hello()">',
      "</span>"
    ].join(""));
  }

  function setParent() {
    $parent = $("<p class='paragraph'>").appendTo("body");
  }
});
