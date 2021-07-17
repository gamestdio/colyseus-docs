# Server API &raquo; Graceful Shutdown

Colyseus provides a graceful shutting down mechanism by default. These actions will be performed before the process kill itself:

- Disconnect all connected clients asynchronously (`Room#onLeave`)
- Dispose all spawned rooms asynchronously (`Room#onDispose`)
- Perform optional asynchronous callback before shutting down the process `Server#onShutdown`

If you're performing async tasks on `onLeave` / `onDispose`, you should return a `Promise`, and resolve it when the task is ready. The same applies to `onShutdown(callback)`.


## Returning a `Promise`

By returning a `Promise`, the server will wait for them to be completed before killing the worker process.

```typescript
import { Room } from "colyseus";

class MyRoom extends Room {
    onLeave (client) {
        return new Promise((resolve, reject) => {
            doDatabaseOperation((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    onDispose () {
        return new Promise((resolve, reject) => {
            doDatabaseOperation((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}
```

## Using `async`

The `async` keyword will make your function return a `Promise` under the hood. [Read more about Async / Await](https://basarat.gitbooks.io/typescript/content/docs/async-await.html).

```typescript
import { Room } from "colyseus";

class MyRoom extends Room {
    async onLeave (client) {
        await doDatabaseOperation(client);
    }

    async onDispose () {
        await removeRoomFromDatabase();
    }
}
```

## Process shutdown callback

You can also listen for process shutdown by setting a `onShutdown` callback.

```typescript fct_label="Server"
import { Server } from "colyseus";

let server = new Server();

server.onShutdown(function () {
    console.log("master process is being shut down!");
});
```
