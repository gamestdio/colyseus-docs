# Server API &raquo; Room

A Room class is meant to implement a game session, and/or serve as the communication channel between a group of clients.

- Rooms are created **on demand** during matchmaking by default
- Room classes must be exposed using [`.define()`](/server/api/#define-roomname-string-room-room-options-any)

```typescript fct_label="TypeScript"
import http from "http";
import { Room, Client } from "colyseus";

export class MyRoom extends Room {
    // When room is initialized
    onCreate (options: any) { }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth (client: Client, options: any, request: http.IncomingMessage) { }

    // When client successfully join the room
    onJoin (client: Client, options: any, auth: any) { }

    // When a client leaves the room
    onLeave (client: Client, consented: boolean) { }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}
```

```typescript fct_label="JavaScript"
const colyseus = require('colyseus');

export class MyRoom extends colyseus.Room {
    // When room is initialized
    onCreate (options) { }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth (client, options, request) { }

    // When client successfully join the room
    onJoin (client, options, auth) { }

    // When a client leaves the room
    onLeave (client, consented) { }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}
```

## Room lifecycle events

- The room lifecycle events are called automatically. 
- Optional [`async`/`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) is supported on every lifecycle event.

### `onCreate (options)`

Called once, when the room is created by the matchmaker. 

**The `options` argument is provided by the client upon room creation:**

```typescript
// Client-side - JavaScript SDK
client.joinOrCreate("my_room", {
  name: "Jake",
  map: "de_dust2"
})

// onCreate() - options are:
// {
//   name: "Jake",
//   map: "de_dust2"
// }
```

**The server may overwrite options during [`.define()`](/server/api/#define-roomname-string-room-room-options-any) for authortity:**

```typescript fct_label="Definition"
// Server-side
gameServer.define("my_room", MyRoom, {
  map: "cs_assault" 
})

// onCreate() - options are:
// {
//   name: "Jake",
//   map: "cs_assault"
// }
```

On this example, the `map` option is `"cs_assault"` during `onCreate()`, and `"de_dust2"` during `onJoin()`.

---

### `onAuth (client, options, request)`

The `onAuth()` method will be executed before `onJoin()`. It can be used to verify authenticity of a client joining the room.

- If `onAuth()` returns a [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) value, `onJoin()` is going to be called with the returned value as the third argument.
- If `onAuth()` returns a [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value, the client is immediatelly rejected, causing the matchmaking function call from the client-side to fail.
- You may also throw a `ServerError` to expose a custom error to be handled in the client-side.

If left non-implemented, it always returns `true` - allowing any client to connect.

!!! Tip "Getting player's IP address"
    You can use the `request` variable to retrieve the user's IP address, http headers, and more. E.g.: `request.headers['x-forwarded-for'] || request.connection.remoteAddress`

**Implementations examples**

```typescript fct_label="async / await"
import { Room, ServerError } from "colyseus";

class MyRoom extends Room {
  async onAuth (client, options, request) {
    /**
     * Alternatively, you can use `async` / `await`,
     * which will return a `Promise` under the hood.
     */
    const userData = await validateToken(options.accessToken);
    if (userData) {
        return userData;

    } else {
        throw new ServerError(400, "bad access token");
    }
  }
}
```

```typescript fct_label="Synchronous"
import { Room } from "colyseus";

class MyRoom extends Room {
  onAuth (client, options, request): boolean {
    /**
     * You can immediatelly return a `boolean` value.
     */
     if (options.password === "secret") {
       return true;

     } else {
       throw new ServerError(400, "bad access token");
     }
  }
}
```

```typescript fct_label="Promises"
import { Room } from "colyseus";

class MyRoom extends Room {
  onAuth (client, options, request): Promise<any> {
    /**
     * You can return a `Promise`, and perform some asynchronous task to validate the client.
     */
    return new Promise((resolve, reject) => {
      validateToken(options.accessToken, (err, userData) => {
        if (!err) {
          resolve(userData);
        } else {
          reject(new ServerError(400, "bad access token"));
        }
      });
    });
  }
}
```

**Client-side examples**

From the client-side, you may call the matchmaking method (`join`, `joinOrCreate`, etc) with a token from some authentication service of your choice (i. e. Facebook):

```javascript fct_label="JavaScript"
client.joinOrCreate("world", {
  accessToken: yourFacebookAccessToken

}).then((room) => {
  // success

}).catch((err) => {
  // handle error...
  err.code // 400
  err.message // "bad access token"
});
```

```csharp fct_label="C#"
try {
  var room = await client.JoinOrCreate<YourStateClass>("world", new {
    accessToken = yourFacebookAccessToken
  });
  // success

} catch (err) {
  // handle error...
  err.code // 400
  err.message // "bad access token"
}
```

```lua fct_label="Lua"
client:join_or_create("world", {
  accessToken = yourFacebookAccessToken

}, function(err, room)
  if err then
    -- handle error...
    err.code -- 400
    err.message -- "bad access token"
    return
  end

  -- success
end)
```

```haxe fct_label="Haxe"
client.joinOrCreate("world", {
  accessToken: yourFacebookAccessToken

}, YourStateClass, function (err, room) {
  if (err != null) {
    // handle error...
    err.code // 400
    err.message // "bad access token"
    return;
  }

  // success
})
```

```cpp fct_label="C++"
client.joinOrCreate("world", {
  { "accessToken", yourFacebookAccessToken }

}, [=](MatchMakeError *err, Room<YourStateClass>* room) {
  if (err != "") {
    // handle error...
    err.code // 400
    err.message // "bad access token"
    return;
  }

  // success
});
```

---

### `onJoin (client, options, auth?)`

**Parameters:**

- `client`: The [`client`](/server/client) instance.
- `options`: merged values specified on [Server#define()](/server/api/#define-roomname-string-room-room-options-any) with the options provided the client on [`client.join()`](/client/client/#join-roomname-string-options-any)
- `auth`: (optional) auth data returned by [`onAuth`](#onauth-client-options-request) method.

Is called when the client successfully joins the room, after `requestJoin` and `onAuth` has succeeded.

---

### `onLeave (client, consented)`

Is called when a client leaves the room. If the disconnection was [initiated by the client](/client/room/#leave), the `consented` parameter will be `true`, otherwise, it will be `false`.

You can define this function as `async`. See [graceful shutdown](/server/graceful-shutdown)

```typescript fct_label="Synchronous"
onLeave(client, consented) {
    if (this.state.players.has(client.sessionId)) {
        this.state.players.delete(client.sessionId);
    }
}
```

```typescript fct_label="Asynchronous"
async onLeave(client, consented) {
    const player = this.state.players.get(client.sessionId);
    await persistUserOnDatabase(player);
}
```

---

### `onDispose ()`

The `onDispose()` method is called before the room is destroyed, which happens when:

- there are no more clients left in the room, and `autoDispose` is set to `true` (default)
- you manually call [`.disconnect()`](#disconnect).

You may define `async onDispose()` an asynchronous method in order to persist some data in the database. In fact, this is a great place to persist player's data in the database after a game match ends.

See [graceful shutdown](/server/graceful-shutdown).

---

### Example room
This example demonstrates an entire room implementing the `onCreate`, `onJoin` and `onMessage` methods.

```typescript fct_label="TypeScript"
import { Room, Client } from "colyseus";
import { Schema, MapSchema, type } from "@colyseus/schema";

// An abstract player object, demonstrating a potential 2D world position
export class Player extends Schema {
  @type("number")
  x: number = 0.11;

  @type("number")
  y: number = 2.22;
}

// Our custom game state, an ArraySchema of type Player only at the moment
export class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();
}

export class GameRoom extends Room<State> {
  // Colyseus will invoke when creating the room instance
  onCreate(options: any) {
    // initialize empty room state
    this.setState(new State());

    // Called every time this room receives a "move" message
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.x += data.x;
      player.y += data.y;
      console.log(client.sessionId + " at, x: " + player.x, "y: " + player.y);
    });
  }

  // Called every time a client joins
  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player());
  }
}
```

```typescript fct_label="JavaScript"
const colyseus = require('colyseus');
const schema = require('@colyseus/schema');

