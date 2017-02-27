'use strict'

// ===================================================================

var parseCsv = require('csv-parser')
var pumpify = require('pumpify')
var through2 = require('through2')
var stripBomStream = require('strip-bom-stream')

// ===================================================================

function noop () {}

var hasOwn = Object.prototype.hasOwnProperty
function parseDynamic (data) {
  var name, value
  for (name in data) {
    if (hasOwn.call(data, name)) {
      value = data[name].toLowerCase()
      if (value === 'true') {
        data[name] = true
      } else if (value === 'false') {
        data[name] = false
      } else if (value !== '') {
        value = +value
        if (!isNaN(value)) {
          data[name] = value
        }
      }
    }
  }
}

function csv2json (opts) {
  opts || (opts = {})

  var process = opts.dynamicTyping
    ? parseDynamic
    : noop

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

        process(chunk)

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
