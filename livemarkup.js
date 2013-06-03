(function(lm) {
  if (typeof module === 'object') module.exports = lm;
  else this.LM = lm;
})(function($) {

  var LM = {};
  var templates = {};

  // ----------------------------------------------------------------------------

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

  LM.get = function(name, element) {
    if (!(name in templates))
      throw new Error("No such template: "+name);

    // Get code.
    var code = templates[name];

    // If it's a Backbone view, extract the element
    var view;
    if (element.el) { view = element; element = view.el; }

    // Append the DOM into the element, then initialize the template.
    var html = $(element).html(code);
    var tpl = new Template(html);

    // Register the view if needed.
    if (view) tpl.locals({ view: view });

    return tpl;
  };

  // ----------------------------------------------------------------------------

  /**
   * Template.
   */

  function Template($el) {
    this.$el = $el;
    this.model = null;
    this.localContext = {};
    this.directives = [];
    this._initialized = false;
  }

  /**
   * Sets the target model of the template to the given object.
   */

  Template.prototype.bind = function(model) {
    this.model = model;

    return this;
  };

  Template.prototype.render = function() {
    this.initialize();
    _.each(this.directives, function(dir) { dir.render(); });

    return this;
  };

  /**
   * Passes through the `$el` element, combs out the directives, and binds
   * appropriately.
   *
   * Called on first [Template#render()]. No need to call manually.
   *
   * @api private
   */

  Template.prototype.initialize = function() {
    if (this._initialized) return;

    this.directives = LM.fetchDirectives(this.$el, this);
    this._initialized = true;

    return this;
  };

  /**
   * Registers some variables as locals.
   */
  Template.prototype.locals = function(obj) {
    if (typeof obj === 'object') {
      _.extend(this.localContext, obj);
    }

    else if (arguments.length === 2) {
      this.localContext[arguments[0]] = arguments[1];
    }

    return this;
  };

  // ----------------------------------------------------------------------------

  /**
   * Gets a list of text tags. Returns an array of Tag instances.
   * @api private
   */

  LM.fetchDirectives = function($el, template) {
    var directives = [];
    var regex = LM.tagSettings.tag;

    $el.find('*').andSelf().each(function(i) {
      var parent = this;

      eachAttribute(this, function(name, value) {
        var d = parseDirective(name, value);
        if (!d) return;

        d = new Directive(template, parent, d.action, d.param, d.value);
        directives.push(d);
      });
    });

    return directives;
  };

  // ----------------------------------------------------------------------------

  function Directive(template, el, action, param, value) {
    this.$el = $(el);
    this.onrender = null;
    this.template = template;
    this.model = template.model;
    this.getters = [];

    // Apply the action
    LM.actions[action].apply(this, [param]);

    // Work the shit
    var ctx = new Context(this);
    var fn = new Function('ctx', 'ctx.' + value);
    fn(ctx);
  }

  /**
   * Returns the value of a given directive.
   * Runs all the `getter` functions (as set by the modifiers) and returns the
   * value.
   */
  Directive.prototype.getValue = function() {
    var dir = this;

    return _.inject(this.getters, function(val, fn) {
      return fn.apply(dir, [val]);
    }, null);
  };

  Directive.prototype.render = function() {
    if (this.onrender)
      this.onrender.apply(this);
  };

  // ----------------------------------------------------------------------------

  LM.actions = {};

  LM.actions.text = function() {
    this.onrender = function() {
      this.$el.text(this.getValue());
    };
  };

  // ----------------------------------------------------------------------------

  function Context(dir) {
    this.directive = dir;
  }

  LM.mods = Context.prototype;

  LM.mods.attr = function(model, name) {
    var dir = this.directive;

    if (!name) { name = model; model = null; }
    if (!model) { model = dir.model; }
    if (!model) { throw new Error("attr(): no model to bind to"); }

    dir.getters.push(function() {
      return dir.model.get(name);
    });
    return this;
  };

  LM.mods.on = function(model, name) {
    var dir = this.directive;

    if (!name) { name = model; model = null; }
    if (!model) { model = dir.model; }
    if (!model) { throw new Error("on(): no model to bind to"); }

    model.on(name, function() { dir.render(); });
    return this;
  };

  LM.mods.format = function(fn) {
    var dir = this.directive;
    dir.getters.push(fn);
    return this;
  };

  // ----------------------------------------------------------------------------
  // Helpers

  return LM;

  /**
   * Iterates through each attribute of a given element.
   * @api private
   */

  function eachAttribute(node, block) {
    _.each(node.attributes, function(attr) {
      block(attr.nodeName, attr.nodeValue);
    });
  }

  /**
   * Parses a DOM Attribute (name/value pair) and returns an object hash.
   * The hash has the following things:
   *
   *   - action  : name of action
   *   - param   : params to be passed to action
   *   - value   : the value getter (in JS code string)
   *
   * @api private
   */
  function parseDirective(name, value) {
    var m = name.match(/^@([a-zA-Z0-9\_]+)$/);
    if (!m) return;

    var re = {};
    re.action = m[1];
    re.param = '';
    re.value = value
      .replace(/-> (.*)$/, function(_, fn) {
        return '.format(function(val) { return ('+fn+'); })';
      })
     .replace(/^(\.+)/, '');

    return re;
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
