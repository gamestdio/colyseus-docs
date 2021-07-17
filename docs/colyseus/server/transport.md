# Server API &raquo; Transport

Colyseus currently provides two WebSocket implementations as its Transport layer.

Each Transport has its own set of options for customization.

- [Default WebSocket Transport (`ws`)](#default-websocket-transport-via-ws)
- [Native C++ WebSocket Transport (`uWebSockets.js`)](#native-c-websocket-transport-via-uwebsocketsjs)

---

##  Default WebSocket Transport (via `ws`)

The default WebSocket transport uses the [`websockets/ws`](https://github.com/websockets/ws) implementation.

A `WebSocketTransport` with its default options is going to be used automatically if no `transport` is provided for [`Server`](/server/api/#new-server-options)'s constructor.

<!--

**Installation**

```
npm install --save @colyseus/ws-transport
```

-->

**Usage**

```typescript fct_label="Example"
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport"

const gameServer = new Server({
    transport: new WebSocketTransport({ /* transport options */ })
})
```

```typescript fct_label="@colyseus/arena"
import Arena from "@colyseus/arena";
import { WebSocketTransport } from "@colyseus/ws-transport"

export default Arena({
  // ...

  initializeTransport: function() {
    return new WebSocketTransport({
      /* ...options */
    });
  },

  // ...
});
```

### Available options:

#### `options.server`

A Node.js http server instance to re-use for the WebSocket server. Useful when you'd like to use Express along with Colyseus.

```typescript fct_label="Example"
import { createServer } from "http";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport"

const server = createServer(app); // create the http server manually

const gameServer = new Server({
  transport: new WebSocketTransport({
      server // provide the custom server for `WebSocketTransport`
  })
});
```

```typescript fct_label="Example + express"
import express from "express";
import { createServer } from "http";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport"

const app = express();
const server = createServer(app); // create the http server manually

const gameServer = new Server({
  transport: new WebSocketTransport({
      server // provide the custom server for `WebSocketTransport`
  })
});
```

By not providing this option, an http server is going to be created automatically for you.

---

#### `options.pingInterval`

Number of milliseconds for the server to "ping" the clients.

The clients are going to be forcibly disconnected if they can't respond after [pingMaxRetries](#optionspingmaxretries) retries.

Default: `3000`

---

#### `options.pingMaxRetries`

Maximum allowed number of pings without a response.

Default: `2`

---

#### `options.verifyClient`

This method happens before WebSocket handshake. If `verifyClient` is not set
then the handshake is automatically accepted.

- `info` (Object)
    - `origin` (String) The value in the Origin header indicated by the client.
    - `req` (http.IncomingMessage) The client HTTP GET request.
    - `secure` (Boolean) `true` if `req.connection.authorized` or `req.connection.encrypted` is set.

- `next` (Function) A callback that must be called by the user upon inspection of the `info` fields. Arguments in this callback are:
    - `result` (Boolean) Whether or not to accept the handshake.
    - `code` (Number) When `result` is `false` this field determines the HTTP error status code to be sent to the client.
    - `name` (String) When `result` is `false` this field determines the HTTP reason phrase.

---

## Native C++ WebSocket Transport (via `uWebSockets.js`)

The [`uWebSockets.js`](https://github.com/uNetworking/uWebSockets.js) implementation generally performs better than the default, in terms of number of CCU it can hold, and memory consumption.

!!! Warning "HTTP Routing works differently with `uWebSockets.js`"
    The major disadvantage of using `uWebSockets.js` is that their HTTP/routing system works completely different than regular Node.js/express routes. See more about this on [Custom HTTP routes with `uWebSockets.js`](#custom-http-routes-with-uwebsocketsjs)

**Installation**

```
npm install --save @colyseus/uwebsockets-transport
```

**Usage**

```typescript
import { Server } from "@colyseus/core";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const gameServer = new Server({
    transport: new uWebSocketsTransport({
        /* options */
    })
})
```

### Available options:

#### `options.maxPayloadLength`

Maximum length of received message. If a client tries to send you a message larger than this, the connection is immediately closed.

Defaults to `1024 * 1024`.

---

#### `options.idleTimeout`

Maximum amount of seconds that may pass without sending or getting a message. Connection is closed if this timeout passes. Resolution (granularity) for timeouts are typically 4 seconds, rounded to closest.

Disable by using `0`.

Defaults to `120`.

---

#### `options.compression`

What permessage-deflate compression to use. `uWS.DISABLED`, `uWS.SHARED_COMPRESSOR` or any of the `uWS.DEDICATED_COMPRESSOR_xxxKB`.

Defaults to `uWS.DISABLED`

---

#### `options.maxBackpressure`

Maximum length of allowed backpressure per socket when publishing or sending messages. Slow receivers with too high backpressure will be skipped until they catch up or timeout.

Defaults to `1024 * 1024`.

---

#### `options.key_file_name`

Path to the SSL key file. (for SSL termination through the Node.js application.)

---

#### `options.cert_file_name`

Path to the SSL certificate file. (for SSL termination through the Node.js application.)

---

#### `options.passphrase`

Password for the SSL file. (for SSL termination through the Node.js application.)

---

### Custom HTTP routes with `uWebSockets.js`

#### Native `uWebSockets.js` routing:

The `uWebSocketsTransport` exposes the variable `app` as a reference to the raw `uws.App` or `uws.SSLApp` from `uWebSockets.js` library.

You can use `transport.app` directly to bind http routes using the `uWebSockets.js` API, see below:

```typescript
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const transport = new uWebSocketsTransport({
    /* ...options */
});

transport.app.get("/*", (res, req) => {
    res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end('Hello there!');
});
```

See [`uWebSockets.js` examples](https://github.com/uNetworking/uWebSockets.js/tree/master/examples) for more information.

#### Alternative: express compatibility layer

Alternatively, we've built a thin express compatibility layer that aims to provide the same functionality from Express, but using `uWebSockets.js` under the hood.

!!! tip "This feature is experimental"
    The Express compatibility layer is experimental and may not work with complex code

**Installation**

```
npm install --save uwebsockets-express
```

**Usage**

```typescript fct_label="Example"
import express from "express";
import expressify from "uwebsockets-express"
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const transport = new uWebSocketsTransport({
    /* ...options */
});
const app = expressify(transport.app);

// use existing middleware implementations!
app.use(express.json());
app.use('/', serveIndex(path.join(__dirname, ".."), { icons: true, hidden: true }))
app.use('/', express.static(path.join(__dirname, "..")));

// register routes
app.get("/hello", (req, res) => {
  res.json({ hello: "world!" });
});
```

```typescript fct_label="@colyseus/arena"
import express from "express";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"
import Arena from "@colyseus/arena";

export default Arena({
  // ...
  initializeTransport: function() {
    return new uWebSocketsTransport({
      /* ...options */
    });
  },

  //
  // when using `@colyseus/arena`, the `uwebsockets-express` is loaded automatically.
  // you get the expressify(transport.app) as argument here.
  //
  initializeExpress: (app) => {
    // use existing middleware implementations!
    app.use('/', serveIndex(path.join(__dirname, ".."), { icons: true, hidden: true }))
    app.use('/', express.static(path.join(__dirname, "..")));

    // register routes
    app.get("/hello", (req, res) => {
      res.json({ hello: "world!" });
    });

  },
  // ...
})

```