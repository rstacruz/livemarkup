var Setup = require('./setup');

describe('LM.register()', function() {
  beforeEach(Setup.env);

  var $el;

  beforeEach(function() {
    LM.register('views/person_card', 'hello');
    $el = $("<p class='paragraph'>");
  });

  it('should work', function() {
    var template = LM.get('views/person_card', $el);

    assert.isObject(template);
    assert.isFunction(template.constructor);
  });

  it('should handle non-existent templates', function() {
    assert.throws(function() {
      LM.get('lollerskates', $el);
    });
  });
});
