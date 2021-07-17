> This document is a work-in-progress.

To scale Colyseus into multiple processes or servers, you'll need to have Redis, MongoDB, and a dynamic proxy.

## Redis

Download and install [Redis](https://redis.io/topics/quickstart). Use the `RedisPresence`:

```typescript fct_label="TypeScript"
import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({
  // ...
  presence: new RedisPresence(),
});
```

```typescript fct_label="JavaScript"
const colyseus = require("colyseus");

const gameServer = new colyseus.Server({
  // ...
  presence: new colyseus.RedisPresence(),
});
```

The `presence` is used to call room "seat reservation" functions from one process to another, and allows the developer to take advantage of the some data sharing functions across rooms. See [Presence API](/server/presence/#api).

Each Colyseus process also registers its own `processId` and network location to the `presence` API, which is later used by the [dynamic proxy](#dynamic-proxy) service. During graceful shutdown, the process unregisters itself.

## MongoDB

Download and install [MongoDB](https://docs.mongodb.com/manual/administration/install-community/). And install the `mongoose` package:

```
npm install --save mongoose
```

Use the `MongooseDriver`:

```typescript fct_label="TypeScript"
import { Server, RedisPresence } from "colyseus";
import { MongooseDriver } from "@colyseus/mongoose-driver"

const gameServer = new Server({
  // ...
  driver: new MongooseDriver(),
});
```

```typescript fct_label="JavaScript"
const colyseus = require("colyseus");
const MongooseDriver = require("@colyseus/mongoose-driver").MongooseDriver;

const gameServer = new colyseus.Server({
  // ...
  driver: new MongooseDriver(),
});
```


You can either pass the MongoDB connection URI to the `new MongooseDriver(uri)` constructor, or set a `MONGO_URI` environment variable.

The `driver` is used to store and query available rooms for matchmaking.

## Running multiple Colyseus processes

To run multiple Colyseus instances in the same server, you need each one of them to listen on a different port number. It's recommended to use ports `3001`, `3002`, `3003`, and so on. The Colyseus processes should **NOT** be exposed publicly. Only the [dynamic proxy](#dynamic-proxy) is.

The [PM2 process manager](http://pm2.keymetrics.io/) is highly recommended for managing multiple Node.js app instances.

PM2 provides a `NODE_APP_INSTANCE` environment variable, containing a different number for each process. Use it to define your port number.

```typescript
import { Server } from "colyseus";

// binds each instance of the server on a different port.
const PORT = Number(process.env.PORT) + Number(process.env.NODE_APP_INSTANCE);

const gameServer = new Server({ /* ... */ })

gameServer.listen(PORT);
console.log("Listening on", PORT);
```

```
npm install -g pm2
```

Use the following `ecosystem.config.js` configuration:

```javascript
// ecosystem.config.js
const os = require('os');
module.exports = {
    apps: [{
        port        : 3000,
        name        : "colyseus",
        script      : "lib/index.js", // your entrypoint file
        watch       : true,           // optional
        instances   : os.cpus().length,
        exec_mode   : 'fork',         // IMPORTANT: do not use cluster mode.
        env: {
            DEBUG: "colyseus:errors",
            NODE_ENV: "production",
        }
    }]
}
```

Now you're ready to start multiple Colyseus proceses.

```
pm2 start
```

!!! Tip "PM2 and TypeScript"
    It's recommended compile your .ts files before running `pm2 start`, via `npx tsc`. Alternatively, you can install the TypeScript interpreter for PM2 (`pm2 install typescript`) and set the `exec_interpreter: "ts-node"` ([read more](http://pm2.keymetrics.io/docs/tutorials/using-transpilers-with-pm2)).


## Dynamic proxy

The [@colyseus/proxy](https://github.com/colyseus/proxy) is a dynamic proxy that automatically listens whenever a Colyseus process goes up and down, allowing the WebSocket connections to go to the right process and server where a room has been created on.

The proxy should be bound to port `80`/`443` as it is the only public endpoint you'll have for your application. All requests must go through the proxy.

```
npm install -g @colyseus/proxy
```

### Environment variables

Configure the following environment variables to meet your needs:

- `PORT` is the port the proxy will be running on.
- `REDIS_URL` is the path to the same Redis instance you're using on Colyseus' processes.

### Running the proxy

```
colyseus-proxy

> {"name":"redbird","hostname":"Endels-MacBook-Air.local","pid":33390,"level":30,"msg":"Started a Redbird reverse proxy server on port 80","time":"2019-08-20T15:26:19.605Z","v":0}
```
