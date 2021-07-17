# Cocos2d-x SDK

## Installation

- Download [Cocos2d-X](http://www.cocos2d-x.org/download) and follow their [installation instructions](https://github.com/cocos2d/cocos2d-x#download-stable-versions).
- Download [colyseus-cocos2d-x](https://github.com/colyseus/colyseus-cocos2d-x/archive/master.zip) and copy the `Source/` files into your project.
- Add the `Source/` directory to your project's `Header Search Paths`.

!!! tip "Looking for Cocos Creator?"
    See [JavaScript » Cocos Creator](/getting-started/javascript-client/#cocos-creator-30).

## Usage

Below you can see how to use the `Client`, matchmake into a `Room`, and send and
receive messages from the connected room.

> See how to generate your `RoomState` from [State Handling](/state/schema/#client-side-schema-generation)

```cpp
#include "Colyseus/Client.h";

Client* client = new Client("ws://localhost:2567");
Room* room;

bool HelloWorld::init()
{
    client = new Client("ws://localhost:2667");
    client->joinOrCreate<RoomState>("state_handler", {}, [=](MatchMakeError *err, Room<RoomState>* _room) {
        if (err != "") {
            std::cout << "JOIN ERROR! " << err << std::endl;
            return;
        }

        room = _room;

        room->onMessage("type", [=] (msgpack::object message) -> void {
            std::cout << message << std::endl;
        });

        room->onStateChange = [=] (RoomState* state) -> void {
            // ...
        };

        room->onError = [this](std::string message) -> void {
            std::cout << "ROOM ERROR => " << message.c_str() << std::endl;
        };

        room->onLeave = [this]() -> void {
            std::cout << "LEFT ROOM" << std::endl;
        };

        room->getState()->players->onAdd = [this](Player* player, string sessionId) -> void {
            // add player sprite
            auto sprite = Sprite::create("HelloWorld.png");
            sprite->setPosition(player->x, player->y);
            players.insert(sessionId, sprite);
            this->addChild(sprite, 0);

            player->onChange = [this, sprite, player](std::vector<colyseus::schema::DataChange> changes) -> void {
                for(int i=0; i < changes.size(); i++)   {
                    if (changes[i].field == "x") {
                        sprite->setPositionX(player->x);

                    } else if (changes[i].field == "y") {
                        sprite->setPositionY(player->y);
                    }
                }
            };
        };

        room->getState()->players->onRemove = [this](Player* player, string sessionId) -> void {
            std::cout << "onRemove called!" << std::endl;
            auto sprite = players.at(sessionId);
            this->removeChild(sprite);
            players.erase(sessionId);
            std::cout << "onRemove complete!" << std::endl;
        };

        std::cout << "Done!" << std::endl;
    });
}
```

## Example

The example is using [colyseus-examples](https://github.com/colyseus/colyseus-examples) as a server (`02-state-handler.ts` example). Please follow installation instructions from [colyseus-examples](https://github.com/colyseus/colyseus-examples)'s README.

### Running the client

From the `Example` directory, run the `cocos run -p {platform-id}` command,
e.g.:

**Building for Windows:**

```
cocos run -p win32
```

**Building for Mac:**

```
cocos run -p mac
```