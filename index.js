#!/usr/bin/env node

'use strict'

// ===================================================================

var JSONStream = require('JSONStream')
var parseCsv = require('csv-parser')
var pumpify = require('pumpify')

// ===================================================================

function csv2json (opts) {
  opts || (opts = {})

  return pumpify([
    parseCsv({
      separator: opts.separator
    }),
    JSONStream.stringify()
  ])
}
exports = module.exports = csv2json
