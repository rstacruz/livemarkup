var Setup = require('./setup');

describe('directives', function() {
  beforeEach(Setup.env);

  beforeEach(function() {
    $parent = $("<div class='container'>")
      .html("<p><span id='message' @text='-> \"hello\"'></span></p>")
      .appendTo("body");

    tpl = LM($parent).render();
  });

  it('should not be visible', function() {
    var html = $('div').html();
    assert.notMatch(html, /\@text/);
  });
});
