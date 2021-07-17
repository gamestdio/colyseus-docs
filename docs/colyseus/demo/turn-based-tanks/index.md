# Turn Based Tanks Demo

The goal of this demo is to serve as an example of one approach to an asynchronous, turn based game using Colyseus.
This demo is designed to work with Colyseus version 0.14.7 and [Unity version 2019.4.20f1](https://unity3d.com/unity/qa/lts-releases).

**[Download demo](https://github.com/colyseus/unity-demo-tanks/archive/main.zip)** ([View source code](https://github.com/colyseus/unity-demo-tanks/))

[Play the demo!](https://xcdazr.colyseus.dev/)

![Lobby](/demo/turn-based-tanks/WeaponFired.png)

## Getting Started

### Launching a local server

You need to install and launch the server from the **provided Server directory** for this demo to function properly. Simply follow the instructions found underneath [&quot;Running the demo server&quot; in the Unity3d section of these docs](https://docs.colyseus.io/getting-started/unity3d-client/#running-the-demo-server).

### ColyseusSettings ScriptableObject

All server settings can be changed via the ColyseusSetting ScriptableObject located here:

![ScriptableObject](../common-images/scriptable-object.png)

If you are running a local server, the default settings should be sufficient, however if you wish to host a server you will need to change the **Colyseus Server Address** and **Colyseus Server Port** values accordingly.

## Demo Overview

### Room Metadata

This demo makes use of the room&#39;s metadata to track the players in the game with their username. When a player joins or creates a room their username will be stored in a property called either `team0` or `team1` where `team0` represents the player that created the room and `team1` represents the player that has joined an available room to challenge the creator.
``` javascript
this.metadata.team0
this.metadata.team1

this.setMetadata({"team0": options["creatorId"]});

```

The usernames set in the metadata are then used to filter the available rooms displayed in the lobby. Within the lobby users are able to see any rooms they have created or are available based on whether the room is waiting for a challenger to join the game. Rooms that you have not created and have two players will not be shown in the lobby.

``` csharp
private TanksRoomsAvailable[] TrimRooms(TanksRoomsAvailable[] originalRooms)
{
    List<TanksRoomsAvailable> trimmedRooms = new List<TanksRoomsAvailable>();
    for (int i = 0; i < originalRooms.Length; ++i)
    {
        //Check a rooms metadata. If its one of our rooms OR waiting for a player, we show it
        TanksRoomMetadata metadata = originalRooms[i].metadata;
        if (metadata.team1 == null || (metadata.team1.Equals(ExampleManager.Instance.UserName) ||
                                       metadata.team0.Equals(ExampleManager.Instance.UserName)))
        {
            trimmedRooms.Add(originalRooms[i]);
        }
    }

    return trimmedRooms.ToArray();
}
```

![Lobby](/demo/turn-based-tanks/Rooms.png)

### Keeping the Room Alive

In order to make this demo an asynchronous turn based game we need to keep the room alive even after both players have left the room. The room is kept alive by setting the `autoDispose` flag to false. (You can see this in the TanksRoom server code within the onCreate handler).

``` javascript
this.autoDispose = false;
```

We know to disconnect the room after the boolean flag `inProcessOfQuitingGame` has been set true after performing checks to determine if the room should be closed. These checks are performed when a user has quit the game.
``` javascript

// Check if creator has quit before anyone else has joined
if(this.metadata.team0 && this.metadata.team1 == null) {
    disconnectRoom = true;
}

// No other users are in the room so disconnect
if(this.inProcessOfQuitingGame && this.state.networkedUsers.size <= 1 && this.connectedUsers <= 1) {
    disconnectRoom = true;
}
	
// Should the room disconnect?
if(disconnectRoom) {
    this.disconnect();
}
```

### Pausing the Room

Since this is an example of an asynchronous game, our room could have no users connected to it for any amount of time. When there are no users connected to the room the server doesn't need to update the simulation loop. 
When users disconnect from the room a check is performed to look if there are no more users connected to the room. When no more users are connected to the room the simulation interval effectively gets paused by setting the delay to a high value. In this case the value is a little more than 24 days.
``` javascript

// Within the room's `onLeave` handler
// Check if the server should pause the simulation loop because
// there are no users connected to the room
let anyConnected: boolean = false;
this.state.players.forEach((player, index) => {
    if(player.connected) {
        anyConnected = true;
    }
});

if(anyConnected == false) {
    // There are no users connected so pause the server updates
    this.setServerPause(true);
}


private setServerPause(pause: boolean) {

    if(pause) {
        this.setSimulationInterval(dt => this.gameLoop(dt), this.pauseDelay);
    }
    else {
        // Set the Simulation Interval callback
        this.setSimulationInterval(dt => this.gameLoop(dt));
    }

    this.serverPaused = pause;
}
```

When users rejoin a room that has been paused, the simulation interval is restored.
``` javascript

// Within the room's `onJoin` handler
// Check if the server needs to be unpaused
if(this.serverPaused) {
    // The server is currently paused so unpause it since a player has connected
    this.setServerPause(false);
}
```

### Playing the Demo

Start the player in the scene &quot;TanksLobby&quot; located at `Assets\TurnBasedTanks\Scenes\TanksLobby`. Input your username and create a room to begin. **If you cannot reach the room creation screen, confirm your local server is working properly and check the Unity Editor for error logs.** If you are successful, the client will load the &quot;TankArena&quot; scene.

- This demo is an asynchronous turn based game.

- You can leave a room at any point and later return to a game in progress and it will pick up where it last left off.

- Only two players can play in a game.

- Goal being to destroy your opponent&#39;s tank.

- Each player has 3 Hit Points displayed in the top corners of the screen.

- When you create a room you can immediately take your turn without another player having joined yet.

- All controls are displayed in the **ESC** menu.

- You have the ability to leave the room at any time using the Exit option in the ESC menu, or you can Surrender the game to your opponent.

- You have 3 Action Points for your turn. Moving left/right consumes **one** AP and firing consumes **two** AP.

- Movement can be blocked by terrain that is too tall.

- To fire your tank&#39;s weapon you left click with the mouse and hold to charge the shot. Releasing the left mouse will fire.

- You have 3 weapons of varying range to choose from. Select your weapon with the 1-3 numbered keys.

- Between each movement or firing action there is a 2 second delay before another action can be taken.

- When a game ends due to a player&#39;s tank getting destroyed, or someone surrendering, a game over menu, showing a win/loss message, will be displayed with the options to either request a rematch or to quit the game. If the other player requests a rematch before you leave, a message will be displayed on the game over menu.

- There is an &quot;online indicator&quot; next to your opponents name to signal whether they are in the room at the same time with you. 
	- **Red** = offline 
	- **Green** = online.

- You have the option to skip your remaining turn by pressing the SPACEBAR.

![Lobby](/demo/turn-based-tanks/GameplayWithLabels.png)
![Lobby](/demo/turn-based-tanks/GameOver.png)

## Adjusting the Demo

As you play around with this demo, you may want to make some adjustments to better familiarize yourself with what is happening. Below, you&#39;ll learn how to make these minor adjustments.

### Game Rules and Weapon Data

Both the **Game Rules** and **Weapon Data** values can be found in the server code at `ArenaServer\src\rooms\tanks\rules.ts`. The **Game Rules** control movement and firing costs as well as how many action points players get. The data in `weaponList` specifies the max charge, charge time, impact radius, and impact damage of each weapon.

```javascript
const GameRules = {
    MaxActionPoints: 3,
    MovementActionPointCost: 1,
    FiringActionPointCost: 2,
    ProjectileSpeed: 30,
    MaxMovement: 3,
    MaxHitPoints: 3,
    MovementTime: 2,
}

const weaponList = [
    {
        name: "Short Range",
        maxCharge: 5,
        chargeTime: 1,
        radius: 1,
        impactDamage: 1,
        index: 0
    },
    {
        name: "Mid Range",
        maxCharge: 8,
        chargeTime: 2,
        radius: 1,
        impactDamage: 1,
        index: 1
    },
    {
        name: "Long Range",
        maxCharge: 10,
        chargeTime: 5,
        radius: 1,
        impactDamage: 1,
        index: 2
    }
]

```
