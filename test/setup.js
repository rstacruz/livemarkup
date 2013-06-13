// Dependencies (global)
global.assert = require('chai').assert;
global.expect = require('chai').expect;
global.sinon = require('sinon');

// Helpers
require('./support/helpers');

var env = require('./support/env');
var jqVersions = ['jquery-1.5', 'jquery-1.9', 'jquery-1.10', 'jquery-2.0', 'zepto-1.0'];

global.miniSuite = env.suite(['jquery-1.10'], livemarkupEnv);
global.fullSuite = env.suite(jqVersions, livemarkupEnv);
global.testSuite = process.env.full ? fullSuite : miniSuite;

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


