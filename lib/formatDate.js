'use strict'

const TWO_PADDED_NUMBERS = new Array(60).fill(0).map((v, i) => i.toString().padStart(2, '0'))
const THREE_PADDED_NUMBERS = new Array(1000).fill(0).map((v, i) => i.toString().padStart(3, '0'))

const MONTH_LOOKUP = new Array(12).fill(0).map((v, i) => (i + 1).toString().padStart(2, '0'))
const TZ_OFFSET_LOOKUP = {}

for (let i = -900; i < 900; i += 15) {
  TZ_OFFSET_LOOKUP[i] = (i > 0 ? '-' : '+') + ('' + (Math.floor(Math.abs(i) / 60) * 100 + (Math.abs(i) % 60))).padStart(4, '0')
}

function formatDate (timestamp) {
  const date = new Date(timestamp)
  return date.getFullYear() + '-' +
    MONTH_LOOKUP[date.getMonth()] + '-' +
    TWO_PADDED_NUMBERS[date.getDate()] + ' ' +
    TWO_PADDED_NUMBERS[date.getHours()] + ':' +
    TWO_PADDED_NUMBERS[date.getMinutes()] + ':' +
    TWO_PADDED_NUMBERS[date.getSeconds()] + '.' +
    THREE_PADDED_NUMBERS[date.getMilliseconds()] +
    TZ_OFFSET_LOOKUP[date.getTimezoneOffset()]
}

module.exports = formatDate
