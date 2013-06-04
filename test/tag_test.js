var Setup = require('./setup');

describe('Basic tag test', function() {
  var tpl, $parent;

  beforeEach(Setup.env);
  beforeEach(registerTemplate);
  beforeEach(setParent);

  beforeEach(function() {
    tpl = LM.get('hello', $parent).render();
  });

  // ----

  it('.el', function() {
    assert.property(tpl.$el[0], 'nodeType');
  });

  it('appended properly', function() {
    assert.equal($('.paragraph #message').length, 1);
  });

  it('should have the right value', function() {
    assert.match($('#message').text(), /hey there/m);
  });

  // -----

  function registerTemplate() {
    LM.register('hello', [
      "<span id='message' @text='-> \"hey there\"'>",
      "</span>"
    ].join(""));
  }

  function setParent() {
    $parent = $("<p class='paragraph'>").appendTo("body");
  }
});
