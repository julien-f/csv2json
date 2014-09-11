#!/usr/bin/env node

'use strict';

//====================================================================

var createReadStream = require('fs').createReadStream;
var createWriteStream = require('fs').createWriteStream;

var combine = require('stream-combiner');
var eventToPromise = require('event-to-promise');
var minimist = require('minimist');
var multiline = require('multiline');

var csv2json = require('./');

//====================================================================

var usage = (function (pkg) {
  return multiline.stripIndent(function () {/*
    Usage: $name [OPTIONS] [<input file> [<output file>]]

      -s <separator>, --separator=<separator>
        Field separator to use (default to comma “,”).

      <input file>
        CSV file to read data from.
        If unspecified or a dash (“-”), use the standard input.

      <output file>
        JSON file to write data to.
        If unspecified or a dash (“-”), use the standard output.

    $name v$version
  */}).replace(/\$(\w+)/g, function (_, key) {
    return pkg[key];
  });
})(require('./package'));

function main(args) {
  var _ref;

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

  var input = (_ref = args._[0]) && (_ref !== '-') ?
    createReadStream(_ref) :
    process.stdin
  ;

  var output = (_ref = args._[1]) && (_ref !== '-') ?
    createWriteStream(_ref) :
    process.stdout
  ;

  return eventToPromise(combine([
    input,
    csv2json({
      separator: args.separator,
    }),
    output,
  ]), 'finish');
}
exports = module.exports = main;

//====================================================================

if (!module.parent) {
  require('exec-promise')(exports);
}
