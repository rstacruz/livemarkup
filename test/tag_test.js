var Setup = require('./setup');

describe('Test', function() {
  beforeEach(Setup.env);

  var tpl, $parent;

  beforeEach(registerTemplate);
  beforeEach(setParent);

  beforeEach(function() {
    tpl = LM.get('hello', $parent);
    tpl.render();
  });

  // ----

  it('.el', function() {
    assert.property(tpl.$el[0], 'nodeType');
  });

  it('appended properly', function() {
    assert.equal($('.paragraph #message').length, 1);
  });

  it('should have the right value', function() {
    assert.match($('#message').text(), /foo\s*hey there\s*bar/m);
  });

  // -----

  function registerTemplate() {
    LM.register('hello', [
      "<span id='message'>",
      "  foo",
      "  {{ text() -> 'hey there' }}",
      "  bar",
      "</span>"
    ].join(""));
  }

  function setParent() {
    $parent = $("<p class='paragraph'>").appendTo("body");
  }
});
