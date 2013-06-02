(function(lm) {
  if (typeof module === 'object') module.exports = lm;
  else this.LM = lm;
})(function($) {

  var LM = {};
  var templates = {};

  // ----------------------------------------------------------------------------
  //
  LM.tagSettings = {
    tag: /\{\{([\s\S]+?)(?:\s+->\s+([\s\S]+?))?\}\}/g
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
        var directive;
        _.each(matches, function(match, i) {
          var type = ['text', 'directives', 'code'][i % 3];

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
    this.formatters = [new Function("return "+formatter)];
    this.template = template;
    this.getters = [];
    this.dsl = new TagContext(this);
    this.onrender = null;
  }

  /**
   * Returns the value of the current tag.
   * The tag value is determined by some directives (like `attr`), and finally,
   * fixed by the formatter.
   */

  Tag.prototype.getValue = function() {
    var re;
    var context = this.node.model;

    _.each(this.formatters, function(fn) {
      re = fn.call(context, re);
    });

    return re;
  };

  /**
   * Applies directives to the tags.
   * @api private
   */

  Tag.prototype.parse = function() {
    var fn = new Function('dsl', 'dsl.'+this.src);
    fn.apply(this, [this.dsl]);
  };

  Tag.prototype.render = function() {
    if (this.onrender) this.onrender();
  };

  Tag.prototype.addFormatter = function(fn) {
  };

  // ----------------------------------------------------------------------------

  /**
   * DSL for tags.
   * This is the context of which directives are applied to.
   *
   * @api private
   */

  function TagContext(tag) {
    this.tag = tag;
    this.template = this.tag.template;
  }

  // ----------------------------------------------------------------------------
  // Directives

  LM.directives = TagContext.prototype;

  /**
   * Changes the HTML of the tag's parent node.
   */

  LM.directives.html = function() {
    var tag = this.tag;

    tag.parent = $(tag.node).parent();

    tag.onrender = function() {
      tag.parent.html(tag.getValue());
    };

    return this;
  };

  /**
   * Changes the text of the tag's text node.
   */

  LM.directives.text = function() {
    var tag = this.tag;

    tag.onrender = function() {
      tag.node.nodeValue = tag.getValue();
    };

    return this;
  };

  /**
   * Makes the current tag listen to a model event. When the event is fired,
   * the tag is re-rendered.
   */

  LM.directives.on = function(model, event) {
    if (!event) { event = model; model = null; }

    var tag = this.tag;
    var template = this.template;
    if (!model) model = template.model;

    // Error: listening without a model
    if (!model) return;

    model.on(event, function() { tag.render(); });

    return this;
  };

  /**
   * Makes the current tag listen to the change event of the `attr` in optional
   * `model`. Also, makes the tag value get from them model attr.
   */

  LM.directives.attr = function(model, attr) {
    if (!event) { attr = model; model = null; }

    var tag = this.tag;
    var template = this.template;
    if (!model) model = template.model;

    // FIXME not supporting multi-space
    this.on(model, 'change:'+attr);
    tag.addFormatter(function() { model.get(attr); });

    return this;
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
