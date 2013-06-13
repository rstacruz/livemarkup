(function() {

  /**
   * Render HTML
   */

  global.html = function(str) {
    return $(str.replace(/`/g, "'")).appendTo('#body');
  };

  /**
   * Render template
   */

  global.template = function(str) {
    var $parent = html(str);
    return LM($parent);
  };

  assert.htmlEqual = function(left, right) {
    function normalize(str) { return $('<div>').html(str).html(); }

    assert.equal(normalize(left), normalize(right));
  };

})();