// An abstract player object, demonstrating a potential 2D world position
exports.Player = class Player extends schema.Schema {
    constructor() {
        super();
        this.x = 0.11;
        this.y = 2.22;
    }
}
schema.defineTypes(Player, {
    x: "number",
    y: "number",
});

// Our custom game state, an ArraySchema of type Player only at the moment
exports.State = class State extends schema.Schema {
    constructor() {
        super();
        this.players = new schema.MapSchema();
    }
}
defineTypes(State, {
    players: { map: Player }
});

exports.GameRoom = class GameRoom extends colyseus.Room {
  // Colyseus will invoke when creating the room instance
  onCreate(options) {
    // initialize empty room state
    this.setState(new State());

    // Called every time this room receives a "move" message
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.x += data.x;
      player.y += data.y;
      console.log(client.sessionId + " at, x: " + player.x, "y: " + player.y);
    });
  }

  // Called every time a client joins
  onJoin(client, options) {
    this.state.players.set(client.sessionId, new Player());
  }
}
```

---

## Public methods

Room handlers have these methods available.

### `onMessage (type, callback)`

Register a callback to process a type of message sent by the client-side.

The `type` argument can be either `string` or `number`.

**Callback for specific type of message**

```typescript
onCreate () {
    this.onMessage("action", (client, message) => {
        console.log(client.sessionId, "sent 'action' message: ", message);
    });
}
```

**Callback for ALL messages**

You can register a single callback to handle all other types of messages.

```typescript
onCreate () {
    this.onMessage("action", (client, message) => {
        //
        // Triggers when 'action' message is sent.
        //
    });

    this.onMessage("*", (client, type, message) => {
        //
        // Triggers when any other type of message is sent,
        // excluding "action", which has its own specific handler defined above.
        //
        console.log(client.sessionId, "sent", type, message);
    });
}
```

!!! tip "Use `room.send()` from the client-side SDK to send messages"
    Check out [`room.send()`](/client/client/#send-type-message) section.

---

### `setState (object)`

Set the synchronizable room state. See [State Synchronization](/state/overview/) and [Schema](/state/schema/) for more details.

!!! Tip
    You usually call this method only once during [`onCreate()`](#onCreate-options)

!!! Warning
    Do not call `.setState()` for every update in the room state. The binary patch algorithm is reset at every call.

---

### `setSimulationInterval (callback[, milliseconds=16.6])`

(Optional) Set a simulation interval that can change the state of the game. The simulation interval is your game loop. Default simulation interval: 16.6ms (60fps)

```typescript
onCreate () {
    this.setSimulationInterval((deltaTime) => this.update(deltaTime));
}

