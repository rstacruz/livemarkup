require('./setup');

testSuite('destroy', function() {
  var tpl, $parent, user;

  beforeEach(function() {
    user = new Backbone.Model({ name: "Kesha" });

    $parent = $("<div id='box'>").appendTo('#body').html(
      "<span id='name' @text='attr(\"name\")'></span>"
    );

    tpl = LM($parent).bind(user).render();
  });

  it("react to change", function() {
    assert.equal($('#name').html(), 'Kesha');

    user.set('name', 'Demi');
    assert.equal($('#name').html(), 'Demi');

    user.set('name', 'Mocha');
    assert.equal($('#name').html(), 'Mocha');
  });

  it('should stop reacting', function() {
    assert.equal($('#name').html(), 'Kesha');

    tpl.destroy();

    user.set('name', 'Demi');
    assert.equal($('#name').html(), 'Kesha');
  });

  it('should emit event', function(done) {
    $('#box').bind('lm:destroy', function() {
      done();
    });

    tpl.destroy();
  });
});
