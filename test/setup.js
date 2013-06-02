process.stdout.write('Starting test environment');

global.getFile = function(filepath) {
  var path = require('path');
  var fs = require('fs');
  return fs.readFileSync(path.resolve(__dirname, '..', filepath)).toString();
};

global.assert = require('chai').assert;
global.expect = require('chai').expect;

/* multiline */
global.ml = function(list) {
  return list.join("\n");
};

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
      global.window = window;
      global.$ = window.jQuery;
      global.LM = window.LM;
      done(errors);
    }
  });
}

module.exports = {
  env: env
};
