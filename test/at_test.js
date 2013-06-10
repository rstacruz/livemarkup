var Setup = require('./setup');

testSuite('@at()', function() {
  var tpl, $parent, model;

  it('alternate syntax', function() {
    template('<img @at(title)=\'-> "hello"\'>').render();

    assert.equal($('body').html(), '<img title="hello" />');
  });

  it('should work', function() {
    template('<img @at:title=\'-> "hello"\'>').render();

    assert.equal($('body').html(), '<img title="hello" />');
  });

  it('double attrs', function() {
    template("<img @at:title='-> \"hello\"' @at(alt)='-> \"hi\"'>").render();

    assert.equal($('body').html(), '<img title="hello" alt="hi" />');
  });

  it('false values', function() {
    template("<input type='text' @at:autofocus='-> false' />").render();

    assert.equal($('body').html(), '<input type="text" />');
  });

  it('true', function() {
    template("<input type='text' @at:autofocus='-> true' />").render();

    assert.match($('body').html(), /<input type="text" autofocus=".*" \/>/);
  });
});
