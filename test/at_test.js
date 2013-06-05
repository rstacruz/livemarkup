var Setup = require('./setup');

describe('@at()', function() {
  var tpl, $parent, model;

  beforeEach(Setup.env);

  it('should work', function() {
    render("<img @at(title)='-> \"hello\"'>");

    assert.equal($parent.html(), '<img title="hello" />');
  });

  it('double attrs', function() {
    render("<img @at(title)='-> \"hello\"' @at(alt)='-> \"hi\"'>");

    assert.equal($parent.html(), '<img title="hello" alt="hi" />');
  });

  it('false values', function() {
    render("<input type='text' @at(autofocus)='-> false' />");

    assert.equal($parent.html(), '<input type="text" />');
  });

  it('true', function() {
    render("<input type='text' @at(autofocus)='-> true' />");

    assert.equal($parent.html(), '<input type="text" autofocus="autofocus" />');
  });

  // ---

  function render(str) {
    $parent = $("<p>").appendTo("body").html(str);
    tpl = new LM($parent).render();
  }
});
