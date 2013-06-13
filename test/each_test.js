require('./setup');

testSuite('@each() arrays', function() {
  var users;

  describe('arrays', function() {
    beforeEach(function() {
      users = ['Tom', 'Dick', 'Harry'];

      template(
        '<ul @each="user in -> users">' +
          '<li @html="-> user"></li>' +
        '</ul>'
      ).locals({ users: users }).render();
    });

    it('should work', function() {
      assert.match($('ul').text(), /TomDickHarry/);
    });
  });

  // ----

  describe('objects', function() {
    beforeEach(function() {
      users = { name: 'John', status: 'Single' };

      template(
        '<ul @each="key, value in -> users">' +
          '<li>' +
            '<strong @text="-> key"></strong>: ' +
            '<span @text="-> value"></span>' +
          '</li>' +
        '</ul>'
      ).locals({ users: users }).render();
    });

    it('should work', function() {
      assert.match($('ul').text(), /name: John\s*status: Single/);
    });
  });

  // ----

  describe('multi elements', function() {
    it('error', function() {
      assert.throws(function() {
        users = ['Tom', 'Dick', 'Harry'];

        template(
          '<ul @each="user in -> users">' +
            '<li>Name:</li>' +
            '<li @html="-> user"></li>' +
          '</ul>'
        ).locals({ users: users }).render();
      });
    });
  });

  // ----
  
  describe('nested case', function() {
    beforeEach(function() {
      fields = { 'Gender': [ 'male', 'female' ], 'Status': [ 'single', 'married' ] };

      template(
        '<ul @each="field, choices in -> fields">' +
          '<li>' +
            '<strong @text="-> field"></strong>' +
            '<ul @each="choice in -> choices">' +
              '<li @text="-> choice"></li>' +
            '</ul>' +
          '</li>' +
        '</ul>'
      ).locals({ fields: fields }).render();
    });

    it('should work', function() {
      var expected = '<ul>' +
      '<li><strong>Gender</strong>' +
      '<ul><li>male</li><li>female</li></ul></li>' +
      '<li><strong>Status</strong><ul><li>single</li><li>married</li></ul></li></ul>' ;

      assert.equal($('#body').html(), expected);
    });
  });

});
