# Shooting Gallery Tech Demo

The purpose of this technical demo is to show how to create rooms, utilize customized game logic and handle a full, multiplayer game cycle. The demo is designed to work with Colyseus version 0.14 and [Unity version 2019.4.20f1](https://unity3d.com/unity/qa/lts-releases).

**[Download demo](https://github.com/colyseus/unity-demo-shooting-gallery/archive/master.zip)** ([View source code](https://github.com/colyseus/unity-demo-shooting-gallery/))

![Screenshot](screenshot.png)

## Getting Started

### Launching a local server

You need to install and launch the server from the **provided Server directory** for this demo to function properly. Simply follow the instructions found underneath [“Running the demo server” in the Unity3d section of these docs](/getting-started/unity3d-client/#running-the-demo-server).

### ColyseusSettings ScriptableObject

All server settings can be changed via the ColyseusSetting ScriptableObject located here:

![ScriptableObject](../common-images/scriptable-object.png)

If you are running a local server, the default settings should be sufficient, however if you wish to host a server you’ll need to change the **Colyseus Server Address** and **Colyseus Server Port** values accordingly.

### Playing the Demo

Start the player in the scene “Lobby” located at `Assets\GalleryShooter\Scenes\Lobby`. Input your username and create a room to begin. **If you cannot reach the room creation screen, confirm your local server is working properly and check the Unity Editor for error logs.** If you are successful, the client will load the “GalleryShooter” scene. If you press the Enter key or click the “Start” button, you’ll “ready up” and the game will begin. If you wait for more players to join on your local server, all players must “ready up” before the game will begin.


## Adjusting the Demo

As you play around with this demo, you may want to make some adjustments to better familiarize yourself with what is happening. Below, you’ll learn how to make these minor adjustments.

### Targets

The values used for the Targets in-game can be found in the server code at `Server\src\rooms\customLogic\targets.ts`. Here, you can adjust the score values, rename targets and add/remove target options. If you add a new target, make sure to also give it a new “id” value otherwise the Unity client will not know what target model to display.

These target options on the client can be adjusted in the “TargetController” prefab, located at `Assets\GalleryShooter\Prefabs\Targets\Controls\TargetController.prefab`. If you wish to adjust the models or add new targets, here is where you prepare the client for them

### Target Movement

The targets, when provided from the server, will be handed off to the corresponding TargetTreadmill based off of their row. “Row” is randomly set on the server in `target.ts` at line 52. If you add or remove rows in the GalleryShooter scene, the server must be made aware of it via `LobbyController.numberOfTargetRows`:

![numberOfTargetRows](/demo/shooting-gallery/number-of-target-rows.png)

This number will be fed to the server upon initialization of a room and that value will be used when randomly selecting a target’s row.

The treadmills individually control the frequency with which they’ll send out targets:

![Time between targets](/demo/shooting-gallery/time-between-targets.png)

The TargetBase objects control their own speed here:

![Move speed](/demo/shooting-gallery/move-speed.png)

### Adjusting the guns

The important values for the gun can be changed on the Gun prefab here:

![Guns](/demo/shooting-gallery/guns.png)

### Max Players

The default max number of players is set to `25`. You can adjust that in `Server\src\rooms\ShootingGalleryRoom.ts` at line `94`. Or, if you wish to have no limit, simply remove this line.

### Adjust Player Movement

You can tweak the player’s movement values on the prefab located at `Assets\GalleryShooter\Prefabs\GalleryShootPlayer.prefab`. Here you can also adjust the interpolation rates for movement of remote players along with other limits.
