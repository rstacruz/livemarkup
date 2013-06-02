var Setup = require('./setup');

describe("Livemarkup", function() {
  beforeEach(Setup.env);

  it("Should work", function() {
    assert.isObject(LM);
  });
});
