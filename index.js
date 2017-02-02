'use strict'

// ===================================================================

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
    (function () {
      var notFirst = false
      var proxy = through2.obj(function (chunk, _, done) {
        if (notFirst) {
          this.push(',\n')
        }
        notFirst = true

        done(null, JSON.stringify(chunk))
      }, function (done) {
        this.push('\n]\n')
        done()
      })
      proxy.push('[\n')

      return proxy
    })()
  ])
}
exports = module.exports = csv2json
