global.getFile = getFile;
global.assert = require('chai').assert;
global.expect = require('chai').expect;
global.extend = require('util')._extend;
global.sinon = require('sinon');
global.inspect = inspect;
global.multi = multi;

module.exports = { env: env };

var jsdom = require('jsdom');
function env(done) {
  jsdom.env({
    html: '<!doctype html><html><head></head><body></body></html>',
    src: [
      getFile('test/vendor/jquery-1.9.1.js'),
      getFile('test/vendor/underscore-1.4.4.js'),
      getFile('test/vendor/backbone-1.0.0.js'),
      getFile('livemarkup.js')
    ],
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
}

function getFile(filepath) {
  var path = require('path');
  var fs = require('fs');
  return fs.readFileSync(path.resolve(__dirname, '..', filepath)).toString();
}

function inspect(obj) {
  console.log('\n==> ', require('util').inspect(obj, { colors: true }));
}

function multi(name, fn) {
  ['jquery-1.9.1', 'zepto-1.0'].forEach(function(lib) {
    describe(lib, function() {
      beforeEach(customEnv({ jquery: lib }));
      describe(name, fn);
    });
  });
}

function customEnv(src) {
  var sources = [
    getFile('test/vendor/'+src.jquery+'.js'),
    getFile('test/vendor/underscore-1.4.4.js'),
    getFile('test/vendor/backbone-1.0.0.js')
  ];

  return function(done) {
    jsdom.env({
      html: '<!doctype html><html><head></head><body></body></html>',
      src: sources.concat([getFile('livemarkup.js')]),
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
