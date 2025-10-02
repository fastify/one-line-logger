'use strict'

const { Bench } = require('tinybench')
const formatDate = require('../lib/format-date')

const now = Date.now()

const benchmark = new Bench()

benchmark.add('formatDate', function () { formatDate(now) })

benchmark.run().then(() => {
  console.table(benchmark.table())
})
