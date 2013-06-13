var Setup = require('./setup');

testSuite('locals', function() {
  var tpl, model, $parent;

  beforeEach(function() {
    $parent = $("<p class='paragraph'>")
      .appendTo("#body")
      .html('<span id="message" @text="-> hello()"></span>');
  });

  beforeEach(function() {
    var hello = sinon.stub().returns("Hello there");

    tpl = new LM.template($parent)
      .locals({ hello: hello })
      .render();
  });

  it('initial value', function() {
    assert.match($('#message').text(), /Hello there/m);
  });

});
