
var Setup = require('./setup');

testSuite('@each() arrays', function() {
  var users;

  describe('arrays', function() {
    beforeEach(function() {
      users = ['Tom', 'Dick', 'Harry'];

      template(
        '<ul @each(user)="-> users">' +
          '<li @html="-> user"></li>' +
        '</ul>'
      ).locals({ users: users }).render();
    });

    it('should work', function() {
      assert.match($('ul').text(), /Tom\s*Dick\s*Harry/);
    });
  });

  describe('objects', function() {
    beforeEach(function() {
      users = { name: 'John', status: 'Single' };

      template(
        '<ul @each(key,value)="-> users">' +
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

  // ---
  
  describe('nested case', function() {
    beforeEach(function() {
      fields = { 'Gender': [ 'male', 'female' ], 'Status': [ 'single', 'married' ] };

      template(
        '<ul @each(field,choices)="-> fields">' +
          '<li>' +
            '<strong @text="-> field"></strong>' +
            '<ul @each(choice)="-> choices">' +
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

      assert.equal($('body').html(), expected);
    });
  });

});
