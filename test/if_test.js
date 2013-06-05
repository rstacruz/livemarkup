var Setup = require('./setup');

describe('if()', function() {
  var tpl, $el, user, outerFn, innerFn;

  beforeEach(Setup.env);

  beforeEach(function() {
    outerFn = sinon.stub().returns("One");
    innerFn = sinon.stub().returns("Two");
  });

  beforeEach(function() {
    user = new Backbone.Model({ name: "John" });
  });

  describe("basic case", function() {
    beforeEach(function() {
      $el = $("<div id='box'>")
        .appendTo("body")
        .html(
          "<div class='user'>" +
            "[" +
            "<span @if='attr(\"admin\")'>Admin user</span>" +
            "]" +
          "</div>");

      tpl = new LM.template($el);
    });

    it("should work with false", function() {
      user.set('admin', false);
      tpl.bind(user).render();

      var expected = '<div class="user">[]</div>';
      assert.equal($("#box").html(), expected);
    });

    it("should work with true", function() {
      user.set('admin', true);
      tpl.bind(user).render();

      var expected = '<div class="user">[<span>Admin user</span>]</div>';
      assert.equal($("#box").html(), expected);
    });

    it("should respond to changes", function() {
      user.set('admin', false);
      tpl.bind(user).render();

      var expected = '<div class="user">[]</div>';
      assert.equal($("#box").html(), expected);

      user.set('admin', true);

      expected = '<div class="user">[<span>Admin user</span>]</div>';
      assert.equal($("#box").html(), expected);
    });
  });

  // ----

  xdescribe("stopping", function() {
    beforeEach(function() {
      $el = $("<div id='box'>")
        .appendTo("body")
        .html(
          "<div @if='attr(\"admin\")'>" +
            "<strong class='name' @text='-> \"a\"'></strong>" +
            "<span @text='-> outerFn()'></span>" +
          "</div>");

      tpl = LM($el)
        .bind(user)
        .locals({ outerFn: outerFn });
    });

    it("should work", function() {
      user.set('admin', true);
      tpl.bind(user).render();
      console.log($el.html());

      assert.isTrue(outerFn.calledOnce);
    });

    it("should not call", function() {
      user.set('admin', false);
      tpl.bind(user).render();

      assert.isTrue(outerFn.notCalled);
    });

    it("directives inside should work", function() {
      user.set('admin', true);
      tpl.bind(user).render();

      assert.equal($(".name").html(), "John");
    });

  });

});
