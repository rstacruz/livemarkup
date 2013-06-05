var Setup = require('./setup');

multi('tag test', function() {
  var tpl, $parent;

  beforeEach(function() {
    $parent = $("<p class='paragraph'>")
      .appendTo("body")
      .html("<span id='message' @text='-> \"hey there\"'></span>");

    tpl = (new LM.template($parent)).render();
  });

  it('should have the right value', function() {
    assert.match($('#message').text(), /hey there/m);
  });
});
