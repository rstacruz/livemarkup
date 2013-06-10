
var Setup = require('./setup');

testSuite('@each() collections', function() {
  var User, Users, users;

  beforeEach(function() {
    User = Backbone.Model.extend({});
    Users = Backbone.Collection.extend({
      model: User
    });

    users = new Users();
  });

  beforeEach(function() {
    template(
      "<ul @each:user='-> users'>" +
        "<li><b @text='attr(user, \"name\")'></b></li>" +
      "</ul>"
    ).locals({ users: users }).render();
  });

  it('collection.add', function() {
    users.add({ name: 'John' });
    users.add({ name: 'Jacob' });

    var expected = '<ul><li><b>John</b></li><li><b>Jacob</b></li></ul>';
    assert.equal($('body').html(), expected);
  });

  it('collection.reset (fresh)', function() {
    users.reset([{ name: 'John' }, { name: 'Jacob' }]);

    var expected = '<ul><li><b>John</b></li><li><b>Jacob</b></li></ul>';
    assert.equal($('body').html(), expected);
  });
  
  it('collection.reset (not fresh)', function() {
    users.reset([{ name: 'a' }, { name: 'b' }]);
    users.reset([{ name: 'John' }, { name: 'Jacob' }]);

    var expected = '<ul><li><b>John</b></li><li><b>Jacob</b></li></ul>';
    assert.equal($('body').html(), expected);
  });
  
  it('collection.remove', function() {
    users.reset([{ name: 'John' }]);

    var user = new User({ name: 'Jacob' });
    users.add(user);

    var expected = '<ul><li><b>John</b></li><li><b>Jacob</b></li></ul>';
    assert.equal($('body').html(), expected);

    users.remove(user);
    console.log(users);
    console.log($('body').html());
  });

});
