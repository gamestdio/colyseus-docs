# Starboss Tech Demo
This demo began with the [Unity Procedural Boss Demo](https://www.youtube.com/watch?v=LVSmp0zW8pY) [(Source available here)](https://on.unity.com/37K5j1b), which our team converted into a multiplayer experience with two different game modes.

The purpose of this technical demo is to show how to take an existing, single player project and convert it to handle a full, multiplayer game cycle. The demo is designed to work with Colyseus version 0.14.7 and [Unity version 2020.1.5f1](https://unity3d.com/unity/qa/lts-releases).

**[Download demo](https://github.com/colyseus/unity-demo-starboss/archive/main.zip)** ([View source code](https://github.com/colyseus/unity-demo-starboss/))

[Play the demo!](https://sac-dt.colyseus.dev/)

![Screenshot](screenshot.PNG)

## Getting Started

### Launching a local server

You need to install and launch the server from the **provided Server directory** for this demo to function properly. Simply follow the instructions found underneath [“Running the demo server” in the Unity3d section of these docs](/getting-started/unity3d-client/#running-the-demo-server).

### ColyseusSettings ScriptableObject

All server settings can be changed via the ColyseusSetting ScriptableObject located here:

![ScriptableObject](../common-images/scriptable-object.png)

If you are running a local server, the default settings should be sufficient, however if you wish to host a server you’ll need to change the **Colyseus Server Address** and **Colyseus Server Port** values accordingly.

### Playing the Demo

Start the player in the scene “StarBossLobby” located at `Assets\StarBoss\Scenes\StarBossLobby`. Input your username and create a room to begin. **If you cannot reach the room creation screen, confirm your local server is working properly and check the Unity Editor for error logs.** If you are successful, the client will load the “Scene_Dev_Environment” scene. When creating a room, you have the option to make a Co-op or a Team Deathmatch room. If you press the Enter key or click the “Start” button within a Co-op room, you’ll “ready up” and the game will begin. If you wait for more players to join on your local server, all players must “ready up” before the game will begin. If you made a Team Deathmatch room, you will need at least 1 more player to join on the other team before you can begin

## Demo Overview

### Creating and Listing Rooms with Different Game Modes
In the overridden `CreateRoom` function in `StarBossLobbyController.cs` on the client side, you can see where we determine if we're launching a room of type Team Deathmatch or Co-op:
```csharp
string gameModeLogic = coopToggle.isOn ? "starBossCoop" : "starBossTDM";
roomOptions = new Dictionary<string, object> {{"logic", gameModeLogic }, { "scoreToWin", 3 } };
LoadMainScene(() => { ExampleManager.Instance.CreateNewRoom(selectRoomMenu.RoomCreationName, roomOptions);
```
On the server side in `StarBossRoom.ts` we receive these `roomOptions` and use the `logic` member to determine which type of room we're going to create:
```javascript
// Retrieve the custom logic for the room
const  customLogic = await  this.getCustomLogic(options["logic"]);
if(customLogic == null) logger.debug("NO Custom Logic Set");
try{
	if(customLogic != null) {
		this.setMetadata({isCoop:  options["logic"] == "starBossCoop" });
		customLogic.InitializeLogic(this, options);
	}
}
catch(error){
	logger.error("Error with custom room logic: " + error);
}
```
In this line:
```javascript
this.setMetadata({isCoop:  options["logic"] == "starBossCoop" });
```
We set the value for `isCoop` in the room's metadata, which we can then use on the client side to display the type of room. 

To accomplish this, on the client side we created a Serializable class `StarBossRoomMetaData.cs` that contains the `isCoop` value. We then use this class within our custom `StarBossRoomAvailable` which inherits from `ColyseusRoomAvailable`:
```csharp
[System.Serializable]
public class StarBossRoomAvailable : ColyseusRoomAvailable {
    public StarBossRoomMetaData metadata;
}
```
And then within  `ExampleManager.cs` we have updated the `GetAvailableRooms` function to receive data of type `StarBossRoomAvailable`:
```csharp
public async void GetAvailableRooms() {
    StarBossRoomAvailable[] rooms = await client.GetAvailableRooms<StarBossRoomAvailable>(_roomController.roomName);
    onRoomsReceived?.Invoke(rooms);
}
```
We also updated the `OnRoomsReceived` delegate call to use `StarBossRoomAvailable`. Finally, for every entry we receive, we Instantiate an object with a `RoomListItem` component attached  and we pass it a reference to the room available. In the `DetermineMode` function in `RoomListItem.cs`:
```csharp
bool isCoop = roomRef.metadata.isCoop;

if (isCoop) {
    roomName.text = roomRef.roomId;
    gameMode.text = "Co-op";
    gameMode.color = coopColor;
    backgroundImage.color = coopColor;
}
else {
    roomName.text = roomRef.roomId;
    gameMode.text = "Team Deathmatch";
    gameMode.color = deathmatchColor;
    backgroundImage.color = deathmatchColor;
}
```
The final result gives us something like this:
![RoomList](room-list.PNG)

## Adjusting the Demo

As you play around with this demo, you may want to make some adjustments to better familiarize yourself with what is happening. Below, you’ll learn how to make these minor adjustments.

### Team Deathmatch Score to Win

The maximum score to win in a Team Deathmatch is currently set to 3 on the client side in the overridden `CreateRoom` function in `StarBossLobbyController.cs`:
```csharp
roomOptions = new Dictionary<string, object> {{"logic", gameModeLogic }, { "scoreToWin", 3 } };
LoadMainScene(() => { ExampleManager.Instance.CreateNewRoom(selectRoomMenu.RoomCreationName, roomOptions);
```

On the server side, we receive these `roomOptions` and use them to initialize the game logic. Only if we're initializing a Team Deathmatch room, do we make use of the `scoreToWin` option as seen in `starBossTDM.js`:
```javascript
roomRef.tdmScoreToWin = options["scoreToWin"] ? Number(options["scoreToWin"]) : 10;
```
