#!/usr/bin/env node
'use strict'

const { parseArgs } = require('node:util')
const oneLineLogger = require('./index')
const pkg = require('./package.json')

const HELP_TEXT = `Usage: one-line-logger [options]
       1line [options]

Options:
  -c, --colorize                   Force colorized output (use --no-colorize to disable)
  -t, --time-only                  Output only the time without date and timezone
  -f, --custom-time-format <fmt>   Use a custom dateformat pattern for timestamps
  -v, --version                    Output the version number
  -h, --help                       Display help
`

function run (argv = process.argv.slice(2), input = process.stdin, output = process.stdout) {
  const { values } = parseArgs({
    args: argv,
    options: {
      colorize: { type: 'boolean', short: 'c' },
      'time-only': { type: 'boolean', short: 't' },
      'custom-time-format': { type: 'string', short: 'f' },
      version: { type: 'boolean', short: 'v' },
      help: { type: 'boolean', short: 'h' }
    },
    allowNegative: true,
    strict: false
  })

  if (values.help) {
    output.write(HELP_TEXT)
    return null
  }

  if (values.version) {
    output.write(`${pkg.version}\n`)
    return null
  }

  const stream = oneLineLogger({
    colorize: values.colorize,
    timeOnly: Boolean(values['time-only']),
    customTimeFormat: values['custom-time-format'],
    destination: output
  })

  input.pipe(stream)
  return stream
}

if (require.main === module) {
  run()
}

module.exports = run
module.exports.HELP_TEXT = HELP_TEXT
