// Dependencies (global)
global.assert = require('chai').assert;
global.expect = require('chai').expect;
global.sinon = require('sinon');

// Helpers
require('./support/helpers');

var fs = require('fs');
var multisuite = require('./support/multisuite');

var jqVersions = ['jq-1.5', 'jq-1.9', 'jq-1.10', 'jq-2.0', 'zepto-1.0'];

global.miniSuite = multisuite(['jq-1.10'], livemarkupEnv);
global.fullSuite = multisuite(jqVersions, livemarkupEnv);
global.testSuite = process.env.full ? fullSuite : miniSuite;

var scripts = {
  'jq-1.5':     fs.readFileSync('./test/vendor/jquery-1.5.js'),
  'jq-1.9':     fs.readFileSync('./test/vendor/jquery-1.9.js'),
  'jq-1.10':    fs.readFileSync('./test/vendor/jquery-1.10.js'),
  'jq-2.0':     fs.readFileSync('./test/vendor/jquery-2.0.js'),
  'zepto-1.0':  fs.readFileSync('./test/vendor/zepto-1.0.js'),
  'underscore': fs.readFileSync('./test/vendor/underscore-1.4.4.js'),
  'backbone':   fs.readFileSync('./test/vendor/backbone-1.0.0.js'),
  'livemarkup': fs.readFileSync('./livemarkup.js')
};

function livemarkupEnv(jq) {
  var jsdom = require('jsdom');
  return function(done) {
    jsdom.env({
      html: '<!doctype html><html><head></head><body><div id="body"></div></body></html>',
      src: [ scripts[jq], scripts.underscore, scripts.backbone, scripts.livemarkup ],
      done: function(errors, window) {
        window.console  = console;
        global.window   = window;
        global.Backbone = window.Backbone;
        global.jQuery   = window.jQuery;
        global.LM       = window.LM;
        global.$        = window.$;
        global._        = window._;
        done(errors);
      }
    });
  };
}

