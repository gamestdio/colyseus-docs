# Built-in room &raquo; Lobby Room

!!! Warning "Client-side API for lobby room will change on Colyseus 1.0.0"
    The built-in lobby room currently relies on sending messages to notify clients about available rooms. When `@filter()` becomes stable, the LobbyRoom is going to use the state instead.

## Server-side

The built-in `LobbyRoom` will automatically notify its connected clients whenever rooms with "realtime listing" have updates.

```typescript
import { LobbyRoom } from "colyseus";

// Expose the "lobby" room.
gameServer
  .define("lobby", LobbyRoom);

// Expose your game room with realtime listing enabled.
gameServer
  .define("your_game", YourGameRoom)
  .enableRealtimeListing();
```

The `LobbyRoom` is notified automatically during `onCreate()`, `onJoin()`, `onLeave()` and `onDispose()`.

If you have [updated the `metadata` of your room](/server/room/#setmetadata-metadata), and need to trigger an update for the lobby, you can call `updateLobby()` right after the metadata has been updated:

```typescript
import { Room, updateLobby } from "colyseus";

class YourGameRoom extends Room {

  onCreate() {

    //
    // This is just a demonstration
    // on how to call `updateLobby` from your Room
    //
    this.clock.setTimeout(() => {

      this.setMetadata({
        customData: "Hello world!"
      }).then(() => updateLobby(this));

    }, 5000);

  }

}
```

## Client-side

You need to keep track of the rooms being added, removed and updated through messages sent to the client from the `LobbyRoom`.

```typescript
import { Client, RoomAvailable } from "colyseus.js";

const client = new Client("ws://localhost:2567");
const lobby = await client.joinOrCreate("lobby");

let allRooms: RoomAvailable[] = [];

lobby.onMessage("rooms", (rooms) => {
  allRooms = rooms;
});

lobby.onMessage("+", ([roomId, room]) => {
  const roomIndex = allRooms.findIndex((room) => room.roomId === roomId);
  if (roomIndex !== -1) {
    allRooms[roomIndex] = room;

  } else {
    allRooms.push(room);
  }
});

lobby.onMessage("-", (roomId) => {
  allRooms = allRooms.filter((room) => room.roomId !== roomId);
});
```