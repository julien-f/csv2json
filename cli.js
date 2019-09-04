#!/usr/bin/env node

'use strict'

var createReadStream = require('fs').createReadStream
var createWriteStream = require('fs').createWriteStream
var PassThrough = require('stream').PassThrough

var eventToPromise = require('promise-toolbox/fromEvent')
var minimist = require('minimist')
var pump = require('pump')

var csv2json = require('./')
var pkg = require('./package.json')

// ===================================================================

function createInputStream (path) {
  return path === undefined || path === '-'
    ? process.stdin
    : createReadStream(path)
}

function createOutputStream (path) {
  if (path !== undefined && path !== '-') {
    return createWriteStream(path)
  }

  // introduce a through stream because stdout is not a normal stream!
  var stream = new PassThrough()
  stream.pipe(process.stdout)
  return stream
}

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
].join('\n')

function main (args) {
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

  return eventToPromise(pump([
    createInputStream(args._[0]),
    csv2json({
      dynamicTyping: args['dynamic-typing'],
      separator: args.tsv ? '\t' : args.separator
    }),
    createOutputStream(args._[1])
  ]), 'finish')
}
exports = module.exports = main

// ===================================================================

if (!module.parent) {
  require('exec-promise')(exports)
}