update (deltaTime) {
    // implement your physics or world updates here!
    // this is a good place to update the room state
}
```

---

### `setPatchRate (milliseconds)`

Set frequency the patched state should be sent to all clients. Default is `50ms` (20fps)

---


### `setPrivate (bool)`

Set the room listing as private (or revert to public, if `false` is provided).

Private rooms are not listed in the [`getAvailableRooms()`](/client/client/#getavailablerooms-roomname-string) method.

---

### `setMetadata (metadata)`

Set metadata to this room. Each room instance may have metadata attached to it - the only purpose for attaching metadata is to differentiate one room from another when getting the list of available rooms from the client-side, to connect to it by its `roomId`, using [`client.getAvailableRooms()`](/client/client/#getavailablerooms-roomname).

```typescript
// server-side
this.setMetadata({ friendlyFire: true });
```

Now that a room has metadata attached to it, the client-side can check which room has `friendlyFire`, for example, and connect directly to it via its `roomId`:

```javascript
// client-side
client.getAvailableRooms("battle").then(rooms => {
  for (var i=0; i<rooms.length; i++) {
    if (room.metadata && room.metadata.friendlyFire) {
      //
      // join the room with `friendlyFire` by id:
      //
      var room = client.join(room.roomId);
      return;
    }
  }
});
```

!!! Tip
    [See how to call `getAvailableRooms()` in other languages.](/client/client/#getavailablerooms-roomname)

---

### `setSeatReservationTime (seconds)`

Set the number of seconds a room can wait for a client to effectively join the room. You should consider how long your [`onAuth()`](#onauth-client-options-request) will have to wait for setting a different seat reservation time. The default value is 15 seconds.

You may set the `COLYSEUS_SEAT_RESERVATION_TIME` environment variable if you'd like to change the seat reservation time globally.

---


### `send (client, message)`

!!! Warning "Deprecated"
    `this.send()` has been deprecated. Please use [`client.send()` instead](/server/client/#sendtype-message).

---


### `broadcast (type, message, options?)`

Send a message to all connected clients.

Available options are:

- **`except`**: a [`Client`](/server/client/) instance not to send the message to
- **`afterNextPatch`**: waits until next patch to broadcast the message

#### Broadcast examples

Broadcasting a message to all clients:

```typescript
onCreate() {
    this.onMessage("action", (client, message) => {
        // broadcast a message to all clients
        this.broadcast("action-taken", "an action has been taken!");
    });
}
```

Broadcasting a message to all clients, except the sender.

```typescript
onCreate() {
    this.onMessage("fire", (client, message) => {
        // sends "fire" event to every client, except the one who triggered it.
        this.broadcast("fire", message, { except: client });
    });
}
```

Broadcasting a message to all clients, only after a change in the state has been applied:

```typescript
onCreate() {
    this.onMessage("destroy", (client, message) => {
        // perform changes in your state!
        this.state.destroySomething();

        // this message will arrive only after new state has been applied
        this.broadcast("destroy", "something has been destroyed", { afterNextPatch: true });
    });
}
```

Broadcasting a schema-encoded message:

```typescript
class MyMessage extends Schema {
  @type("string") message: string;
}

