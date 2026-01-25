<a id="@fastify/one-line-logger"></a>
# @fastify/one-line-logger


[![CI](https://github.com/fastify/one-line-logger/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/fastify/one-line-logger/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/@fastify/one-line-logger.svg?style=flat)](https://www.npmjs.com/package/@fastify/one-line-logger)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/neostandard/neostandard)

`@fastify/one-line-logger` helps you format fastify's log into a nice one-line message:

```
YYYY-MM-dd HH:mm:ss.SSSTZ - <level> - <method> <route path> - <message>
```

A standard incoming request log line like:

```
{"level": 30,"time": 1660151282194,"pid": 1557,"hostname": "foo","reqId": "req-1","req": {"method": "GET","url": "/path","hostname": "localhost:8080","remoteAddress": "127.0.0.1"},"msg": "incoming request"}
```

Will format to:

```
2022-08-11 01:08:02.194+0100 - info - GET / - incoming request
```

<a id="install"></a>
## Install

```
npm i @fastify/one-line-logger
```

<a id="getting-started"></a>
## Getting started

```js
const server = fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
    },
  },
});
```

## Colors

Colors are enabled by default when supported. To manually disable the colors you need to set the `transport.colorize` option to `false`. For more options check the `colorette` [docs](https://github.com/jorgebucaran/colorette?tab=readme-ov-file#environment).

```js
const server = fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
      colorize: false,
    },
  },
});
```


## Custom levels

Custom levels could be used by passing it into logger opts

```js
const server = fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
    },
    customLevels: {
      foo: 35,
      bar: 45,
    },
  },
});

server.get("/", (request, reply) => {
  request.log.info("time to foobar");
  request.log.foo("FOO!");
  request.log.bar("BAR!");
  reply.send({ foobar: true });
});
```

## Custom level colors

Custom level colors can be used by passing it into logger opts. They can also overwrite the default level's colors. Check all the supported colors [here](https://github.com/jorgebucaran/colorette?tab=readme-ov-file#supported-colors).

```js
const server = fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
      options: {
        colors: {
          35: "bgYellow",
          45: "magenta",
          60: "bgRedBright" // overwriting the `fatal` log color
        }
      }
    },
    customLevels: {
      foo: 35,
      bar: 45,
    },
  },
});

server.get("/", (request, reply) => {
  request.log.fatal("An error occured");
  request.log.foo("FOO!");
  request.log.bar("BAR!");
  reply.send({ foobar: true });
});
```

## Time-only format

To output only the time without the date and timezone:

```js
const server = fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
      options: { timeOnly: true }
    }
  }
});
```

Output: `01:08:02.194 - info - GET / - incoming request`

## Custom time format

Use the `customTimeFormat` option with a [dateformat](https://www.npmjs.com/package/dateformat) pattern:

```js
const server = fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
      options: { customTimeFormat: "HH:MM:ss" }
    }
  }
});
```

Common patterns:
- `"HH:MM:ss"` → `01:08:02`
- `"yyyy-mm-dd HH:MM:ss"` → `2022-08-11 01:08:02`
- `"isoDateTime"` → `2022-08-11T01:08:02+0100`

<a id="license"></a>
## License

Licensed under [MIT](./LICENSE).
