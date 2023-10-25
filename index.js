'use strict'

var fs = require('fs')
var parseCsv = require('csv-parser')

/**
 * Parses dynamic values in an object.
 * @param {Object} data - The object containing dynamic values.
 */
function parseDynamic (data) {
  for (var name in data) {
    if (Object.prototype.hasOwnProperty.call(data, name)) {
      var value = data[name].toLowerCase()
      if (value === 'true') {
        data[name] = true
      } else if (value === 'false') {
        data[name] = false
      } else if (value !== '') {
        var numericValue = +value
        if (!isNaN(numericValue)) {
          data[name] = numericValue
        }
      }
    }
  }
}

/**
 * Converts CSV to JSON.
 * @param {string} filePath - The path to the CSV file.
 * @param {Object} options - The options for CSV to JSON conversion.
 * @param {boolean} options.dynamicTyping - Whether to parse dynamic values.
 * @param {string} options.separator - The separator used in the CSV.
 * @param {function} callback - Callback function to handle the JSON data.
 */
function csv2json (filePath, options, callback) {
  options = options || {}
  var process = options.dynamicTyping ? parseDynamic : function () { }

  var jsonArray = []
  fs.createReadStream(filePath)
    .pipe(parseCsv({ separator: options.separator }))
    .on('data', function (data) {
      process(data)
      jsonArray.push(data)
    })
    .on('end', function () {
      callback(null, jsonArray)
    })
    .on('error', function (error) {
      callback(error)
    })
}

// Example usage:

exports = module.exports = csv2json
