(function(lm) {
  if (typeof module === 'object') module.exports = lm;
  else this.LM = lm;
})(function($) {

  var LM = {};
  var Templates, Tag;

  var templates = {};

  LM.tagSettings = {
    tag: /\{\{([\s\S]+?)\}\}/g
  };

  /**
   * Registers a template.
   *
   *      LM.register('person/card', '<div>...</div>');
   *      LM.get('person/card');
   */

  LM.register = function(name, code) {
    templates[name] = code;
  };

  /**
   * Returns a template.
   * See: [LM.register()]
   */

  LM.get = function(name, el) {
    if (!(name in templates)) {
      throw new Error("No such template: "+name);
    }

    var code = templates[name];
    var html = $(el).html(code);
    return new LM.template(html, el);
  };

  /**
   * Template.
   */

  Template = LM.template = function($el) {
    this.$el = $el;
    this.model = null;
    this.locals = {};
  };

  Template.prototype.bind = function(object) {
    this.model = object;
    return this;
  };

  /**
   * Passes through the `$el` element, combs out the tags, and binds
   * appropriately.
   * @api private
   */

  Template.prototype.initialize = function() {
    this.tags = LM.parseTags(this.$el);
  };

  Template.prototype.render = function() {
    this.initialize();
  };

  /**
   * Returns a list of text tags.
   * @api private
   */

  LM.parseTags = function($el) {
    var tags = [];
    var regex = LM.tagSettings.tag;

    $el.find('*').andSelf().each(function(i) {
      var parent = this;

      eachTextNode(this, function(node, text) {

        // Remove the text nodes from the DOM, and parse out the tags.
        parent.removeChild(node);
        var matches = text.split(regex);

        // Put them all back in, in the same order, catching the tags.
        _.each(matches, function(match, i) {
          var isTag = (i % 2 === 1);
          if (!isTag) {
            appendText(parent, match);
          } else {
            var node = appendText(parent, "");
            var tag = new Tag(node, match);
            tags.push(node);
          }
        });
      });
    });

    return tags;
  };

  Tag = LM.Tag = function(node, src) {
    this.node = node;
    this.src = src;
  };

  return LM;

  // Helpers
  // -------

  /**
   * Iterates through each text node child of a given element.
   * @api private
   */

  function eachTextNode(node, block) {
    $(node).contents().each(function() {
      if (this.nodeType !== 3) return;
      block(this, this.nodeValue);
    });
  }

  /**
   * Creates a text node and appends to a given parent.
   */
  function appendText(parent, text) {
    var node = document.createTextNode(text);
    parent.appendChild(node);

    return node;
  }

}(jQuery || Zepto || ender));
