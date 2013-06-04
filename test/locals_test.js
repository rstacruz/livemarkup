var Setup = require('./setup');

describe('locals', function() {
  beforeEach(Setup.env);

  var tpl, model, $parent;

  beforeEach(setParent);

  beforeEach(function() {
    function hello() {
      return "Hello there";
    }

    tpl = new LM.template($parent)
      .locals({ hello: hello })
      .render();
  });

  // ----

  it('initial value', function() {
    assert.match($('#message').text(), /Hello there/m);
  });

  // -----

  function setParent() {
    $parent = $("<p class='paragraph'>")
      .appendTo("body")
      .html(
        '<span id="message" @text="-> hello()">' +
        "</span>");
  }
});
