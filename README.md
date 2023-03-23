<a id="@fastify/one-line-logger"></a>
# @fastify/one-line-logger

`@fastify/one-line-logger` helps you format fastify's log into a nice one line message:

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

<a id="license"></a>
## License

MIT License
