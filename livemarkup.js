(function(lm) {
  if (typeof module === 'object') module.exports = lm;
  else this.LM = lm;
})(function($) {

  var LM = {};
  var Templates;

  var templates = {};

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

  LM.get = function(name) {
    if (!(name in templates)) {
      throw new Error("No such template: "+name);
    }

    var code = templates[name];
    var html = $("<div>"+code);
    return new LM.template(html);
  };

  /**
   * Template.
   */

  Template = LM.template = function(element) {
  };

  // 1: parse tags out of the DOM
  // 2: parse the tags themselves
  LM.mutator = {};

  return LM;

}(jQuery || Zepto || ender));
