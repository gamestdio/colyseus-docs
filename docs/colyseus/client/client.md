# Colyseus SDK &raquo; Usage

Colyseus currently has client-side SDK's available for the following platforms:

- [Unity](/getting-started/unity3d-client) ([view source-code](https://github.com/colyseus/colyseus-unity3d))
- [JavaScript/TypeScript](/getting-started/javascript-client) ([view source-code](https://github.com/colyseus/colyseus.js))
- [Defold Engine](/getting-started/defold-client) ([view source-code](https://github.com/colyseus/colyseus-defold))
- [Haxe](/getting-started/haxe-client) ([view source-code](https://github.com/colyseus/colyseus-hx))
- [Construct3](/getting-started/construct3-client) ([view source-code](https://github.com/colyseus/colyseus-construct3))

## The Client Instance:

The `Client` instance is used to perform matchmaking calls, and later connect to one or many rooms. 

```typescript fct_label="JavaScript"
import Colyseus from "colyseus.js";
// ...

let client = new Colyseus.Client("ws://localhost:2567");
```

```csharp fct_label="C#"
using Colyseus;
// ...

ColyseusClient client = new ColyseusClient("ws://localhost:2567");
```

```lua fct_label="lua"
local ColyseusClient = require("colyseus.client")
// ...

local client = ColyseusClient.new("ws://localhost:2567");
```

```haxe fct_label="Haxe"
import io.colyseus.Client;
// ...

var client = new Client("ws://localhost:2567");
```

No connection with the server is established yet by creating a `Client` instance.

### Methods

#### `joinOrCreate (roomName: string, options: any)`

Join an existing room or create a new one, by provided `roomName` and `options`.

Locked or private rooms are ignored by this method.

```typescript fct_label="TypeScript"
try {
  const room = await client.joinOrCreate("battle", {/* options */});
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.joinOrCreate("battle", {/* options */}).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.JoinOrCreate<YourStateClass>("battle"/* , Dictionary of options */);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:join_or_create("battle", {--[[options]]}, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.joinOrCreate("battle", [/* options */], YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```cpp fct_label="C++"
client->joinOrCreate<YourStateClass>("battle", {/* options */}, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

---

#### `create (roomName: string, options: any)`

Creates a new room by provided `roomName` and `options`.

```typescript fct_label="TypeScript"
try {
  const room = await client.create("battle", {/* options */});
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.create("battle", {/* options */}).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.Create<YourStateClass>("battle", /* Dictionary of options */);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:create("battle", {--[[options]]}, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.create("battle", [/* options */], YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```cpp fct_label="C++"
client->create<YourStateClass>("battle", {/* options */}, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

---

#### `join (roomName: string, options: any)`

Joins an existing room by provided `roomName` and `options`.

Locked or private rooms are ignored by this method.

```typescript fct_label="TypeScript"
try {
  const room = await client.join("battle", {/* options */});
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.join("battle", {/* options */}).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.Join<YourStateClass>("battle", /* Dictionary of options */);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:join("battle", {--[[options]]}, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.join("battle", [/* options */], YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```cpp fct_label="C++"
client->join<YourStateClass>("battle", {/* options */}, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

---

#### `joinById (roomId: string, options: any)`

Joins an existing room by its `roomId`. Private rooms can be joined by id.

```typescript fct_label="TypeScript"
try {
  const room = await client.joinById("KRYAKzRo2", {/* options */});
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.joinById("KRYAKzRo2", {/* options */}).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.JoinById<YourStateClass>("battle", /* Dictionary of options */);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:join_by_id("battle", {--[[options]]}, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.joinById("battle", [/* options */], YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```cpp fct_label="C++"
client->joinById<YourStateClass>("battle", {/* options */}, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

!!! Tip "Getting available `roomId`'s you can join"
    See [`getAvailableRooms()`](#getavailablerooms-roomname-string) to retrieve a list of rooms with their respective `roomId`'s available for joining, along with their metadata.
    
---

#### `reconnect (roomId: string, sessionId: string)`

Reconnects the client into a room he was previously connected with.

Must be used along with [`allowReconnection()`](/server/room#allowreconnection-client-seconds) in the server-side.

```typescript fct_label="TypeScript"
try {
  const room = await client.reconnect("wNHTX5qik", "SkNaHTazQ");
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.reconnect("wNHTX5qik", "SkNaHTazQ").then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.Reconnect<YourStateClass>("wNHTX5qik", "SkNaHTazQ");
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:reconnect("wNHTX5qik", "SkNaHTazQ", function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.reconnect("wNHTX5qik", "SkNaHTazQ", YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```haxe fct_label="C++"
client->reconnect<YourStateClass>("wNHTX5qik", "SkNaHTazQ", [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

---

#### `getAvailableRooms (roomName?: string)`

Queries for all available rooms to connect.

- Locked and private rooms won't be listed. 
- If the `roomName` parameter is ommitted, all rooms are going to be queried.

```typescript fct_label="JavaScript"
client.getAvailableRooms("battle").then(rooms => {
  rooms.forEach((room) => {
    console.log(room.roomId);
    console.log(room.clients);
    console.log(room.maxClients);
    console.log(room.metadata);
  });
}).catch(e => {
  console.error(e);
});
```

```csharp fct_label="C#"
try {
  var rooms = await client.GetAvailableRooms("battle");
  for (int i = 0; i < rooms.Length; i++) {
    Debug.Log(rooms[i].roomId);
    Debug.Log(rooms[i].clients);
    Debug.Log(rooms[i].maxClients);
    Debug.Log(rooms[i].metadata);
  }
} catch (ex) {
  Debug.Log(ex.Message)
}

/**
 * Retrieving custom metadata
 */
[Serializable]
class Metadata
{
	public string mode;
	public string name;
}

[Serializable]
class CustomRoomAvailable : RoomAvailable
{
	public Metadata metadata;
}

var rooms = await client.GetAvailableRooms<CustomRoomAvailable>("battle");
Debug.Log(rooms[0].metadata.mode);
```

```lua fct_label="lua"
client:get_available_rooms("battle", function(err, rooms)
  if (err) then
    console.error(err);
    return
  end

  for i, room in pairs(rooms) do
    print(room.roomId)
    print(room.clients)
    print(room.maxClients)
    print(room.metadata)
  end
end);
```

```haxe fct_label="Haxe"
client.getAvailableRooms("battle", function(err, rooms) {
  if (err != null) {
    trace(err);
    return;
  }

  for (room in rooms) {
    trace(room.roomId);
    trace(room.clients);
    trace(room.maxClients);
    trace(room.metadata);
  }
});
```

```cpp fct_label="C++"
client.getAvailableRooms("battle", [=](std::string err, nlohmann::json rooms) {
  if (err != "") {
    std::cout << "error: " << err << std::endl;
    return;
  }

  // rooms
});
```

---

#### `consumeSeatReservation (reservation)`

Join a room by manually consuming a "seat reservation".

```typescript fct_label="TypeScript"
try {
  const room = await client.consumeSeatReservation(reservation);
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.consumeSeatReservation(reservation).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.ConsumeSeatReservation<YourStateClass>(reservation);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:consume_seat_reservation(reservation, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.consumeSeatReservation(reservation, YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```cpp fct_label="C++"
client->consumeSeatReservation<YourStateClass>(reservation, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

!!! Tip "Advanced usage"
    See [Match-maker API](/server/matchmaker/#reserveseatforroom-options) to learn how to manually reserve a seat for a client within a room.

## The Room Instance:

### Properties

#### `state: any`

The current room's state. This variable is always synched with the latest
`state` from the server-side. To listen for updates on the whole state, see
[`onStateChange`](#onstatechange) event.

You may attach callbacks to specific structures inside your state. [See schema callbacks](/state/schema/#client-side).

---

#### `sessionId: string`

Unique identifier for the current connected client. This property matches the [`client.sessionId`](/server/client/#sessionid-string) from the server-side.

---

#### `id: string`

The unique idenfitier of the room. You can share this id with other clients in
order to allow them to connect directly to this room.

```typescript fct_label="JavaScript"
// get `roomId` from the query string
let roomId = location.href.match(/roomId=([a-zA-Z0-9\-_]+)/)[1];

// joining a room by its id
client.joinById(roomId).then(room => {
  // ...
});
```

---

#### `name: string`

Name of the room handler. Ex: `"battle"`.

---

### Methods

#### `send (type, message)`

Send a type of message to the room handler. Messages are encoded with MsgPack and can hold any JSON-seriazeable data structure.

```typescript fct_label="JavaScript"
//
// sending message with string type
//
room.send("move", { direction: "left"});

//
// sending message with number type
//
room.send(0, { direction: "left"});
```

```csharp fct_label="C#"
//
// sending message with string type
//
await room.Send("move", new { direction = "left" });

//
// sending message with number type
//
await room.Send(0, new { direction = "left" });
```

```lua fct_label="lua"
--
-- sending message with string type
--
room:send("move", { direction = "left" })

--
-- sending message with number type
--
room:send(0, { direction = "left" })
```

```haxe fct_label="Haxe"
//
// sending message with string type
//
room.send("move", { direction: "left" });

//
// sending message with number type
//
room.send(0, { direction: "left" });
```

!!! tip "Use `Room#onMessage()` from the server-side to receive the messages"
    Check out [Server-side API &raquo; Room - onMessage()](/server/room/#onmessage-type-callback) section.

---

#### `leave ()`

Disconnect from the room.

```typescript fct_label="JavaScript"
room.leave();
```

```csharp fct_label="C#"
room.Leave();
```

```lua fct_label="lua"
room:leave()
```

```haxe fct_label="Haxe"
room.leave();
```

!!! Tip
    Use [Room#onLeave()](/server/room/#onleave-client-consented) to handle the disconnection from the server-side.

---

#### `removeAllListeners()`

Removes `onMessage`, `onStateChange`, `onLeave` and `onError` listeners.

### Events

#### onStateChange

!!! Tip "You may trigger callbacks for specific Schema structures"
    Check out the [State Handling » Schema » Client-side](/state/schema/#client-side) section for more details.

This event is triggered when the server updates its state.

```typescript fct_label="JavaScript"
room.onStateChange.once((state) => {
  console.log("this is the first room state!", state);
});

room.onStateChange((state) => {
  console.log("the room state has been updated:", state);
});
```

```csharp fct_label="C#"
room.OnStateChange += (state, isFirstState) => {
  if (isFirstState) {
    Debug.Log ("this is the first room state!");
  }

  Debug.Log ("the room state has been updated");
}
```

```lua fct_label="lua"
room:on("statechange", function(state)
  print("new state:", state)
end)
```

```haxe fct_label="Haxe"
room.onStateChange += function(state) {
  trace("new state:" + Std.string(state));
};
```

```cpp fct_label="C++"
room.onStateChange = [=](State>* state) {
  std::cout << "new state" << std::endl;
  // ...
};
```

---

#### onMessage

This event is triggered when the server sends a message directly to the client, or via broadcast.

```typescript fct_label="JavaScript"
room.onMessage("powerup", (message) => {
  console.log("message received from server");
  console.log(message);
});
```

```csharp fct_label="C#"
class PowerUpMessage {
  string kind;
}

room.OnMessage<PowerUpMessage>("powerup", (message) => {
  Debug.Log ("message received from server");
  Debug.Log(message);
});
```

```lua fct_label="lua"
room:on_message("powerup", function(message)
  print("message received from server")
  print(message)
end)
```

```haxe fct_label="Haxe"
room.onMessage("powerup", function(message) {
  trace("message received from server");
  trace(Std.string(message));
});
```

```cpp fct_label="C++"
room.onMessage("powerup", [=](msgpack::object message) -> void {
    std::cout << "message received from server" << std::endl;
    std::cout << message << std::endl;
});
```

!!! Tip
    To send a message from the server directly to the clients you'll need to use
    either [client.send()](/server/client/#sendtype-message) or
    [room.broadcast()](/server/room/#broadcast-type-message-options)

---

#### onLeave

This event is triggered when the client leave the room.

```typescript fct_label="JavaScript"
room.onLeave((code) => {
  console.log("client left the room");
});
```

```csharp fct_label="C#"
room.OnLeave += (code) => {
  Debug.Log ("client left the room");
}
```

```lua fct_label="lua"
room:on("leave", function()
  print("client left the room")
end)
```

```haxe fct_label="Haxe"
room.onLeave += function () {
  trace("client left the room");
};
```

```haxe fct_label="Haxe"
room.onLeave = [=]() -> void {
  std::cout << "client left the room" << std::endl;
};
```

**Possible closing `code`s and their meaning:**

- `1000` - Regular socket shutdown
- Between `1001` and `1015` - Abnormal socket shutdown 
- Between `4000` and `4999` - Custom socket close code (See [more details](/server/room/#table-of-websocket-close-codes))


---

#### onError

This event is triggered when some error occurs in the room handler.

```typescript fct_label="JavaScript"
room.onError((code, message) => {
  console.log("oops, error ocurred:");
  console.log(message);
});
```

```csharp fct_label="C#"
room.OnError += (code, message) => {
  Debug.Log ("oops, error ocurred:");
  Debug.Log(message);
}
```

```lua fct_label="lua"
room:on("error", function(code, message)
  print("oops, error ocurred:")
  print(message)
end)
```

```haxe fct_label="Haxe"
room.onError += function(code, message) {
  trace("oops, error ocurred:");
  trace(message);
};
```

```cpp fct_label="C++"
room.onError = [=] (int code, std::string message) => void {
  std::cout << "oops, error ocurred: " << message << std::endl;
};
```
