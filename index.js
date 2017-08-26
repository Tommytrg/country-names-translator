'use strict'

const fs = require('fs')

function readCountries () {
  return JSON.parse(fs.readFileSync('countries.json', 'utf8'))
}

console.log(readCountries())

module.exports = {}
