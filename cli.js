#!/usr/bin/env node

'use strict';

//====================================================================

var combine = require('stream-combiner');
var eventToPromise = require('event-to-promise');
var minimist = require('minimist');
var multiline = require('multiline');

var csv2json = require('./');

//====================================================================

var usage = multiline.stripIndent(function () {/*
  Usage: csv2json [-s <separator>] < file.csv > file.json
*/});

function main(args) {
  args = minimist(args, {
    boolean: 'help',
    string: 'separator',

    alias: {
      help: 'h',
      separator: 's',
    },
  });

  if (args.help) {
    return usage;
  }

  return eventToPromise(combine([
    process.stdin,
    csv2json({
      separator: args.separator,
    }),
    process.stdout,
  ]), 'finish');
}
exports = module.exports = main;

//====================================================================

if (!module.parent) {
  require('exec-promise')(exports);
}
