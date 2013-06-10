
var Setup = require('./setup');

testSuite('@each() collections', function() {
  var User, Users, users, tpl;

  beforeEach(function() {
    User = Backbone.Model.extend({});
    Users = Backbone.Collection.extend({
      model: User
    });

    users = new Users();
  });

  describe('from empty', function() {
    beforeEach(function() {
      tpl = template(
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

    describe('events', function() {
      it('append event', function(done) {
      tpl.on('append', function() { done(); });
      users.add({ name: 'Jacob' });
      });

      it('UL reset event', function(done) {
        tpl.on('reset', function() { done(); });
        users.reset([{ name: 'John' }, { name: 'Jacob' }]);
      });
      
      it('LI append:reset event', function(done) {
        tpl.on('append:reset', _.once(function() { done(); }));
        users.reset([{ name: 'John' }, { name: 'Jacob' }]);
      });
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
    });
    
    it('collection.sort', function() {
      users.reset([{ name: 'c' }, { name: 'b' }, { name: 'a' }]);
      users.comparator = function(model) { return model.get('name'); };
      users.sort();

      assert.equal($('body').text(), 'abc');
    });
  });

  // ----

  describe('from filled', function() {
    it('should work', function() {
      users = new Users([{ name: 'John' }, { name: 'Jacob' }]);

      template(
        "<ul @each:user='-> users'>" +
          "<li><b @text='attr(user, \"name\")'></b></li>" +
        "</ul>"
      ).locals({ users: users }).render();

      var expected = '<ul><li><b>John</b></li><li><b>Jacob</b></li></ul>';
      assert.equal($('body').html(), expected);
    });
  });

});
