# Built-in room &raquo; Relay Room

The built-in `RelayRoom` is useful for simple use cases, where you don't need to hold any state in the server-side other than the clients connected to it.

By simply relaying messages (forwarding them from a client to everyone else) - the server-side is not able to validate any of them - the client-side is the one who should perform validations.

!!! tip
    The [source-code of the `RelayRoom`](https://github.com/colyseus/colyseus/blob/master/src/rooms/RelayRoom.ts) is very simple. The general recommentation is to implement your own version of it with server-side validations when you see fit.

## Server-side

```typescript
import { RelayRoom } from "colyseus";

// Expose your relayed room
gameServer.define("your_relayed_room", RelayRoom, {
  maxClients: 4,
  allowReconnectionTime: 120
});
```

## Client-side

See how to register callbacks for players joining, leaving, sending and receiving messages from the relayed room.

### Connecting into the room

```typescript
import { Client } from "colyseus.js";

const client = new Client("ws://localhost:2567");

//
// Join the relayed room
//
const relay = await client.joinOrCreate("your_relayed_room", {
  name: "This is my name!"
});
```

### Registering callbacks when players join and leave


```typescript
//
// Detect when a player joined the room
//
relay.state.players.onAdd = (player, sessionId) => {
  if (relay.sessionId === sessionId) {
    console.log("It's me!", player.name);

  } else {
    console.log("It's an opponent", player.name, sessionId);
  }
}

//
// Detect when a player leave the room
//
relay.state.players.onRemove = (player, sessionId) => {
  console.log("Opponent left!", player, sessionId);
}

//
// Detect when the connectivity of a player has changed
// (only available if you provided `allowReconnection: true` in the server-side)
//
relay.state.players.onChange = (player, sessionId) => {
  if (player.connected) {
    console.log("Opponent has reconnected!", player, sessionId);

  } else {
    console.log("Opponent has disconnected!", player, sessionId);
  }
}
```

### Sending an receiving messages

```typescript
//
// By sending a message, all other clients will receive it under the same name
// Messages are only sent to other connected clients, never the current one.
//
relay.send("fire", {
  x: 100,
  y: 200
});

//
// Register a callback for messages you're interested in from other clients.
//
relay.onMessage("fire", ([sessionId, message]) => {

  //
  // The `sessionId` from who sent the message
  //
  console.log(sessionId, "sent a message!");

  //
  // The actual message sent by the other client
  //
  console.log("fire at", message);
});
```
