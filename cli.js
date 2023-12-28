#!/usr/bin/env node

'use strict'

var minimist = require('minimist')
var csv2json = require('./')
var pkg = require('./package.json')

// ===================================================================

function createOutputStream (path) {
  if (path !== undefined && path !== '-') {
    return require('fs').createWriteStream(path)
  }

  // If path is unspecified or a dash (“-”), use process.stdout
  return process.stdout
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
    console.log(usage)
    return
  }

  const inputFilePath = args._[0]
  const outputFilePath = args._[1]

  if (!inputFilePath) {
    console.error('Please provide an input file path.')
    return
  }

  const outputStream = createOutputStream(outputFilePath)

  csv2json(inputFilePath, { // Pass the file path
    dynamicTyping: args['dynamic-typing'],
    separator: args.tsv ? '\t' : args.separator
  }, function (err, jsonArray) {
    if (err) {
      console.error('An error occurred:', err)
      process.exit(1)
    } else {
      // Convert the jsonArray to JSON string and write to the output stream
      outputStream.write(JSON.stringify(jsonArray, null, 2))
      outputStream.end()
    }
  })
}

if (!module.parent) {
  main(process.argv.slice(2))
}
