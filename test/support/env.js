/**
 * Helper for initializing a jsdom environment.
 *
 *     var myenv = env({
 *       html: '<!doctype html><html><head></head><body><div id="body"></div></body></html>',
 *       expose: ['Backbone', 'jQuery', '$', '_'],
 *       js: [
 *         'test/vendor/jquery-1.9.js',
 *         'livemarkup.js' ]
 *     });
 *
 *     beforeEach(myenv);
 */

// Dependencies (local)
var jsdom = require('jsdom');
var path = require('path');
var fs = require('fs');

module.exports = env;

/**
 * Creates a function that spawns a jsdom environment when called.
 * Options: expose, js, html
 */

function env(options) {
  var sourceCache = cache();

  return function(done) {
    jsdom.env({
      html: (options.html || '<!doctype html><html><head></head><body></body></html>'),
      src: sourceCache(options.js || [], function() { return options.js.map(getFile); }),
      done: function(errors, window) {
        window.console = console;
        global.window = window;

        (options.expose || []).forEach(function(varname) {
          global[varname] = window[varname];
        });

        done(errors);
      }
    });
  };
}

/**
 * Creates a test suite function that uses permutations of the setup script
 * (made via `generator`).
 *
 *     gen = function(version) { return function() { ... } };
 *     mysuite = env.suite(['a', 'b'], gen);
 *
 *     mysuite('event tests', function() {
 *       ....
 *     });
 */

env.suite = function(variants, generator) {
  return function(name, fn) {
    variants.forEach(function(variant) {

      var subname = name;
      if (variants.length > 1) subname = variant.toString() + " " + subname;

      describe(subname, function() {
        var arr = variant.constructor === Array ? variant : [variant];
        beforeEach(generator.apply(this, arr));
        fn.apply(this);
      });

    });
  };
};

/**
 * Creates a cache function (memoizer).
 */

function cache() {
  var hash = {};
  return function (key, fn) {
    key = JSON.stringify(key);
    if (!hash[key]) hash[key] = fn();
    return hash[key];
  };
}

/**
 * Returns a file's contents -- getFile('test/vendor/x.js')
 */

function getFile(filepath) {
  return fs.readFileSync(path.resolve(__dirname, '..', '..', filepath)).toString();
}
