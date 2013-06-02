process.stdout.write('Starting test environment');

global.getFile = function(filepath) {
  var path = require('path');
  var fs = require('fs');
  return fs.readFileSync(path.resolve(__dirname, '..', filepath)).toString();
};

global.chai = require('chai');
global.assert = chai.assert;
chai.should();

var jsdom = require('jsdom');

function env(done) {
  jsdom.env({
    html: '<!doctype html>',
    src: [
      getFile('test/vendor/jquery-1.9.1.js'),
      getFile('test/vendor/coffee-script-1.6.2.js'),
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
