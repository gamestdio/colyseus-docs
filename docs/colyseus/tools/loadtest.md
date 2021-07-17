# Load Testing / Stress Testing (`@colyseus/loadtest`)

The `@colyseus/loadtest` tool is useful when you'd like to battle test your server and see how it is going to perform on a live environment.

[![asciicast](https://asciinema.org/a/229378.svg)](https://asciinema.org/a/229378)

## Installation

Install the `@colyseus/loadtest` module:

```
npm install --save-dev @colyseus/loadtest
```

## Usage

The `colyseus-loadtest` command requires a few arguments to work:

- `script`: The custom script the tool is going to use
- `--endpoint`: Your server endpoint (by default uses `ws://localhost:2567`)
- `--room`: Name of the room you'd like to connect to
- `--numClients`: Number of clients you'd like to connect into the room.

### Example

This is an example scripting file. Based on the room lifecycle events for each connected client, you may implement a "bot" to interact with the room.

```typescript fct_label="TypeScript"
// script.ts
import { Room, Client } from "colyseus.js";

export function requestJoinOptions (this: Client, i: number) {
    return { requestNumber: i };
}

export function onJoin(this: Room) {
    console.log(this.sessionId, "joined.");

    this.onMessage("*", (type, message) => {
        console.log("onMessage:", type, message);
    });
}

export function onLeave(this: Room) {
    console.log(this.sessionId, "left.");
}

export function onError(this: Room, err) {
    console.error(this.sessionId, "!! ERROR !!", err.message);
}

export function onStateChange(this: Room, state) {
}
```

```typescript fct_label="JavaScript"
// script.js
exports.requestJoinOptions = function (i) {
    return { requestNumber: i };
}

exports.onJoin = function () {
    console.log(this.sessionId, "joined.");

    this.onMessage("*", (type, message) => {
        console.log("onMessage:", type, message);
    });
}

exports.onLeave = function () {
    console.log(this.sessionId, "left.");
}

exports.onError = function (err) {
    console.log(this.sessionId, "!! ERROR !!", err.message);
}

exports.onStateChange = function (state) {
}
```

### Connecting 50 clients into a `"battle"` room

```
npx colyseus-loadtest script.ts --room battle --numClients 50 --endpoint ws://localhost:2567 
```