// ...
onCreate() {
    this.onMessage("action", (client, message) => {
        const data = new MyMessage();
        data.message = "an action has been taken!";
        this.broadcast(data);
    });
}
```

!!! Tip
    [See how to handle these onMessage() in the client-side.](/client/room/#onmessage)

---

### `lock ()`

Locking the room will remove it from the pool of available rooms for new clients to connect to.

---

### `unlock ()`

Unlocking the room returns it to the pool of available rooms for new clients to connect to.

---

### `allowReconnection (client, seconds?)`

Allow the specified client to [`reconnect`](/client/client/#reconnect-roomid-string-sessionid-string) into the room. Must be used inside [`onLeave()`](#onleave-client) method.

If **`seconds`** is provided, the reconnection is going to be cancelled after the provided amout of seconds.

**Return type:**

- `allowReconnection()` returns a `Deferred<Client>` instance.
- The `Deferred` is a promise-like type 
- `Deferred` type can forcibly reject the promise by calling `.reject()` (see second example)

**Example:** Rejecting the reconnection after a 20 second timeout.

```typescript
async onLeave (client: Client, consented: boolean) {
  // flag client as inactive for other users
  this.state.players[client.sessionId].connected = false;

  try {
    if (consented) {
        throw new Error("consented leave");
    }

    // allow disconnected client to reconnect into this room until 20 seconds
    await this.allowReconnection(client, 20);

    // client returned! let's re-activate it.
    this.state.players[client.sessionId].connected = true;

  } catch (e) {

    // 20 seconds expired. let's remove the client.
    delete this.state.players[client.sessionId];
  }
}
```


**Example:**  Manually rejecting the reconnection using custom logic.

```typescript
async onLeave (client: Client, consented: boolean) {
  // flag client as inactive for other users
  this.state.players[client.sessionId].connected = false;

  try {
    if (consented) {
        throw new Error("consented leave");
    }

    // get reconnection token
    const reconnection = this.allowReconnection(client);

    //
    // here is the custom logic for rejecting the reconnection.
    // for demonstration purposes of the API, an interval is created
    // rejecting the reconnection if the player has missed 2 rounds,
    // (assuming he's playing a turn-based game)
    //
    // in a real scenario, you would store the `reconnection` in
    // your Player instance, for example, and perform this check during your
    // game loop logic
    //
    const currentRound = this.state.currentRound;
    const interval = setInterval(() => {
      if ((this.state.currentRound - currentRound) > 2) {
        // manually reject the client reconnection
        reconnection.reject();
        clearInterval(interval);
      }
    }, 1000);

    // allow disconnected client to reconnect
    await reconnection;

    // client returned! let's re-activate it.
    this.state.players[client.sessionId].connected = true;

  } catch (e) {

    // 20 seconds expired. let's remove the client.
    delete this.state.players[client.sessionId];
  }
}
```

---

### `disconnect ()`

Disconnect all clients, then dispose.

---

### `broadcastPatch ()`

!!! Warning "You may not need this!"
    This method is called automatically by the framework.

This method will check whether mutations have occurred in the `state`, and broadcast them to all connected clients.

If you'd like to have control over when to broadcast patches, you can do this by disabling the default patch interval:

```typescript
onCreate() {
    // disable automatic patches
    this.setPatchRate(null);

    // ensure clock timers are enabled
    this.setSimulationInterval(() => {/* */});

    this.clock.setInterval(() => {
        // only broadcast patches if your custom conditions are met.
        if (yourCondition) {
            this.broadcastPatch();
        }
    }, 2000);
}
```

---

## Public properties

### `roomId: string`

A unique, auto-generated, 9-character-long id of the room.

You may replace `this.roomId` during `onCreate()`. 

!!! Tip "Using a custom `roomId`"
    Check out the guide [How-to &raquo; Customize room id](/how-to/custom-room-id/)

---

### `roomName: string`

The name of the room you provided as first argument for [`gameServer.define()`](/server/api/#define-roomname-string-room-room-options-any).

---

### `state: T`

The state instance you provided to [`setState()`](#setstate-object).

---

### `clients: Client[]`

The array of connected clients. See [Web-Socket Client](/server/client).

---

### `maxClients: number`

Maximum number of clients allowed to connect into the room. When room reaches
this limit, it is locked automatically. Unless the room was explicitly locked by
you via [lock()](#lock) method, the room will be unlocked as soon as a client
disconnects from it.

---

### `patchRate: number`

Frequency to send the room state to connected clients, in milliseconds. Default is `50`ms (20fps)

---

### `autoDispose: boolean`

Automatically dispose the room when last client disconnects. Default is `true`

---

### `locked: boolean` (read-only)

This property will change on these situations:

- The maximum number of allowed clients has been reached (`maxClients`)
- You manually locked, or unlocked the room using [`lock()`](#lock) or [`unlock()`](#unlock).

---

### `clock: ClockTimer`

A [`ClockTimer`](https://github.com/gamestdio/timer#api) instance, used for
[timing events](/server/timing-events).

---

### `presence: Presence`

The `presence` instance. Check [Presence API](/server/presence) for more details.

---

## Client 

The `client` instance from the server-side is responsible for the **transport** layer between the server and the client. It should not be confused with the [`Client` from the client-side SDK](/client/client/), as they have completely different purposes!

You operate on `client` instances from [`this.clients`](#clients-client), [`Room#onJoin()`](#onjoin-client-options-auth), [`Room#onLeave()`](#onleave-client-consented) and [`Room#onMessage()`](#onmessage-type-callback).

