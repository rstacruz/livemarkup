var Setup = require('./setup');

testSuite("Livemarkup", function() {
  it("is defined", function() {
    assert.isDefined(LM);
  });

  it("works", function() {
    var $html = $("<span @text='-> \"hi\"'>hello</span>");
    var tpl = LM($html).render();

    assert.equal($html.text(), 'hi');
  });
});
