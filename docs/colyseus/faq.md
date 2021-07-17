# Frequently Asked Questions

### How many CCU a Colyseus server can handle?!

The maximum number of concurrent users (CCU) a Colyseus server can handle will vary accourding to how CPU-intensive your game loop is, and how much traffic your server is sending back to the clients.

The default "file descriptor limit" (amount of open connections you can have) of Linux servers is around 1024 - this value can be increased at your own risk. So, you can safely assume the cheapest cloud server is capable of holding 1024 concurrent connections. There are reports of people managing to have up to [600k open WebSocket connections](https://blog.jayway.com/2015/04/13/600k-concurrent-websocket-connections-on-aws-using-node-js/), even though they're idle connections, without transferring data - it proves you can potentially handle more than 1024 concurrent connections by fine tuning the server specs and configuration.

### What does the `"Error: seat reservation expired"` mean??

This error means that the client was not able to establish connection with the room in a timely fashion. Usually in production environment you may see this error happening from time to time. [You may increase limit](/server/room/#setseatreservationtime-seconds).

### How can I sync data of the `state` only to a specific client?

You can either use [schema filters](/state/schema/#filtering-data-per-client), and/or send data manually to each client through [room's send method](/server/client/#sendtype-message).

### Does Colyseus help me with client-prediction?

Colyseus does not provide any client-prediction solution out of the box. Games such as [wilds.io](http://wilds.io/) and [mazmorra.io](https://mazmorra.io/) do not use any form of client-prediction. [`lerp`](http://gamestd.io/mathf/globals.html#lerp)ing user coordinates usually gives reasonable results.

### I'm getting this error: `Class constructor Room cannot be invoked without 'new'"`, what should I do?

Make sure you have `es2015` or higher in your `tsconfig.json`:

```javascript
{
    "compilerOptions": {
        // ...
        "target": "es2015",
        // ...
    },
    // ...
}
```
