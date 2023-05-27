'use strict'

process.env.TZ = 'UTC'

const path = require('path')
const spawn = require('child_process').spawn
const test = require('tap').test
const fs = require('fs')

const bin = require.resolve(path.join(__dirname, '..', 'bin.js'))
const epoch = 1522431328992
const logLine = '{"level":30,"time":1522431328992,"msg":"hello world","pid":42,"hostname":"foo"}\n'
const env = { TERM: 'dumb', TZ: 'UTC' }
const formattedEpoch = '2018-03-30 17:35:28.992+0000'

test('cli', (t) => {
  t.test('does basic reformatting', (t) => {
    t.plan(1)
    const child = spawn(process.argv[0], [bin], { env })
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.equal(data.toString(), `${formattedEpoch} - info - hello world\n`)
    })
    child.stdin.write(logLine)
    t.teardown(() => child.kill())
  })

  ;['--colorize', '-c'].forEach((optionName) => {
    t.test(`colorize logs via ${optionName}`, (t) => {
      t.plan(1)
      const child = spawn(process.argv[0], [bin, optionName], { env })
      child.on('error', t.threw)
      child.stdout.on('data', (data) => {
        t.equal(data.toString(), `${formattedEpoch} - \u001B[32minfo\u001B[39m - \u001B[36mhello world\u001B[39m\n`)
      })
      child.stdin.write(logLine)
      t.teardown(() => child.kill())
    })
  })

  t.test('passes through stringified date as string', (t) => {
    t.plan(1)
    const child = spawn(process.argv[0], [bin], { env })
    child.on('error', t.threw)

    const date = JSON.stringify(new Date(epoch))

    child.stdout.on('data', (data) => {
      t.equal(data.toString(), date + '\n')
    })

    child.stdin.write(date)
    child.stdin.write('\n')

    t.teardown(() => child.kill())
  })

  t.test('end stdin does not end the destination', (t) => {
    t.plan(2)
    const child = spawn(process.argv[0], [bin], { env })
    child.on('error', t.threw)

    child.stdout.on('data', (data) => {
      t.equal(data.toString(), 'aaa\n')
    })

    child.stdin.end('aaa\n')
    child.on('exit', function (code) {
      t.equal(code, 0)
    })

    t.teardown(() => child.kill())
  })

  t.test('change TZ', (t) => {
    t.plan(1)
    const child = spawn(process.argv[0], [bin], { env: { ...env, TZ: 'Europe/Amsterdam' } })
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.equal(data.toString(), '2018-03-30 19:35:28.992+0200 - info - hello world\n')
    })
    child.stdin.write(logLine)
    t.teardown(() => child.kill())
  })

  t.test('test help', (t) => {
    t.plan(1)
    const env = { TERM: ' dumb', TZ: 'UTC' }
    const child = spawn(process.argv[0], [bin, '--help'], { env })
    const file = fs.readFileSync('help/help.txt').toString()
    child.on('error', t.threw)
    child.stdout.on('data', (data) => {
      t.equal(data.toString(), file)
    })
    t.teardown(() => child.kill())
  })

  t.end()
})
