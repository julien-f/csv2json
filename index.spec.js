/* estlint-env jest */

const getStream = require('get-stream')
const { createReadStream } = require('fs')

const csv2json = require('./')
const files = require('glob').sync(`${__dirname}/fixtures/*.csv`)

describe('csv2json', () => {
  files.forEach(file => it(file, () => getStream(
    csv2json(createReadStream(file))
  ).then(json => {
    expect(json).toMatchSnapshot()
  })))
})
