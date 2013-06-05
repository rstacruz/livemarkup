var Setup = require('./setup');

describe('if()', function() {
  var tpl, $el, user, outerFn, innerFn;

  beforeEach(Setup.env);

  beforeEach(function() {
    outerFn = sinon.stub().returns("One");
    innerFn = sinon.stub().returns("Two");
  });

  beforeEach(function() {
    $el = $("<div id='box'>")
      .html(
        "<div class='user'>" +
          "[" +
          "<span @if='attr(\"admin\")'>Admin user</span>" +
          "]" +
        "</div>")
      .appendTo("body");

    tpl = new LM.template($el);
  });

  it("should work with false", function() {
    user = new Backbone.Model({ admin: false });
    tpl.bind(user).render();

    var expected = '<div class="user">[]</div>';
    assert.equal($("#box").html(), expected);
  });

  it("should work with true", function() {
    user = new Backbone.Model({ admin: true });
    tpl.bind(user).render();

    var expected = '<div class="user">[<span>Admin user</span>]</div>';
    assert.equal($("#box").html(), expected);
  });

});
