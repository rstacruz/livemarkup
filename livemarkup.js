(function(lm) {
  if (typeof module === 'object') {
    module.exports = lm;
  } else {
    this.LM = lm;
  }
})(function($) {

  var LM = {};
  return LM;

}(jQuery || Zepto || ender));
