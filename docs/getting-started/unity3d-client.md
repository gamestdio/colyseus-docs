## Installation

- Download the latest version of [colyseus-unity3d](https://github.com/colyseus/colyseus-unity3d) locally. ([download link](https://github.com/colyseus/colyseus-unity3d/archive/master.zip))
- Copy `Assets/Plugins` files into your Unity project.

## Running the demo server

The [colyseus-unity3d](https://github.com/colyseus/colyseus-unity3d) comes with a [usage example](https://github.com/colyseus/colyseus-unity3d/blob/master/Assets/ColyseusClient.cs), and a simple [room handler](https://github.com/colyseus/colyseus-unity3d/blob/master/Server/DemoRoom.ts) for basic testing. You can test it locally by running these commands in your commandline:

```
cd Server
npm install
npm start
```

The demo server is using [`@colyseus/social`](/tools/colyseus-social/) for user authentication. Please download and install MongoDB locally: [https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials)

!!! Tip
    Ensure you have [Node v8+](http://nodejs.org/) installed locally to run the server.
    
!!! Tip
    As an alternative to running MongoDB locally, [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) also works fine. After registering for the free tier, log in and click the button to "Connect" to your cluster. In the wizard select "Connect your application" and go for the username + password version. Finally copy the connection string and in the first line the index.ts file of the example server, set the connection string environmental parameter which is picked up by the colyseus/social - ```process.env.MONGO_URI = 'mongodb+srv://<username>:<password>@cluster0-aaaa.mongodb.net/test?retryWrites=true&w=majority'```. This should take ~5 minutes, if it does not work: 1) have you whitelisted your IP adress and 2) Did you click 'generate user' in the 'Connect' wizard?

## Usage

Each `Client` and `Room` connections need to run on its own Coroutine. See [usage example](https://github.com/colyseus/colyseus-unity3d/blob/master/Assets/ColyseusClient.cs) for more details.

### Connecting to the Server

```csharp
Client client = new Colyseus.Client ("ws://localhost:2567");
```

### Joining a Room

> See how to generate your `RoomState` from [State Handling](/state/schema/#client-side-schema-generation)

```csharp
try {
    Room room = await client.JoinOrCreate<RoomState> ("room_name");
    Debug.Log("Joined successfully!");

} catch (ex) {
    Debug.Log("Error joining: " + ex.Message);
}
```

### Getting the full room state from the server.

```csharp
room.OnStateChange += OnStateChange;

void OnStateChange (State state, bool isFirstState)
{
	if (isFirstState) {
		// First setup of your client state
		Debug.Log(state);
	} else {
		// Further updates on your client state
		Debug.Log(state);
	}
}
```

### Attaching callbacks to your [schema](/state/schema/#client-side) structures

> See how to generate your `RoomState` from [State Handling](https://docs.colyseus.io/state/schema/#client-side-schema-generation)

```csharp
Room room = await client.Join<RoomState> ("room_name");
Debug.Log("Joined room successfully.");

room.State.players.OnAdd += OnPlayerAdd;
room.State.players.OnRemove += OnPlayerRemove;
room.State.players.OnChange += OnPlayerChange;

void OnPlayerAdd(Player player, string key)
{
	Debug.Log("player added!");
	Debug.Log(player); // Here's your `Player` instance
	Debug.Log(key); // Here's your `Player` key
}

void OnPlayerRemove(Player player, string key)
{
	Debug.Log("player removed!");
	Debug.Log(player); // Here's your `Player` instance
	Debug.Log(key); // Here's your `Player` key
}

void OnPlayerChange(Player player, string key)
{
	Debug.Log("player moved!");
	Debug.Log(player); // Here's your `Player` instance
	Debug.Log(key); // Here's your `Player` key
}
```

## Debugging

If you set a breakpoint in your application while the WebSocket connection is open, the connection will be closed automatically after 3 seconds due to inactivity. To prevent the WebSocket connection from dropping, use `pingInterval: 0` during development:

```typescript
import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({
  // ...
  pingInterval: 0 // HERE
});
```

Make sure to have a `pingInterval` higher than `0` on production. The default `pingInterval` value is `3000`.
