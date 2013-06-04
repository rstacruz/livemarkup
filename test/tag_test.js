var Setup = require('./setup');

describe('basic tag test', function() {
  var tpl, $parent;

  beforeEach(Setup.env);
  beforeEach(setParent);

  describe('simple', function() {
    beforeEach(render);

    it('should have the right value', function() {
      assert.match($('#message').text(), /hey there/m);
    });
  });

  function setParent() {
    $parent = $("<p class='paragraph'>")
      .appendTo("body")
      .html(
        "<span id='message' @text='-> \"hey there\"'>" +
        "</span>");
  }

  function render() {
    tpl = (new LM.template($parent)).render();
  }
});
