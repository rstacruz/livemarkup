var Setup = require('./setup');

describe("Livemarkup", function() {
  beforeEach(Setup.env);

  it("is defined", function() {
    assert.isDefined(LM);
  });

  it("works", function() {
    var $html = $("<span @text='-> \"hi\"'>hello</span>");
    var tpl = LM($html).render();

    assert.equal($html.text(), 'hi');
  });
});
