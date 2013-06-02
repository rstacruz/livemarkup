var Setup = require('./setup');

describe("Livemarkup", function() {
  beforeEach(Setup.env);

  it("Should work", function() {
    assert.equal('object', typeof LM);
  });
});
