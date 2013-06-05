var Setup = require('./setup');

multi('directives', function() {
  var $parent, user;

  describe("basic case", function() {
    beforeEach(function() {
      $parent = $("<div class='container'>")
        .html("<p><span id='message' @text='-> \"hello\"'></span></p>")
        .appendTo("body");

      tpl = LM($parent).render();
    });

    it('should not be visible', function() {
      var html = $('div').html();
      assert.notMatch(html, /\@text/);
    });
  });

  describe("multiple", function() {
    beforeEach(function() {
      $parent = $("<div>")
        .appendTo("body")
        .html(
          "<span id='name' @text='-> \"John\"'></span>" +
          "<em   id='age'  @text='-> \"20\"'></em>");

      tpl = LM($parent).bind(user).render();
    });

    it("should both work", function() {
      var expected = '<span id="name">John</span><em id="age">20</em>';
      assert.equal($parent.html(), expected);
    });

    it("1st should work", function() {
      assert.equal($('#name').text(), "John");
    });

    it("2nd should work", function() {
      assert.equal($('#age').text(), "20");
    });
  });

});
