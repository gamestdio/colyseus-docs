# Server API &raquo; Presence

When you need to scale your server on multiple processes and/or machines, you'd need to provide the [`Presence`](/server/api/#optionspresence) option to the `Server`. The purpose of `Presence` is to allow communicating and sharing data between different processes, specially during match-making.

- [`LocalPresence`](#localpresence) (default)
- [`RedisPresence`](#redispresence-clientopts)

The `presence` instance is also available on every `Room` handler. You may use its [API](#api) to persist data and communicate between rooms via PUB/SUB.

### `LocalPresence`

This is the default option. It's meant to be used when you're running Colyseus in a single process.

### `RedisPresence (clientOpts?)`

Use this option when you're running Colyseus on multiple processes and/or machines.

**Parameters:**

- `clientOpts`: The redis client options (host/credentials). [See full list of options](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/redis/index.d.ts#L28-L52).

```typescript fct_label="TypeScript"
import { Server, RedisPresence } from "colyseus";

// This happens on the slave processes.
const gameServer = new Server({
    // ...
    presence: new RedisPresence()
});

gameServer.listen(2567);
```

```typescript fct_label="JavaScript"
const colyseus = require('colyseus');

// This happens on the slave processes.
const gameServer = new colyseus.Server({
    // ...
    presence: new colyseus.RedisPresence()
});

gameServer.listen(2567);
```

## API

The `Presence` API is highly based on Redis's API, which is a key-value database.

Every [`Room`](/server/room) instance has a [`presence`](/server/room/#presence-presence) property, which implements the following methods:

### `subscribe(topic: string, callback: Function)`

Subscribes to the given `topic`. The `callback` will be triggered whenever a message is [published](#publishtopic-string-data-any) on `topic`.

### `unsubscribe(topic: string)`

Unsubscribe from given `topic`.

### `publish(topic: string, data: any)`

Posts a message to given `topic`.

### `exists(key: string): Promise<boolean>`

Returns if key exists.

### `setex(key: string, value: string, seconds: number)`

Set key to hold the string value and set key to timeout after a given number of seconds.

### `get(key: string)`

Get the value of key.

### `del(key: string): void`

Removes the specified key.

### `sadd(key: string, value: any)`

Add the specified members to the set stored at key. Specified members that are already a member of this set are ignored. If key does not exist, a new set is created before adding the specified members.

### `smembers(key: string)`

Returns all the members of the set value stored at key.

### `sismember(member: string)`

Returns if `member` is a member of the set stored at key

**Return value**

- `1` if the element is a member of the set.
- `0` if the element is not a member of the set, or if key does not exist.

### `srem(key: string, value: any)`

Remove the specified members from the set stored at key. Specified members that are not a member of this set are ignored. If key does not exist, it is treated as an empty set and this command returns 0.

### `scard(key: string)`

Returns the set cardinality (number of elements) of the set stored at key.

### `sinter(...keys: string[])`

Returns the members of the set resulting from the intersection of all the given sets.

### `hset(key: string, field: string, value: string)`

Sets field in the hash stored at key to value. If key does not exist, a new key holding a hash is created. If field already exists in the hash, it is overwritten.

### `hincrby(key: string, field: string, value: number)`

Increments the number stored at field in the hash stored at key by increment. If key does not exist, a new key holding a hash is created. If field does not exist the value is set to 0 before the operation is performed.

### `hget(key: string, field: string): Promise<string>`

Returns the value associated with field in the hash stored at key.

### `hgetall(key: string): Promise<{[field: string]: string}>`

Returns all fields and values of the hash stored at key.

### `hdel(key: string, field: string)`

Removes the specified fields from the hash stored at key. Specified fields that do not exist within this hash are ignored. If key does not exist, it is treated as an empty hash and this command returns 0.

### `hlen(key: string): Promise<number>`

Returns the number of fields contained in the hash stored at key

### `incr(key: string)`

Increments the number stored at key by one. If the key does not exist, it is set to 0 before performing the operation. An error is returned if the key contains a value of the wrong type or contains a string that can not be represented as integer. This operation is limited to 64 bit signed integers.

### `decr(key: string)`

Decrements the number stored at key by one. If the key does not exist, it is set to 0 before performing the operation. An error is returned if the key contains a value of the wrong type or contains a string that can not be represented as integer. This operation is limited to 64 bit signed integers.
