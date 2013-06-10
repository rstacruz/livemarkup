
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

  it('recurse locals', function() {
    tpl = template(
      "<ul @each:user='-> users'>" +
        "<li><b @text='-> four'></b></li>" +
      "</ul>"
    ).locals({ users: users, four: 4 }).render();
    users.add({});

    assert.equal($('body').text(), '4');
  });

  describe('from empty', function() {
    beforeEach(function() {
      tpl = template(
        "<ul @each:user='-> users'>" +
          "<li><b @text='attr(user, \"name\")'></b></li>" +
        "</ul>"
      ).locals({ users: users, four: 4 }).render();
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
      users.reset([{ name: 'John' }, { name: 'Jacob' }]);
      users.remove(users.at(0));

      expected = '<ul><li><b>Jacob</b></li></ul>';
      assert.equal($('body').html(), expected);
    });

    it('model.destroy', function() {
      users.reset([{ name: 'Abel' }]);
      users.at(0).destroy();

      assert.equal($('body').html(), '<ul></ul>');
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

  // ----

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

    it('LI remove event suppression', function(done) {
      if (!$.fn.on) return done(); /* jQ 1.6+ only */

      users.reset([{ name: 'John' }]);

      tpl.$el.on('remove', 'li', function(e) {
        e.preventDefault();
        setTimeout(checkLi, 50);
      });

      users.remove(users.at(0));

      function checkLi() {
        assert.equal($('body').html(), '<ul><li><b>John</b></li></ul>');
        done();
      }
    });
  });

});
