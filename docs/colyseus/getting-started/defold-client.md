# Defold SDK

Defold Engine is a Free 2D Game Engine for Cross-Platform Publishing.

The [colyseus-defold](https://github.com/colyseus/colyseus-defold) SDK has been tested on all major platforms supported by Defold, such as HTML5, iOS, Android, Mac and Windows.

## Installation

You will need to add [colyseus-defold](https://github.com/colyseus/colyseus-defold), as well as its dependencies into your `game.project` dependencies section in order to use the SDK.

Open your `game.project` file, and add the following URLs to the `Dependencies` section (under `Project -> Dependencies`):

    https://github.com/colyseus/colyseus-defold/archive/0.14.zip
    https://github.com/defold/extension-websocket/archive/refs/tags/2.2.3.zip

Read more about [Defold library dependencies](http://www.defold.com/manuals/libraries/)

You can also specify a [specific release](https://github.com/colyseus/colyseus-defold/releases) of the SDK, by copying its respective zip archive URL.

## Usage

```lua
local ColyseusClient = require "colyseus.client"

local client
local room

function init(self)
    -- Add initialization code here
    client = ColyseusClient.new("ws://localhost:2567")

    -- join chat room
    client:join_or_create("chat", {}, function(err, _room)
      if err then
        print("JOIN ERROR: " .. err)
        return
      end

      room = _room
    end)
end
```

See [client-side documentation](/client/client/).

## FAQ

### "I can't connect to the local server!"

When running on localhost, make sure you don't have any service running on port
80, otherwise the client won't connect into the specified port number.

Alternatively, you can bind the Colyseus server to port 80.

### "`reconnect()` is not working on iOS!"

If you lock your phone, all WebSocket connections will be closed. You can call `reconnect()` to reestablish the session, which needs a workaround for iOS:

```lua
function window_callback(self, event, data)
    if event == window.WINDOW_EVENT_FOCUS_GAINED then
        -- iOS workaround to re-active WebSocket connection after phone is unlocked
        room:send("whatever")
    end
end

window.set_listener(window_callback)
```
