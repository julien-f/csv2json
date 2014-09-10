#!/usr/bin/env node

'use strict';

//====================================================================

var combine = require('stream-combiner');
var JSONStream = require('JSONStream');
var parseCsv = require('csv-parser');

//====================================================================

function csv2json(opts) {
  opts || (opts = {});

  return combine([
    parseCsv({
      separator: opts.separator,
    }),
    JSONStream.stringify(),
  ]);
}
exports = module.exports = csv2json;
