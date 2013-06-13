// Dependencies (global)
global.assert = require('chai').assert;
global.expect = require('chai').expect;
global.sinon = require('sinon');

// Helpers
require('./support/helpers');

var env   = require('./support/env').env;
var suite = require('./support/env').suite;

global.testSuite = function(name, fn) {
  return process.env.full ?
    fullSuite(name, fn) :
    miniSuite(name, fn);
};

function miniSuite(name, fn) {
  return suite(name, null, livemarkupEnv('jquery-1.10'), fn);
}

function fullSuite(name, fn) {
  var versions = ['jquery-1.9', 'jquery-1.10', 'jquery-1.5', 'zepto-1.0', 'jquery-2.0'];
  versions.forEach(function(jq) {
    suite(name, jq, livemarkupEnv(jq), fn);
  });
}

function livemarkupEnv(jq) {
  return env({
    html: '<!doctype html><html><head></head><body><div id="body"></div></body></html>',
    expose: ['Backbone', 'LM', 'jQuery', '$', '_'],
    js: [
      'test/vendor/'+jq+'.js',
      'test/vendor/underscore-1.4.4.js',
      'test/vendor/backbone-1.0.0.js',
      'livemarkup.js' ]
  });
}


