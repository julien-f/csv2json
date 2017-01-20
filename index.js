'use strict'

// ===================================================================

var ndjson = require('ndjson')
var parseCsv = require('csv-parser')
var pumpify = require('pumpify')
var through2 = require('through2')
var stripBomStream = require('strip-bom-stream')

// ===================================================================

function csv2json (opts) {
  opts || (opts = {})

  return pumpify([
    stripBomStream(),
    parseCsv({
      separator: opts.separator
    }),
    ndjson.stringify(),
    (function () {
      var notFirst = false
      var proxy = through2(function (chunk, _, done) {
        if (notFirst) {
          this.push(',\n')
        }
        notFirst = true

        done(null, chunk)
      }, function (done) {
        this.push(']\n')
        done()
      })
      proxy.push('[\n')

      return proxy
    })()
  ])
}
exports = module.exports = csv2json
