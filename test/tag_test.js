var Setup = require('./setup');

xdescribe('Test', function() {
  beforeEach(Setup.env);

  var tpl;

  beforeEach(function() {
    LM.register('hello', ml([
      "<span id='message'>",
      "  {{ html() -> 'hey there' }}",
      "</span>"
    ]));

    tpl = LM.get('hello');
  });

  it('element', function() {
    assert.property(tpl.el[0], 'nodeValue');
  });

  it('appendTo', function() {
    tpl.appendTo($("<body>"));
  });
});