!!! Note
    This is the raw WebSocket connection coming from the [`ws`](https://www.npmjs.com/package/ws) package. There are more methods available which aren't encouraged to use along with Colyseus.

### Properties

#### `sessionId: string`

Unique id per session.

!!! Note
    In the client-side, you can find the [`sessionId` in the `room` instance](/client/room/#sessionid-string).

---

#### `userData: any`

Can be used to store custom data about the client's connection. `userData` is **not** synchronized with the client, and should be used only to keep player-specific with its connection.

```typescript
onJoin(client, options) {
  client.userData = { playerNumber: this.clients.length };
}

onLeave(client)  {
  console.log(client.userData.playerNumber);
}
```

---

#### `auth: any`

Custom data you return during [`onAuth()`](/server/room/#onauth-client-options-request).

---

### Methods

#### `send(type, message)`

Send a type of message to the client. Messages are encoded with MsgPack and can hold any JSON-seriazeable data structure.

The `type` can be either a `string` or a `number`.

**Sending a message:**

```typescript
//
// sending message with a string type ("powerup")
//
client.send("powerup", { kind: "ammo" });

//
// sending message with a number type (1)
//
client.send(1, { kind: "ammo"});
```

<!-- 
**Sending a schema-encoded message:**

Sending schema-encoded messages is particularly useful for statically-typed languages such as C#.

```typescript
class MyMessage extends Schema {
  @type("string") message: string;
}

const data = new MyMessage();
data.message = "Hello world!";

client.send(data);
```
 -->

!!! Tip
    [See how to handle these messages on client-side.](/client/room/#onmessage)

---

#### `leave(code?: number)`

Force disconnection of the `client` with the room. You may send a custom `code` when closing the connection, with values betweeen `4000` and `4999` (see [table of WebSocket close codes](#websocket-close-codes-table))

!!! Tip
    This will trigger [`room.onLeave`](/client/room/#onleave) event on the client-side.

##### Table of WebSocket close codes 

| Close code (uint16) | Codename               | Internal | Customizable | Description |
|---------------------|------------------------|----------|--------------|-------------|
| `0` - `999`             |                        | Yes      | No           | Unused |
| `1000`                | `CLOSE_NORMAL`         | No       | No           | Successful operation / regular socket shutdown |
| `1001`                | `CLOSE_GOING_AWAY`     | No       | No           | Client is leaving (browser tab closing) |
| `1002`                | `CLOSE_PROTOCOL_ERROR` | Yes      | No           | Endpoint received a malformed frame |
| `1003`                | `CLOSE_UNSUPPORTED`    | Yes      | No           | Endpoint received an unsupported frame (e.g. binary-only endpoint received text frame) |
| `1004`                |                        | Yes      | No           | Reserved |
| `1005`                | `CLOSED_NO_STATUS`     | Yes      | No           | Expected close status, received none |
| `1006`                | `CLOSE_ABNORMAL`       | Yes      | No           | No close code frame has been receieved |
| `1007`                | *Unsupported payload*  | Yes      | No           | Endpoint received inconsistent message (e.g. malformed UTF-8) |
| `1008`                | *Policy violation*     | No       | No           | Generic code used for situations other than 1003 and 1009 |
| `1009`                | `CLOSE_TOO_LARGE`      | No       | No           | Endpoint won't process large frame |
| `1010`                | *Mandatory extension*  | No       | No           | Client wanted an extension which server did not negotiate |
| `1011`                | *Server error*         | No       | No           | Internal server error while operating |
| `1012`                | *Service restart*      | No       | No           | Server/service is restarting |
| `1013`                | *Try again later*      | No       | No           | Temporary server condition forced blocking client's request |
| `1014`                | *Bad gateway*          | No       | No           | Server acting as gateway received an invalid response |
| `1015`                | *TLS handshake fail*   | Yes      | No           | Transport Layer Security handshake failure |
| `1016` - `1999`         |                        | Yes      | No           | Reserved for future use by the WebSocket standard. |
| `2000` - `2999`         |                        | Yes      | Yes          | Reserved for use by WebSocket extensions |
| `3000` - `3999`         |                        | No       | Yes          | 	Available for use by libraries and frameworks. May not be used by applications. Available for registration at the IANA via first-come, first-serve. |
| `4000` - `4999`         |                        | No       | Yes          | **Available for applications** |

---

#### `error(code, message)`

Send an error with code and message to the client. The client can handle it on [`onError`](/client/room/#onerror)