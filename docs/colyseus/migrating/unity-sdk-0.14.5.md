# Upgrading to the new Unity Colyseus SDK 0.14.5 (May 10th, 2021)

## Introduction

In an effort to better support future releases and updates, some fairly major changes were required to the existing Colyseus Unity plugin. Code has been organized and integrated in a more "Unity-friendly" way and some classes have been re-named to prevent naming overlaps.

[Unity SDK 0.14.5 on GitHub](https://github.com/colyseus/colyseus-unity3d/releases/tag/0.14.5)

## Code Refactoring

### Plugins Folder

The code no longer lives in the Plugins folder. If you're updating your project, you can simply remove all colyseus code from the Plugins folder (before or after the package is imported).

### Server Settings

The server settings have been moved into a more generalized ScriptableObject. Users can have different development and production settings objects and assign them to their manager class as required.

### ColyseusManager

One of the bigger changes in this upgrade is that ColyseusManager is now a generic-typed class, so your project will need a class that inherits from ColyseusManager.

```csharp
public class YOUR_MANAGER_CLASS : ColyseusManager<YOUR_MANAGER_CLASS>
{
    //Any override or additional functionality you need
}
```
This will allow you to inherit from and override manager functionality as needed, though if that isn't required, that example above would be sufficient (or feel free to use our ExampleManager, provided with the package). All ColyseusClient handling (previously "Client") should occur within this class, however if that is too big of a refactor for your codebase you are welcome to expose the ColyseusClient as needed. Additionally, invoking ColyseusManager.Instance previously would instantiate the ColyseusManager object (if it was currently null). Due to these changes, you must now make a GameObject in the scene and attach **your** manager script to it.

### Auth and `@colyseus/social`

The `client.Auth` has been deprecated. If your project relies on that feature, feel free to [copy the Auth.cs file over into your project](https://github.com/colyseus/colyseus-unity3d/blob/2d54b25c1b8118191a627556d06aa14313f269f8/Assets/Plugins/Colyseus/Auth.cs).

### FossilDeltaSerializer

FossilDeltaSerializer has been removed from the plugin entirely.

### Renamed Classes

| **Old Name** | **New Name** | **Notes** |
| --- | --- | --- |
| MessageHandler | ColyseusMessageHandler |
| MatchMakeResponse | ColyseusMatchMakeResponse | Broken out of Client.cs |
| Room | ColyseusRoom |
| Room Available | ColyseusRoomAvailable | Broken out of Client.cs |
| RoomAvailableCollection | CSARoomAvailableCollection | Broken out of Client.cs |
| NoneSerializer | ColyseusNoneSerializer |
| SchemaSerializer | ColyseusSchemaSerializer |
| Serializer | ColyseusSerializer |
| Context | ColyseusContext |
| Decoder | ColyseusDecoder |
| Encoder | ColyseusEncoder |
| ReferenceTracker | ColyseusReferenceTracker |
| ArraySchema | ColyseusArraySchema |
| CustomType | ColyseusCustomType |
| Reflection | ColyseusReflection |
| ArrayUtils | ColyseusArrayUtils |
| Exceptions | ColyseusExceptions |
| ExtensionMethods | ColyseusExtensionMethods |
| HttpQSCollection | ColyseusHttpQSCollection | Broken out of HttpUtility.cs |
| HttpUtility | ColyseusHttpUtility |
| ObjectExtensions | ColyseusObjectExtensions |
| UnityWebRequestAwaiter | ColyseusUnityWebRequestAwaiter | Broken out of ExtensionMethods.cs |
| Client | ColyseusClient |
| Connection | ColyseusConnection |
| Protocol | ColyseusProtocol |

## Example Integration

- Import the new Colyseus Unity package
- Delete all Colyseus Code from the Plugins folder
  - Directories include:
    - Colyseus
    - FossilDelta
    - Serialization
    - Websocket
- Create a manager class that inherits from `ColyseusManager`
  - Place an empty gameobject in the scene and attach this script (or attach it to an existing manager class)
  - If you already have a manager class that handles most Colyseus functionality, consider having **that** class inherit from `ColyseusManager`
- Create a server settings object
  - Right-Click > Create > Colyseus > Generate ColyseusSettings ScriptableObject
  - Assign that object in the "ColyseusSettings" field of your manager

It was very difficult to imagine all potential use cases of the existing plugin and take them into account when making these changes. However, we feel the changes that have been made will be beneficial for the future of the project, improving both longevity and stability. If you run into any problems when attempting to upgrade your project, please reach out and let us know so we can help and so we can update this documentation to help other developers in the future!
