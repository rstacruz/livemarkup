var Setup = require('./setup');

describe('render', function() {
  var tpl, $parent;

  beforeEach(Setup.env);

  describe('simple', function() {
    beforeEach(function() {
      $parent = $("<p class='paragraph'>")
        .html([
          "<span id='message' @text='-> \"hey there\"'>",
          "</span>"
        ].join(''))
        .appendTo("body");

      tpl = (new LM.template($parent)).render();
    });

    it('should have the right value', function() {
      assert.match($('#message').text(), /hey there/m);
    });
  });

});
