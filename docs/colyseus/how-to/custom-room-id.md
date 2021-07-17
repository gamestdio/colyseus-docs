You can override how you set the room ID for a new room.

To ensure we don't accidentally use the same room ID twice, we use the presence API, like this:

1. Get room ID already registered with the Presence API.
2. Generate room IDs until you generate one that is not already used.
3. Register the new room ID with the Presence API.

Step 2 here will most likely take only a single iteration, even with millions of rooms, with a 4 letter room ID. Using the Presence API in this way also has the advantage of getting you part of the way to running your server on multiple machines (by switching to the [RedisPresence](https://docs.colyseus.io/server/presence/#redispresence-clientopts)).

See the code below:

```typescript
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class MyRoom extends Room<MyRoomState> {
    // The channel where we register the room IDs.
    // This can be anything you want, it doesn't have to be `$mylobby`.
    LOBBY_CHANNEL = "$mylobby"

    // Generate a single 4 capital letter room ID.
    generateRoomIdSingle(): string {
        let result = '';
        for (var i = 0; i < 4; i++) {
            result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
        }
        return result;
    }

    // 1. Get room IDs already registered with the Presence API.
    // 2. Generate room IDs until you generate one that is not already used.
    // 3. Register the new room ID with the Presence API.
    async generateRoomId(): Promise<string> {
        const currentIds = await this.presence.smembers(this.LOBBY_CHANNEL);
        let id;
        do {
            id = this.generateRoomIdSingle();
        } while (currentIds.includes(id));
        
        await this.presence.sadd(this.LOBBY_CHANNEL, this.roomId);
        return id;
    }

    // Set `this.roomId` to the newly generated and registered room ID.
    async onCreate(options: any) {
        this.roomId = await this.generateRoomId();
    }

    // Free up the roomId that this room used.
    async onDispose(options: any) {
        this.presence.srem(this.LOBBY_CHANNEL, this.roomId);
    }
}
```

**Warning**: There is a small race in this code where two onCreate calls could randomly generate the same code before either of them register it. This will result in two rooms having the same ID. This race is extremely unlikely however (with 1 million active rooms and true randomness, it'd still be 1 in 15 trillion).
