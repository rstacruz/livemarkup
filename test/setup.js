global.getFile = getFile;
global.assert = require('chai').assert;
global.expect = require('chai').expect;
global.extend = require('util')._extend;
global.sinon = require('sinon');
global.inspect = inspect;

module.exports = {
  env: env
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
      window.console = console;
      extend(global, {
        window   : window,
        Backbone : window.Backbone,
        LM       : window.LM,
        $        : window.$
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
