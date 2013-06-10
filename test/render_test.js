var Setup = require('./setup');

testSuite('render', function() {
  var tpl, $parent, helper;

  beforeEach(function() {
    helper = sinon.spy();

    $parent = $("<p class='paragraph'>")
      .appendTo("body")
      .html("<span id='message' @text='-> helper()'></span>");

    tpl = new LM.template($parent)
      .locals({ helper: helper });
  });

  it('rendered only once', function() {
    tpl.render();
    assert(helper.calledOnce);
  });

  it('rendered twice', function() {
    tpl.render();
    tpl.render();
    assert(helper.calledTwice);
  });
});
