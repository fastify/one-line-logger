#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const help = require('help-me')({
  dir: path.join(__dirname, 'help'),
  ext: '.txt'
})
const pump = require('pump')
const build = require('./')
const minimist = require('minimist')

const cmd = minimist(process.argv.slice(2))

helper(cmd)

const opts = minimist(process.argv, {
  alias: {
    colorize: 'c'
  }
})

const res = build(opts)
pump(process.stdin, res)

// https://github.com/pinojs/pino/pull/358
/* istanbul ignore next */
if (!process.stdin.isTTY && !fs.fstatSync(process.stdin.fd).isFile()) {
  process.once('SIGINT', function noOp () {})
}

function helper (cmd) {
  if (cmd.h || cmd.help) {
    help.toStdout()
  }
}
