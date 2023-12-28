var csv2json = require('./index2')

csv2json('example.csv', { dynamicTyping: true, separator: ',' }, function (err, jsonData) {
  if (err) {
    console.error('Error:', err)
  } else {
    console.log(JSON.stringify(jsonData, null, 2))
  }
})
