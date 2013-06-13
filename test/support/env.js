/**
 * Helper for initializing a jsdom environment.
 */

// Dependencies (local)
var jsdom = require('jsdom');
var path = require('path');
var fs = require('fs');

module.exports = { env: env, suite: suite };

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
 * Creates a test suite named `name` (with `prefix`), includes a `setup`
 * function, and runs `fn`.
 */

function suite(name, prefix, setup, fn) {
  if (prefix) name = prefix + ' ' + name;
  describe(name, function() {
    if (setup) beforeEach(setup);
    fn.apply(this);
  });
}

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
