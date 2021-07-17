# Construct 3 SDK

## Installation

- [Download Construct 3 SDK](https://www.construct.net/en/make-games/addons/111/colyseus-multiplayer-client)

!!! Warning "Attention! You need a server to use Colyseus!"
    Construct has well-known existing features to "host" a multiplayer session from the client-side. This is not possible when using Colyseus. Colyseus is an authoritative **server**, written in Node.js. You can't let your client-side host the game sessions directly.

!!! tip "Construct 3 SDK: Source code"
    You can find the source code of the Construct SDK's here: [Construct 3](https://github.com/colyseus/colyseus-construct3) (compatible with C3 and C2 runtime from Construct3) / [Construct 2](https://github.com/colyseus/colyseus-construct2) (not up-to-date - compatible with server 0.9.x)

## Example project

The example project has a similar result as the [TypeScript (pixijs-boilerplate)](https://github.com/endel/colyseus-pixijs-boilerplate).

- [Client-side (c3p project)](/_downloads/ColyAgarClient-0-14-0.c3p)
- [Server-side on Glitch (source-code)](https://glitch.com/~colyseus-construct3)


## Handling messages

An important note when sending messages from the server to the clients: you need
to provide an object with a `"type"` field, in order for the client to be able
to parse it.

**Server-side**

```typescript
this.broadcast("foo", "bar");
```

**Client-side**

Use the `On Message` condition, with `"foo"` as argument. The expression `CurrentValue` will have the value `"bar"`.


## Properties

### Default Endpoint
Default Endpoint to use on "Connect" action.

## Actions

### Set endpoint to {0}
Format: wss://example.com

### Join room {0} with options {1}.
Join a room by name

### Join room {0} with options {1}.
Join a room by name

### Create room {0} with options {1}.
Create a room by name

### Join room {0} with options {1}.
Join an existing room by its ID

### Reconnect into room {0} with sessionId {1}.
Reconnect using a previously connected room

### Send {0} with {1}
Send message to a room

### Leave from the room
Disconnect client from the room.

### Get available {0} rooms.
Get available rooms by name, OnGetAvailableRooms triggered when data is available. Data returned as JSON string in expression CurrentValue

## Conditions

### On Join
Triggered when joined successfully into a room.

### On Leave
Triggered when left from a room.

### On Error
Triggered when an error happened on the server.

### On Message ({0})
Triggered when the room broadcasts a message, or sends a message directly to this client.

### On State Change
Triggered when the state of the room changes.

### On Get Available Rooms
Triggers when available rooms data is ready in the CurrentValue expresssion.

### On add at {0}
Triggers when an item is added to ArraySchema or MapSchema.

### On field change at {0}
Triggers when a field is changed inside a Schema instance. Need to use

### On change at {0}
Triggers when an item is changed inside ArraySchema or MapSchema.

### On remove at {0}
Triggers when an item is removed from ArraySchema or MapSchema.

### Is index {0}
Only available for Arrays and Maps. Check if index of current item is equals to provided value.

### Is field {0}
Only available during "On change" of a direct object. Checks if a field name has changed.

## Expressions

### JSON
Declare a JSON value.

### CurrentValue
Get value from current item

### PreviousValue
Get previous value from current field. Only available during "On change" on an instance variable. Not avaialble for arrays and maps.

### CurrentValueAt
Get nested value from current item

### CurrentIndex
Get index of current item. Available during "On Add", "On Change" or "On Remove"

### CurrentField
Get current field being changed. Available during "On field change"

### State
Get a value from room's state

### SessionId
Unique sessionId of the current user

### ErrorCode
Get last error code

### ErrorMessage
Get last error message
