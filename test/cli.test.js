'use strict'

const { spawn } = require('node:child_process')
const { once } = require('node:events')
const path = require('node:path')
const { PassThrough } = require('node:stream')
const { before, after, test } = require('node:test')
const run = require('../bin')
const pkg = require('../package.json')
const { EPOCH, TIME, TIME_ONLY, mockTime, unmockTime } = require('./helpers')

const binPath = path.join(__dirname, '..', 'bin.js')
const logLine = `${JSON.stringify({ level: 30, time: EPOCH, msg: 'hello world', pid: 42, hostname: 'foo' })}\n`

before(() => {
  mockTime()
})

after(() => {
  unmockTime()
})

test('cli formats piped log lines with --no-colorize', async (t) => {
  const input = new PassThrough()
  const output = new PassThrough()

  run(['--no-colorize'], input, output)
  input.end(logLine)

  const [chunk] = await once(output, 'data')
  t.assert.strictEqual(chunk.toString(), `${TIME} - info - hello world\n`)
})

test('cli formats piped log lines with --colorize / -c', async (t) => {
  const input = new PassThrough()
  const output = new PassThrough()

  run(['-c'], input, output)
  input.end(logLine)

  const [chunk] = await once(output, 'data')
  t.assert.strictEqual(
    chunk.toString(),
    `${TIME} - \u001B[32minfo\u001B[39m - \u001B[36mhello world\u001B[39m\n`
  )
})

test('cli supports --time-only / -t', async (t) => {
  const input = new PassThrough()
  const output = new PassThrough()

  run(['--no-colorize', '-t'], input, output)
  input.end(logLine)

  const [chunk] = await once(output, 'data')
  t.assert.strictEqual(chunk.toString(), `${TIME_ONLY} - info - hello world\n`)
})

test('cli supports --custom-time-format / -f', async (t) => {
  const input = new PassThrough()
  const output = new PassThrough()

  run(['--no-colorize', '-f', 'HH:MM:ss'], input, output)
  input.end(logLine)

  const [chunk] = await once(output, 'data')
  t.assert.match(chunk.toString(), /^\d\d:\d\d:\d\d - info - hello world\n$/)
})

test('cli prints help with --help / -h', (t) => {
  const input = new PassThrough()
  const output = new PassThrough()
  let written = ''
  output.on('data', (chunk) => {
    written += chunk.toString()
  })

  const stream = run(['--help'], input, output)
  t.assert.strictEqual(stream, null)
  t.assert.strictEqual(written, run.HELP_TEXT)
})

test('cli prints version with --version / -v', (t) => {
  const input = new PassThrough()
  const output = new PassThrough()
  let written = ''
  output.on('data', (chunk) => {
    written += chunk.toString()
  })

  const stream = run(['-v'], input, output)
  t.assert.strictEqual(stream, null)
  t.assert.strictEqual(written, `${pkg.version}\n`)
})

test('cli executes as a child process via bin.js', async (t) => {
  const child = spawn(process.execPath, [binPath, '--no-colorize', '--time-only'], {
    env: { ...process.env, TZ: 'UTC' }
  })

  const stdoutPromise = once(child.stdout, 'data')
  child.stdin.end(logLine)

  const [chunk] = await stdoutPromise
  t.assert.match(chunk.toString(), /^\d\d:\d\d:\d\d\.\d{3} - info - hello world\n$/)
})
