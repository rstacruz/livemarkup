var Setup = require('./setup');

describe('Test', function() {
  beforeEach(Setup.env);

  var tpl;
  var model;

  beforeEach(function() {
    LM.register('hello', ml([
      "<span id='message'>",
      "  foo",
      "  {{ html() -> 'hey there' }}",
      "  bar",
      "</span>"
    ]));

    tpl = LM.get('hello', $("<p>"));

    model = new Backbone.Model();
    tpl.bind(model);
  });

  beforeEach(function() {
    tpl.render();
  });

  it('.el', function() {
    assert.property(tpl.$el[0], 'nodeType');
  });

  it('.lol', function() {
    console.log(tpl.$el.html());
  });
});
