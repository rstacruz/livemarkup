(function(lm) {
  if (typeof module === 'object') module.exports = lm;
  else this.LM = lm;
})(function($) {

  var LM = {};
  var templates = {};

  // ----------------------------------------------------------------------------

  /**
   * A template object representing a live DOM instance.
   *
   * Typically, you can get templates using the [LM.get()] system, but you can
   * instanciate them yourself from an existing DOM node.
   *
   *   var $div = $("#my_template");
   *
   *   var tpl = new LM.template($div)
   *    .bind(model)
   *    .locals({ view: view })
   *    .render();
   *
   * A template has the following properties as well:
   *
   *  - $el          : Element
   *  - model        : Reference to the main model
   *  - localContext : Locals
   *  - directives   : Array of [Directive] instances
   */

  function Template($el) {
    this.$el = $el;
    this.model = null;
    this.localContext = {};
    this.directives = [];
    this._initialized = false;

    // If it's a Backbone view
    if ($el.$el) {
      this.locals('view', $el);
      this.$el = $el.$el;
    }
  }

  LM.template = Template;

  /**
   * Sets the target model of the template to the given object.
   */

  Template.prototype.bind = function(model) {
    this.model = model;
    return this;
  };

  /**
   * Renders a template.
   * Updates all directives within a template.
   *
   * In the first time a template is rendered, models will be bound, and
   * directives will be removed from the DOM.
   */

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
   *
   *   tpl.locals({ view: myView });
   *
   * You can also use it with a pair:
   *
   *   tpl.locals('view', myView);
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

  /**
   * A directive.
   */

  function Directive(template, el, action, param, value) {
    this.$el = $(el);
    this.onrender = null;
    this.template = template;
    this.model = template.model;
    this.getters = [];

    // Apply the action
    LM.actions[action].apply(this, [param]);

    // Build the runner
    var code = 'ctx.' + value + ';';
    code = 'with(helpers) { ' + code + ' }';
    code = 'with(locals) { ' + code + ' }';
    var fn = new Function('ctx', 'helpers', 'locals', code);

    // Run it
    var ctx = new Context(this);
    fn(ctx, LM.helpers, template.localContext);
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
    this.onrender = function() { this.$el.text(this.getValue()); };
  };

  LM.actions.html = function() {
    this.onrender = function() { this.$el.html(this.getValue()); };
  };

  // ----------------------------------------------------------------------------

  function Context(dir) {
    this.directive = dir;
  }

  /**
   * Modifiers.
   */

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

    // Bind to model if need be.
    var model = dir.model;
    if (model) fn = $.proxy(fn, model);

    dir.getters.push(fn);
    return this;
  };

  // ----------------------------------------------------------------------------
  // Helpers

  LM.helpers = {};

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

}(jQuery || Zepto || ender));
