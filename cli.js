#!/usr/bin/env node

'use strict'

var createReadStream = require('fs').createReadStream
var createWriteStream = require('fs').createWriteStream

var eventToPromise = require('event-to-promise')
var minimist = require('minimist')
var pump = require('pump')

var csv2json = require('./')
var pkg = require('./package.json')

// ===================================================================

var usage = [
  'Usage: ' + pkg.name + ' [OPTIONS] [<input file> [<output file>]]',
  '',
  '  -d, --dynamic-typing',
  '    Convert booleans and numeric to their type instead of strings.',
  '',
  '  -s <separator>, --separator=<separator>',
  '    Field separator to use (default to comma “,”).',
  '',
  '  -t, --tsv',
  '    Use tab as separator, overrides separator flag.',
  '',
  '  <input file>',
  '    CSV file to read data from.',
  '    If unspecified or a dash (“-”), use the standard input.',
  '',
  '  <output file>',
  '    JSON file to write data to.',
  '    If unspecified or a dash (“-”), use the standard output.',
  '',
  pkg.name + ' v' + pkg.version
]

function main (args) {
  var _ref

  args = minimist(args, {
    boolean: ['dynamic-typing', 'help', 'tsv'],
    string: 'separator',

    alias: {
      help: 'h',
      d: 'dynamic-typing',
      separator: 's',
      tsv: 't'
    }
  })

  if (args.help) {
    return usage
  }

  var input = (_ref = args._[0]) && (_ref !== '-')
    ? createReadStream(_ref)
    : process.stdin

  var output = (_ref = args._[1]) && (_ref !== '-')
    ? createWriteStream(_ref)
    : process.stdout

  return eventToPromise(pump([
    input,
    csv2json({
      dynamicTyping: args['dynamic-typing'],
      separator: args.tsv ? '\t' : args.separator
    }),
    output
  ]), 'finish')
}
exports = module.exports = main

// ===================================================================

if (!module.parent) {
  require('exec-promise')(exports)
}
