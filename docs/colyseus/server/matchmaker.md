# Server API &raquo; Match-maker API

!!! Warning "You may not need this!"
    This section is for advanced usage. You're usually good to go by using the [client-side methods](/client/client/#methods). If you think you can't achieve your goal with the client-side methods, you should consider using the ones described on this page.

The methods described below are provided by the `matchMaker` singleton, which can be imported from the `"colyseus"` package:

```typescript fct_label="TypeScript"
import { matchMaker } from "colyseus";
```

```javascript fct_label="JavaScript"
const matchMaker = require("colyseus").matchMaker;
```

## `.createRoom(roomName, options)`
Create a new room

**Parameters:**

- **`roomName`**: the identifier you defined on `gameServer.define()`.
- **`options`**: options for `onCreate`

```typescript
const room = await matchMaker.createRoom("battle", { mode: "duo" });
console.log(room);
/*
  { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
*/
```

## `.joinOrCreate(roomName, options)`

Join or create a room and return a client seat reservation.

**Parameters:**

- **`roomName`**: the identifier you defined on `gameServer.define()`.
- **`options`**: options for the client seat reservation (for `onJoin`/`onAuth`)

```typescript
const reservation = await matchMaker.joinOrCreate("battle", { mode: "duo" });
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

!!! Tip "Consuming the seat reservation"
    You can use [`consumeSeatReservation()` from the client-side](/client/client/#consumeseatreservation-reservation) to join the room by its reserved seat.

## `.reserveSeatFor(room, options)`
Reserve a seat for a client in a room.

!!! Tip "Consuming the seat reservation"
    You can use [`consumeSeatReservation()` from the client-side](/client/client/#consumeseatreservation-reservation) to join the room by its reserved seat.

**Parameters:**

- **`room`**: room data (result from `createRoom()`, etc)
- **`options`**: options for `onCreate`

```typescript
const reservation = await matchMaker.reserveSeatFor("battle", { mode: "duo" });
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

## `.join(roomName, options)`
Join a room and return seat reservation. An exception is thrown if there are no rooms available for `roomName`.

**Parameters:**

- **`roomName`**: the identifier you defined on `gameServer.define()`.
- **`options`**: options for the client seat reservation (for `onJoin`/`onAuth`)

```typescript
const reservation = await matchMaker.join("battle", { mode: "duo" });
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

!!! Tip "Consuming the seat reservation"
    You can use [`consumeSeatReservation()` from the client-side](/client/client/#consumeseatreservation-reservation) to join the room by its reserved seat.

## `.joinById(roomId, options)`
Join a room by id and return client seat reservation. An exception is thrown if a room is not found for `roomId`.

**Parameters:**

- **`roomId`**: the id of a specific room instance.
- **`options`**: options for the client seat reservation (for `onJoin`/`onAuth`)

```typescript
const reservation = await matchMaker.joinById("xxxxxxxxx", {});
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

!!! Tip "Consuming the seat reservation"
    You can use [`consumeSeatReservation()` from the client-side](/client/client/#consumeseatreservation-reservation) to join the room by its reserved seat.

## `.create(roomName, options)`
Create a new room and return client seat reservation.

**Parameters:**

- **`roomName`**: the identifier you defined on `gameServer.define()`.
- **`options`**: options for the client seat reservation (for `onJoin`/`onAuth`)

```typescript
const reservation = await matchMaker.create("battle", { mode: "duo" });
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

!!! Tip "Consuming the seat reservation"
    You can use [`consumeSeatReservation()` from the client-side](/client/client/#consumeseatreservation-reservation) to join the room by its reserved seat.

## `.query(conditions)`
Perform a query against cached rooms.

```typescript
const rooms = await matchMaker.query({ name: "battle", mode: "duo" });
console.log(rooms);
/*
  [
    { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false },
    { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false },
    { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  ]
*/
```

## `.findOneRoomAvailable(roomName, options)`
Find for a public and unlocked room available

**Parameters:**

- **`roomId`**: the id of a specific room instance.
- **`options`**: options for the client seat reservation (for `onJoin`/`onAuth`)

```typescript
const room = await matchMaker.findOneRoomAvailable("battle", { mode: "duo" });
console.log(room);
/*
  { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
*/
```

## `.remoteRoomCall(roomId, method, args)`
Call a method or return a property on a remote room.

**Parameters:**

- **`roomId`**: the id of a specific room instance.
- **`method`**: method or attribute to call or retrieve
- **`args`**: array of arguments

```typescript
// call lock() on a remote room by id
await matchMaker.remoteRoomCall("xxxxxxxxx", "lock");
```

