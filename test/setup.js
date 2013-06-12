// Dependencies (global)
global.assert = require('chai').assert;
global.expect = require('chai').expect;
global.extend = require('util')._extend;
global.sinon = require('sinon');

// Dependencies (local)
var jsdom = require('jsdom');
var sourceCache = cache();

// Helpers
global.inspect = inspect;
global.getFile = getFile;
global.testSuite = testSuite;
global.html = html;
global.template = template;

// Setup exports
module.exports = { env: customEnv({ jquery: 'jquery-1.9.1' }) };

/**
 * Returns a file's contents -- getFile('test/vendor/x.js')
 */

function getFile(filepath) {
  var path = require('path');
  var fs = require('fs');
  return fs.readFileSync(path.resolve(__dirname, '..', filepath)).toString();
}

/**
 * Inspects a given object's value
 */

function inspect(obj) {
  console.log('\n==> ', require('util').inspect(obj, { colors: true }));
}

/**
 * Runs a test context in multpile libs
 */

function testSuite(name, fn) {
  // Run in just the default environment
  if (!process.env.full) {
    describe(name, function() {
      beforeEach(customEnv({ jquery: 'jquery-2.0.2' }));
      fn.apply(this);
    });
  }

  else {
    var versions = ['jquery-1.9.1', 'jquery-1.10.1', 'jquery-1.5.2', 'zepto-1.0', 'jquery-2.0.2'];
    versions.forEach(function(jq) {
      describe(jq, function() {
        beforeEach(customEnv({ jquery: jq }));
        describe(name, fn);
      });
    });
  }
}

/**
 * Returns a function that generates a custom jsdom env
 */

function customEnv(src) {
  var sources = sourceCache(src, function() {
    return [
      getFile('test/vendor/'+src.jquery+'.js'),
      getFile('test/vendor/underscore-1.4.4.js'),
      getFile('test/vendor/backbone-1.0.0.js'),
      getFile('livemarkup.js')
    ];
  });

  return function(done) {
    jsdom.env({
      html: '<!doctype html><html><head></head><body></body></html>',
      src: sources,
      done: function(errors, window) {
        window.console = console;
        extend(global, {
          window   : window,
          Backbone : window.Backbone,
          LM       : window.LM,
          $        : window.$,
          _        : window._
        });
        done(errors);
      }
    });
  };
}

/**
 * Creates a cache
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
 * Render HTML
 */

function html(str) {
  return $(str.replace(/`/g, "'")).appendTo('body');
}

/**
 * Render template
 */

function template(str) {
  var $parent = html(str);
  return LM($parent);
}
