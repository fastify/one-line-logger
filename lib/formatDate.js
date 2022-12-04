'use strict'

const twoPaddedNumbers = new Array(60).fill(0).map((v, i) => i.toString().padStart(2, '0'))
const threePaddedNumbers = new Array(1000).fill(0).map((v, i) => i.toString().padStart(3, '0'))

const monthLookup = new Array(12).fill(0).map((v, i) => (i + 1).toString().padStart(2, '0'))
const tzOffsetLookup =  {}

for (let i = -900; i < 900; i += 15) {
  tzOffsetLookup[i] = (i > 0 ? '-' : '+') + ('' + (Math.floor(Math.abs(i) / 60) * 100 + (Math.abs(i) % 60))).padStart(4, '0')
}

function formatDate(timestamp) {
  const date = new Date(timestamp)
  return date.getFullYear() + '-'
    + monthLookup[date.getMonth()] + '-'
    + twoPaddedNumbers[date.getDate()] + ' '
    + twoPaddedNumbers[date.getHours()] + ':'
    + twoPaddedNumbers[date.getMinutes()] + ':'
    + twoPaddedNumbers[date.getSeconds()] + '.'
    + threePaddedNumbers[date.getMilliseconds()]
    + tzOffsetLookup[date.getTimezoneOffset()]
}

module.exports = formatDate
