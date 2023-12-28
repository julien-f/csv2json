const assert = require('assert')
const csv2json = require('../index')

const { describe, it } = require('mocha')
function delay (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
describe('csv2json', () => {
  const options = {
    dynamicTyping: true,
    separator: ','
  }
  it('should convert CSV to JSON', async () => {
    let result
    const epectedData = [
      { name: 'John', age: 25, email: 'john@example.com' },
      { name: 'Jane', age: 30, email: 'jane@example.com' }
    ]
    csv2json('example.csv', options, function (err, jsonData) {
      if (err) {
        console.error('Error:', err)
      } else {
        result = jsonData
        console.log(JSON.stringify(jsonData, null, 2))
      }
    })
    await delay(10000)
    console.log('result', result)
    assert.deepStrictEqual(result, epectedData)
  }).timeout(60000)

  it('should handle empty CSV string', () => {
    const csvString = ''
    const expectedJson = []

    const result = csv2json(csvString)

    assert.deepStrictEqual(result, expectedJson)
  })

  // Add more test cases as needed
})
