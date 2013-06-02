(function(lm) {
  if (typeof module === 'object') module.exports = lm;
  else this.LM = lm;
})(function($) {

  var LM = {};
  var templates = {};

  // ----------------------------------------------------------------------------
  //
  LM.tagSettings = {
    tag: /\{\{([\s\S]+?)(?: -> ([\s\S]+?))?\}\}/g
  };

  // ----------------------------------------------------------------------------
  // LM methods

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
    return new Template(html, el);
  };

  // ----------------------------------------------------------------------------

  /**
   * Template.
   */

  function Template($el) {
    this.$el = $el;
    this.model = null;
    this.locals = {};
    this.tags = [];
    this._initialized = false;
  }

  Template.prototype.bind = function(object) {
    this.model = object;
    return this;
  };

  Template.prototype.render = function() {
    this.initialize();

    _.each(this.tags, function(tag) {
      tag.render();
    });
  };

  /**
   * Passes through the `$el` element, combs out the tags, and binds
   * appropriately.
   *
   * Called on first [Template#render()]. No need to call manually.
   *
   * @api private
   */

  Template.prototype.initialize = function() {
    if (this._initialized) return;

    this.tags = LM.fetchTags(this.$el, this);
    _.each(this.tags, function(tag) { tag.parse(); });
    this._initialized = true;
  };

  // ----------------------------------------------------------------------------

  /**
   * Gets a list of text tags. Returns an array of Tag instances.
   * @api private
   */

  LM.fetchTags = function($el, template) {
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
          var type = ['text', 'directives', 'code'][i % 3];
          var directive;

          if (type === 'text') {
            appendText(parent, match);
          } else if (type === 'directives') {
            directive = match;
          } else {
            var node = appendText(parent, "");

            var tag = new Tag(node, directive, match, template);
            tags.push(tag);
          }
        });
      });
    });

    return tags;
  };

  // ----------------------------------------------------------------------------

  /**
   * A tag.
   */

  function Tag(node, src, formatter, template) {
    this.node = node;
    this.src = src;
    this.formatter = formatter;
    this.template = template;
    this.getters = [];
    this.context = new TagContext(this);
    this.onrender = null;
  }

  Tag.prototype.getValue = function() {
    return '?';
  };

  /**
   * @api private
   */
  Tag.prototype.parse = function() {
    new Function('context', 'context.'+this.src);
  };

  Tag.prototype.render = function() {
    if (this.onrender) this.onrender();
  };

  // ----------------------------------------------------------------------------

  /**
   * DSL for tags.
   */

  function TagContext(tag) {
    this.tag = tag;
  }

  LM.directives = TagContext.prototype;

  // ----------------------------------------------------------------------------

  LM.directives.html = function(tag, args) {
    tag.parent = $(tag.node).parent();
    tag.onrender = function() {
      tag.parent.html(tag.getValue());
    };
  };

  // ----------------------------------------------------------------------------
  // Helpers

  return LM;

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
   * @api private
   */

  function appendText(parent, text) {
    var node = document.createTextNode(text);
    parent.appendChild(node);

    return node;
  }

}(jQuery || Zepto || ender));
