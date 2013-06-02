var Setup = require('./setup');

describe('LM.register()', function() {
  beforeEach(Setup.env);

  beforeEach(function() {
    LM.register('views/person_card', 'hello');
  });

  it('should work', function() {
    var template = LM.get('views/person_card');

    assert.isObject(template);
    assert.isFunction(template.constructor);
  });

  it('should handle non-existent templates', function() {
    assert.throws(function() {
      var template;

      template = LM.get('lollerskates');
    });
  });
});
