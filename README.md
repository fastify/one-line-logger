# @fastify/one-line-logger

`@fastify/one-line-logger` helps you format fastify's log into a nice one line message:

```
HH:mm:ss.SSS - <level> - <method> <route path> - <message>
```

A standard incoming request log line like:

```
{"level": 30,"time": 1660151282194,"pid": 1557,"hostname": "foo","reqId": "req-1","req": {"method": "GET","url": "/path","hostname": "localhost:8080","remoteAddress": "127.0.0.1"},"msg": "incoming request"}
```

Will format to:

```
01:10:25.194 - info - GET / - incoming request
```

# Getting started

```js
const server = fastify({
  logger: {
    transport: "one-line-logger",
  },
});
```
