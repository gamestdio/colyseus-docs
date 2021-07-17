# [State Synchronization](/state/overview) &raquo; Schema

!!! Tip "Not using TypeScript yet?"
    It is highly recommended that you use TypeScript to have a better experience defining the schemas structures, and for your development experience in general. TypeScript supports the "experimental decorators" that is heavily used on this section.

## How to define synchronizable structures

- `Schema` structures are defined the server-side to be used in the room state. 
- Only fields decorated with `@type()` are going to be considered for synchronization. 
- _(Synchronizable schema structures should only be used for data related to your state.)_

### Defining a `Schema` structure

```typescript fct_label="TypeScript"
// MyState.ts
import { Schema, type } from "@colyseus/schema";

export class MyState extends Schema {
    @type("string") currentTurn: string;
}
```

```typescript fct_label="JavaScript"
// MyState.ts
const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class MyState extends Schema {
}
schema.defineTypes(MyState, {
  currentTurn: "string"
});
```

!!! Tip "_"What is this `@type()` keyword? I've never seen this before!"_"
    The `@type()` you see heavily used on this page is an upcoming JavaScript feature that is yet to be formally established by TC39. `type` is actually just a function imported from `@colyseus/schema` module. By calling `type` with the `@` prefix at the property level means we're calling it as a _property decorator_. [See the decorators proposal here](https://github.com/tc39/proposal-decorators). 

### Using the state within your `Room`

```typescript
// MyRoom.ts
import { Room } from "colyseus";
import { MyState } from "./MyState";

export class MyRoom extends Room<MyState> {
    onCreate() {
        this.setState(new MyState());
    }
}
```


## Working with schemas

- Only the server-side is responsible for mutating schema structures
- The client-side must have the same `Schema` definitions generated through [`schema-codegen`](#client-side-schema-generation). _(Optional if you're using the [JavaScript SDK](/getting-started/javascript-client/))_
- In order to get updates from the server, you need to [attach callbacks on schema instances in the client-side](#callbacks).
- The client-side should never perform mutations on schema - as they are going to be replaced as soon as the next change come from the server.

### Primitive types

Primitive types are numbers, strings and boolean. 

| Type | Description | Limitation |
|------|-------------|------------|
| `"string"` | utf8 strings | maximum byte size of `4294967295` |
| `"number"` | also known as "varint". Auto-detects the number type to use. (may use one extra byte when encoding) | `0` to `18446744073709551615` |
| `"boolean"` | `true` or `false` | `0` or `1` |

**Specialized number types:**

| Type | Description | Limitation |
|------|-------------|------------|
| `"int8"` | signed 8-bit integer | `-128` to `127` |
| `"uint8"` | unsigned 8-bit integer | `0` to `255` |
| `"int16"` | signed 16-bit integer | `-32768` to `32767` |
| `"uint16"` | unsigned 16-bit integer | `0` to `65535` |
| `"int32"` | signed 32-bit integer | `-2147483648` to `2147483647` |
| `"uint32"` | unsigned 32-bit integer | `0` to `4294967295` |
| `"int64"` | signed 64-bit integer | `-9223372036854775808` to `9223372036854775807` |
| `"uint64"` | unsigned 64-bit integer | `0` to `18446744073709551615` |
| `"float32"` | single-precision floating-point number | `-3.40282347e+38` to `3.40282347e+38`|
| `"float64"` | double-precision floating-point number | `-1.7976931348623157e+308` to `1.7976931348623157e+308` |


### Complex types

Complex types consist of `Schema` instances within other schema instances. They can also contain [collections of items](#collections-of-items) (array, map, etc.).

```typescript fct_label="TypeScript"
import { Schema, type } from "@colyseus/schema";

class World extends Schema {
    @type("number") width: number;
    @type("number") height: number;
    @type("number") items: number = 10;
}

class MyState extends Schema {
    @type(World) world: World = new World();
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class World extends Schema {
}
schema.defineTypes(World, {
  width: "number",
  height: "number",
  items: "number"
});

class MyState extends Schema {
    constructor () {
        super();

        this.world = new World();
    }
}
schema.defineTypes(MyState, {
  world: World
});
```

## Collections of items

### ArraySchema

The `ArraySchema` is a synchronizeable version of the built-in JavaScript [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) type.

**Example: Array of custom `Schema` type**

```typescript fct_label="TypeScript"
import { Schema, ArraySchema, type } from "@colyseus/schema";

class Block extends Schema {
    @type("number") x: number;
    @type("number") y: number;
}

class MyState extends Schema {
    @type([ Block ]) blocks = new ArraySchema<Block>();
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const ArraySchema = schema.ArraySchema;

class Block extends Schema {
}
schema.defineTypes(Block, {
  x: "number",
  y: "number"
});

class MyState extends Schema {
    constructor () {
        super();

        this.blocks = new ArraySchema();
    }
}
schema.defineTypes(MyState, {
  blocks: [ Block ],
});
```

**Example: Array of a primitive type**

You can't mix types inside arrays.

```typescript fct_label="TypeScript"
import { Schema, ArraySchema, type } from "@colyseus/schema";

class MyState extends Schema {
    @type([ "string" ]) animals = new ArraySchema<string>();
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const ArraySchema = schema.ArraySchema;

class MyState extends Schema {
    constructor () {
        super();

        this.animals = new ArraySchema();
    }
}
schema.defineTypes(MyState, {
  animals: [ "string" ],
});
```

---

#### `array.push()`

Adds one or more elements to the end of an array and returns the new length of the array.

```typescript
const animals = new ArraySchema<string>();
animals.push("pigs", "goats");
animals.push("sheeps");
animals.push("cows");
// output: 4
```

---

#### `array.pop()`

Removes the last element from an array and returns that element. This method changes the length of the array.

```typescript
animals.pop();
// output: "cows"

animals.length
// output: 3
```

---

#### `array.shift()`

Removes the first element from an array and returns that removed element. This method changes the length of the array.

```typescript
animals.shift();
// output: "pigs"

animals.length
// output: 2
```

---

#### `array.unshift()`

Adds one or more elements to the beginning of an array and returns the new length of the array.

```typescript
animals.unshift("pigeon");
// output: 3
```

---

#### `array.indexOf()`

Returns the first index at which a given element can be found in the array, or -1 if it is not present

```typescript
const itemIndex = animals.indexOf("sheeps");
```

---

#### `array.splice()`

Changes the contents of an array by removing or replacing existing elements and/or adding new elements [in place](https://en.wikipedia.org/wiki/In-place_algorithm).

```typescript
// find the index of the item you'd like to remove
const itemIndex = animals.findIndex((animal) => animal === "sheeps");

// remove it!
animals.splice(itemIndex, 1);
```

---

#### `array.forEach()`

Iterates over each element of the array.

```typescript fct_label="TypeScript"
this.state.array1 = new ArraySchema<string>('a', 'b', 'c');

this.state.array1.forEach(element => {
    console.log(element);
});
// output: "a"
// output: "b"
// output: "c"
```

```csharp fct_label="C#"
State.array1.ForEach((value) => {
    Debug.Log(value);
})
```

```lua fct_label="LUA"
state.array1:each(function(value, index)
    print(index, "=>")
    pprint(value)
end)
```

```lua fct_label="Haxe"
for (index => value in state.array1) {
    trace(index + " => " + value);
}
```

!!! Note "More methods available for Array"
    Have a look at the [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/).

### MapSchema

The `MapSchema` is a synchronizeable version of the built-in JavaScript [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) type.

Maps are recommended to track your game entities by id, such as players, enemies, etc.

!!! Warning "Only string keys are supported at the moment"
    Currently, the `MapSchema` only allows you to customize the value type. The key type is always `string`.

```typescript fct_label="TypeScript"
import { Schema, MapSchema, type } from "@colyseus/schema";

class Player extends Schema {
    @type("number") x: number;
    @type("number") y: number;
}

class MyState extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

class Player extends Schema {
}
schema.defineTypes(Player, {
  x: "number",
  y: "number"
});

class MyState extends Schema {
    constructor () {
        super();

        this.players = new MapSchema();
    }
}
schema.defineTypes(MyState, {
  players: { map: Player }
});
```

---

#### `map.get()`

Getting a map item by its key:

```typescript
const map = new MapSchema<string>();
const item = map.get("key");
```

OR

```typescript
//
// NOT RECOMMENDED
//
// This is a compatibility layer with previous versions of @colyseus/schema
// This is going to be deprecated in the future.
//
const item = map["key"];
```

---

#### `map.set()`

Setting a map item by key:

```typescript
const map = new MapSchema<string>();
map.set("key", "value");
```

OR

```typescript
//
// NOT RECOMMENDED
//
// This is a compatibility layer with previous versions of @colyseus/schema
// This is going to be deprecated in the future.
//
map["key"] = "value";
```

---

#### `map.delete()`

Removes a map item by key:

```typescript
map.delete("key");
```

OR

```typescript
//
// NOT RECOMMENDED
//
// This is a compatibility layer with previous versions of @colyseus/schema
// This is going to be deprecated in the future.
//
delete map["key"];
```

---

#### `map.size`

Return the number of elements in a `MapSchema` object.

```typescript
const map = new MapSchema<number>();
map.set("one", 1);
map.set("two", 2);

console.log(map.size);
// output: 2
```

---

#### `map.forEach()`

Iterates over each key/value pair of the map, in insertion order.

```typescript fct_label="TypeScript"
this.state.players.forEach((value, key) => {
    console.log("key =>", key)
    console.log("value =>", value)
});
```

```csharp fct_label="C#"
State.players.ForEach((key, value) => {
    Debug.Log(key);
    Debug.Log(value);
})
```

```lua fct_label="LUA"
state.players:each(function(value, key)
    print(key, "=>")
    pprint(value)
end)
```

```lua fct_label="Haxe"
for (key => value in state.players) {
    trace(index + " => " + value);
}
```

!!! Note "More methods available for Map"
     Have a look at the [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/).


### SetSchema

!!! Warning "`SetSchema` is only implemented in JavaScript"
    The `SetSchema` can only be used with JavaScript so far. Haxe, C#, LUA and C++ clients are not supported yet.

The `SetSchema` is a synchronizeable version of the built-in JavaScript [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) type.

The usage of `SetSchema` is very similar to [`CollectionSchema`], the biggest difference is that Sets hold unique values. Sets do not have a way to access a value directly. (like [collection.at()](#collectionat))

```typescript fct_label="TypeScript"
import { Schema, SetSchema, type } from "@colyseus/schema";

class Effect extends Schema {
    @type("number") radius: number;
}

class Player extends Schema {
    @type({ set: Effect }) effects = new SetSchema<Effect>();
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const SetSchema = schema.SetSchema;

class Effect extends Schema {
}
schema.defineTypes(Effect, {
  radius: "number",
});

class Player extends Schema {
    constructor () {
        super();

        this.effects = new SetSchema();
    }
}
schema.defineTypes(Player, {
  effects: { set: Effect }
});
```

---

#### `set.add()`

Appends an item to the `SetSchema` object.

```typescript
const set = new CollectionSchema<number>();
set.add(1);
set.add(2);
set.add(3);
```

---

#### `set.at()`

Gets an item at the specified `index`.

```typescript
const set = new CollectionSchema<string>();
set.add("one");
set.add("two");
set.add("three");

set.at(1);
// output: "two"
```

---

#### `set.delete()`

Delete an item by its value.

```typescript
set.delete("three");
```

---

#### `set.has()`

Returns a boolean value wheter an item exists in the Collection or not.

```typescript
if (set.has("two")) {
    console.log("Exists!");
} else {
    console.log("Does not exist!");
}
```

---

#### `set.size`

Return the number of elements in a `SetSchema` object.

```typescript
const set = new SetSchema<number>();
set.add(10);
set.add(20);
set.add(30);

console.log(set.size);
// output: 3
```

!!! Note "More methods available for Set"
     Have a look at the [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/).


### CollectionSchema

!!! Warning "`CollectionSchema` is only implemented in JavaScript"
    The `CollectionSchema` can only be used with JavaScript so far. Haxe, C#, LUA and C++ clients are not supported yet.

The `CollectionSchema` works similarly as the `ArraySchema`, with the caveat that you don't have control over its indexes.

```typescript fct_label="TypeScript"
import { Schema, CollectionSchema, type } from "@colyseus/schema";

class Item extends Schema {
    @type("number") damage: number;
}

class Player extends Schema {
    @type({ collection: Item }) items = new CollectionSchema<Item>();
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const CollectionSchema = schema.CollectionSchema;

class Item extends Schema {
}
schema.defineTypes(Item, {
  damage: "number",
});

class Player extends Schema {
    constructor () {
        super();

        this.items = new CollectionSchema();
    }
}
schema.defineTypes(Player, {
  items: { collection: Item }
});
```

---

#### `collection.add()`

Appends an item to the `CollectionSchema` object.

```typescript
const collection = new CollectionSchema<number>();
collection.add(1);
collection.add(2);
collection.add(3);
```

---

#### `collection.at()`

Gets an item at the specified `index`.

```typescript
const collection = new CollectionSchema<string>();
collection.add("one");
collection.add("two");
collection.add("three");

collection.at(1);
// output: "two"
```

---

#### `collection.delete()`

Delete an item by its value.

```typescript
collection.delete("three");
```

---

#### `collection.has()`

Returns a boolean value wheter an item exists in the Collection or not.

```typescript
if (collection.has("two")) {
    console.log("Exists!");
} else {
    console.log("Does not exist!");
}
```

---

#### `collection.size`

Return the number of elements in a `CollectionSchema` object.

```typescript
const collection = new CollectionSchema<number>();
collection.add(10);
collection.add(20);
collection.add(30);

console.log(collection.size);
// output: 3
```

---

#### `collection.forEach()`

The `forEach()` method executes a provided function once per each index/value pair in the `CollectionSchema` object, in insertion order.

```typescript
collection.forEach((value, at) => {
    console.log("at =>", at)
    console.log("value =>", value)
});
```

## Filtering data per client

!!! Warning "This feature is experimental"
    The `@filter()`/`@filterChildren()` are experimental and may not be optimized for fast-paced games.

Filtering is meant to hide portions of your state for a particular client, to avoid cheating in case a player decides to inspect data coming from the network and seeing the unfiltered state information.

The data filters are callbacks that are going to be triggered **per client** and **per field** (or per child structure, in case of `@filterChildren`). If the filter callback returns `true` the field data is going to be sent for that particular client, otherwise, the data is not going to be sent for that client.

Note that the filter function does not re-run automatically if its dependencies change, but only if the filtered field (or its children) are updated.
See [this issue](https://github.com/colyseus/schema/issues/102) for a workaround.

### `@filter()` property decorator

The `@filter()` property decorator can be used to filter out entire Schema fields.

Here's how the `@filter()` signature looks like:

```typescript fct_label="TypeScript"
class State extends Schema {
    @filter(function(client, value, root) {
        // client is:
        //
        // the current client that's going to receive this data. you may use its
        // client.sessionId, or other information to decide whether this value is
        // going to be synched or not.

        // value is:
        // the value of the field @filter() is being applied to

        // root is:
        // the root instance of your room state. you may use it to access other
        // structures in the process of decision whether this value is going to be
        // synched or not.
    })
    @type("string") field: string;
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
class State extends schema.Schema {}

schema.defineTypes(State, {
    field: "string"
});

schema.filter(function(client, value, root) {
    // client is:
    //
    // the current client that's going to receive this data. you may use its
    // client.sessionId, or other information to decide whether this value is
    // going to be synched or not.

    // value is:
    // the value of the field @filter() is being applied to

    // root is:
    // the root instance of your room state. you may use it to access other
    // structures in the process of decision whether this value is going to be
    // synched or not.
    return true;
})(State.prototype, "field");
```

### `@filterChildren()` property decorator

The `@filterChildren()` property decorator can be used to filter out items inside arrays, maps, sets, etc. Its signature is pretty much the same as `@filter()`, with the addition of the `key` parameter before the `value` - representing each item inside a [ArraySchema](#arrayschema), [MapSchema](#mapschema), [CollectionSchema](#collectionschema), etc.

```typescript fct_label="TypeScript"
class State extends Schema {
    @filterChildren(function(client, key, value, root) {
        // client is:
        //
        // the current client that's going to receive this data. you may use its
        // client.sessionId, or other information to decide whether this value is
        // going to be synched or not.

        // key is:
        // the key of the current value inside the structure

        // value is:
        // the current value inside the structure

        // root is:
        // the root instance of your room state. you may use it to access other
        // structures in the process of decision whether this value is going to be
        // synched or not.
    })
    @type([Cards]) cards = new ArraySchema<Card>();
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
class State extends schema.Schema {}

schema.defineTypes(State, {
    cards: [Card]
});

schema.filterChildren(function(client, key, value, root) {
    // client is:
    //
    // the current client that's going to receive this data. you may use its
    // client.sessionId, or other information to decide whether this value is
    // going to be synched or not.

    // key is:
    // the key of the current value inside the structure

    // value is:
    // the current value inside the structure

    // root is:
    // the root instance of your room state. you may use it to access other
    // structures in the process of decision whether this value is going to be
    // synched or not.
    return true;
})(State.prototype, "cards");
```

**Example:** In a card game, the relevant data of each card should be available only for the owner of the card, or on certain conditions (e.g. card has been discarded)

See `@filter()` callback signature:

```typescript fct_label="TypeScript"
import { Client } from "colyseus";

class Card extends Schema {
    @type("string") owner: string; // contains the sessionId of Card owner
    @type("boolean") discarded: boolean = false;

    /**
     * DO NOT USE ARROW FUNCTION INSIDE `@filter`
     * (IT WILL FORCE A DIFFERENT `this` SCOPE)
     */
    @filter(function(
        this: Card, // the instance of the class `@filter` has been defined (instance of `Card`)
        client: Client, // the Room's `client` instance which this data is going to be filtered to
        value: Card['number'], // the value of the field to be filtered. (value of `number` field)
        root: Schema // the root state Schema instance
    ) {
        return this.discarded || this.owner === client.sessionId;
    })
    @type("uint8") number: number;
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');

class Card extends schema.Schema {}
schema.defineTypes(Card, {
    owner: "string",
    discarded: "boolean",
    number: "uint8"
});

/**
 * DO NOT USE ARROW FUNCTION INSIDE `@filter`
 * (IT WILL FORCE A DIFFERENT `this` SCOPE)
 */
schema.filter(function(client, value, root) {
    return this.discarded || this.owner === client.sessionId;
})(Card.prototype, "number");
```

## Client-side

!!! Warning "C#, C++, Haxe"
    When using statically typed languages, you need to generate the client-side schema files based on your TypeScript schema definitions. [See generating schema on the client-side](#client-side-schema-generation).

### Callbacks

When applying state changes coming from the server, the client-side is going to trigger callbacks on local instances according to the change being applied.

The callbacks are triggered based on instance reference. Make sure to attach the callback on the instances that are actually changing on the server.

- [onAdd (instance, key)](#onadd-instance-key)
- [onRemove (instance, key)](#onremove-instance-key)
- [onChange (changes)](#onchange-changes-datachange) (on `Schema` instance)
- [onChange (instance, key)](#onchange-instance-key) (on collections: `MapSchema`, `ArraySchema`, etc.)
- [listen()](#listenprop-callback)

#### `onAdd (instance, key)`

The `onAdd` callback can only be used in collection of items (`MapSchema`, `MapSchema`, etc.). The `onAdd` callback is called with the new instance and its key on holder object as argument.

```javascript fct_label="JavaScript"
room.state.players.onAdd = (player, key) => {
    console.log(player, "has been added at", key);

    // add your player entity to the game world!

    // If you want to track changes on a child object inside a map, this is a common pattern:
    player.onChange = function(changes) {
        changes.forEach(change => {
            console.log(change.field);
            console.log(change.value);
            console.log(change.previousValue);
        })
    };

    // force "onChange" to be called immediatelly
    player.triggerAll();
};
```

```lua fct_label="LUA"
room.state.players['on_add'] = function (player, key)
    print("player has been added at", key);

    -- add your player entity to the game world!

    -- If you want to track changes on a child object inside a map, this is a common pattern:
    player['on_change'] = function(changes)
        for i, change in ipairs(changes) do
            print(change.field)
            print(change.value)
            print(change.previousValue)
        end
    end

    -- force "on_change" to be called immediatelly
    player.trigger_all()
end
```

```csharp fct_label="C#"
room.State.players.OnAdd += (Player player, string key) =>
{
    Debug.Log("player has been added at " + key);

    // add your player entity to the game world!

    // If you want to track changes on a child object inside a map, this is a common pattern:
    player.OnChange += (changes) =>
    {
        changes.ForEach((obj) =>
        {
            Debug.Log(obj.Field);
            Debug.Log(obj.Value);
            Debug.Log(obj.PreviousValue);
        });
    };

    // force "OnChange" to be called immediatelly
    e.Value.TriggerAll();
};
```

---

#### `onRemove (instance, key)`

The `onRemove` callback can only be used in maps (`MapSchema`) and arrays (`ArraySchema`). The `onRemove` callback is called with the removed instance and its key on holder object as argument.

```javascript fct_label="JavaScript"
room.state.players.onRemove = (player, key) => {
    console.log(player, "has been removed at", key);

    // remove your player entity from the game world!
};
```

```lua fct_label="LUA"
room.state.players['on_remove'] = function (player, key)
    print("player has been removed at " .. key);

    -- remove your player entity from the game world!
end
```

```csharp fct_label="C#"
room.State.players.OnRemove += (Player player, string key) =>
{
    Debug.Log("player has been removed at " + key);

    // remove your player entity from the game world!
};
```

---

#### `onChange (changes: DataChange[])`

> `onChange` works differently for direct `Schema` references and collection structures. For [`onChange` on collection structures (array, map, etc.), check here](#onchange-instance-key).

You can register the `onChange` to track a `Schema` instance's property changes. The `onChange` callback is triggered with an array of changed properties, along with its previous values.

```javascript fct_label="JavaScript"
room.state.onChange = (changes) => {
    changes.forEach(change => {
        console.log(change.field);
        console.log(change.value);
        console.log(change.previousValue);
    });
};
```

```lua fct_label="LUA"
room.state['on_change'] = function (changes)
    for i, change in ipairs(changes) do
        print(change.field)
        print(change.value)
        print(change.previousValue)
    end
end
```

```csharp fct_label="C#"
room.State.OnChange += (changes) =>
{
    changes.ForEach((obj) =>
    {
        Debug.Log(obj.Field);
        Debug.Log(obj.Value);
        Debug.Log(obj.PreviousValue);
    });
};
```

You cannot register the `onChange` callback on objects that haven't been synchronized with the client-side yet.

---

#### `onChange (instance, key)`

> `onChange` works differently for direct `Schema` references and collection structures. For [`onChange` on `Schema` structures, check here](#onchange-changes-datachange).

This callback is triggered whenever a collection of **primitive** types (`string`, `number`, `boolean`, etc.) updates some of its values.

```javascript fct_label="JavaScript"
room.state.players.onChange = (player, key) => {
    console.log(player, "have changes at", key);
};
```

```lua fct_label="LUA"
room.state.players['on_change'] = function (player, key)
    print("player have changes at " .. key);
end
```

```csharp fct_label="C#"
room.State.players.OnChange += (Player player, string key) =>
{
    Debug.Log("player have changes at " + key);
};
```

If you'd like to detect changes inside a collection of **non-primitive** types (holding `Schema` instances),use [`onAdd`](#onadd-instance-key) and register [`onChange`](#onchange-changes-datachange) on them.

!!! Warning "`onChange`, `onAdd` and `onRemove` are **exclusive**"
    The `onChange` callback is not triggered during [`onAdd`](#onadd-instance-key) or [`onRemove`](#onremove-instance-key).

    Consider registering `onAdd` and `onRemove` if you need to detect changes during these steps too.

---

#### `.listen(prop, callback)`

Listens for a single property change. 

> `.listen()` is currently only available for JavaScript/TypeScript.

**Parameters:**

- `property`: the property name you'd like to listen for changes.
- `callback`: the callback that is going to be triggered when `property` changes.


```typescript
state.listen("currentTurn", (currentValue, previousValue) => {
    console.log(`currentTurn is now ${currentValue}`);
    console.log(`previous value was: ${previousValue}`);
});
```

The `.listen()` method returns a function that is meant to unregister the listener:


```typescript
const removeListener = state.listen("currentTurn", (currentValue, previousValue) => {
    // ...
});

// later on, if you don't need the listener anymore, you can call `removeListener()` to stop listening for `"currentTurn"` changes.
removeListener();
```

**What's the difference between `listen` and `onChange`?**

The `.listen()` method is a shorthand for `onChange` on a single property. Below is 

```typescript
state.onChange = function(changes) {
    changes.forEach((change) => {
        if (change.field === "currentTurn") {
            console.log(`currentTurn is now ${change.value}`);
            console.log(`previous value was: ${change.previousValue}`);
        }
    })
}
```

---

## Client-side schema generation

The `schema-codegen` is a tool that transpiles your server-side schema definition files to be used in the client-side:

To be able to decode the state in the client-side, its local schema definitions must be compatible with the schema definitions in the server.

!!! Warning "Not required when using [JavaScript SDK](/getting-started/javascript-client/)"
    Using `schema-codegen` is only required when using statically typed languages in the client-side, such as C#, Haxe, etc.

**Usage:**

To see the usage, From your terminal, `cd` into your server's directory and run the following command:

```
npx schema-codegen --help
```

**Output:**

```
schema-codegen [path/to/Schema.ts]

Usage (C#/Unity)
    schema-codegen src/Schema.ts --output client-side/ --csharp --namespace MyGame.Schema

Valid options:
    --output: fhe output directory for generated client-side schema files
    --csharp: generate for C#/Unity
    --cpp: generate for C++
    --haxe: generate for Haxe
    --ts: generate for TypeScript
    --js: generate for JavaScript
    --java: generate for Java

Optional:
    --namespace: generate namespace on output code
```

### Example: Unity / C# 

Below is a real example to generate the C# schema files from the [demo Unity project](https://github.com/colyseus/colyseus-unity3d/blob/aa9a722a50b2958ce01785969cd8ecb8aee24fd0/Server/package.json#L12).

```
npx schema-codegen src/rooms/schema/* --csharp --output ../Assets/Scripts/States/"
generated: Player.cs
generated: State.cs
```

**Using `npm` scripts:**

For short, it is recommended to have your `schema-codegen` arguments configured under a `npm` script in your `package.json`:
    
```json
"scripts": {
    "schema-codegen": "schema-codegen src/rooms/schema/* --csharp --output ../Assets/Scripts/States/"
}
```

This way you can run `npm run schema-codegen` rather than the full command:

```
npm run schema-codegen
generated: Player.cs
generated: State.cs
```

### Versioning and backwards/forwards compability

Backwards/fowards compatibility is possible by declaring new fields at the end of existing structures, and earlier declarations to not be removed, but be marked `@deprecated()` when needed. See a versioning example below.

```typescript fct_label="Live version 1"
import { Schema, type, deprecated } from "@colyseus/schema";

class MyState extends Schema {
    @type("string") myField: string;
}
```

```typescript fct_label="Live version 2"
import { Schema, type, deprecated } from "@colyseus/schema";

class MyState extends Schema {
    // Flag field as deprecated.
    @deprecated() @type("string") myField: string;

    // To allow your server to play nicely with multiple client-side versions.
    @type("string") newField: string; 
}
```

```typescript fct_label="Live version 3"
import { Schema, type, deprecated } from "@colyseus/schema";

class MyState extends Schema {
    // Flag field as deprecated.
    @deprecated() @type("string") myField: string;

    // Flag field as deprecated again.
    @deprecated() @type("string") newField: string; 

    // New fields always at the end of the structure
    @type("string") anotherNewField: string;
}
```

This is particularly useful for native-compiled targets, such as C#, C++, Haxe, etc - where the client-side can potentially not have the most up-to-date version of the schema definitions.

---

## Limitations and best practices

- Each `Schema` structure can hold up to `64` fields. If you need more fields, use nested `Schema` structures.
- `NaN` or `null` numbers are encoded as `0`
- `null` strings are encoded as `""`
- `Infinity` numbers are encoded as `Number.MAX_SAFE_INTEGER`
- Multi-dimensional arrays are not supported. [See how to use 1D arrays as multi-dimensional](https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid/212813#212813)
- `@colyseus/schema` encoding order is based on field definition order.
    - Both encoder (server) and decoder (client) must have same schema definition.
    - The order of the fields must be the same.

### Collections

Collection types (`ArraySchema`, `MapSchema`, etc) must hold items of the same type, or share the same base type.

**The following example is supported:**

```typescript
class Item extends Schema {/* base Item fields */}
class Weapon extends Item {/* specialized Weapon fields */}
class Shield extends Item {/* specialized Shield fields */}

class Inventory extends Schema {
    @type({ map: Item }) items = new MapSchema<Item>();
}

const inventory = new Inventory();
inventory.set("left", new Weapon());
inventory.set("right", new Shield());
```

### Primitive types

| Type | Description | Limitation |
|------|-------------|------------|
| `"string"` | utf8 strings | maximum byte size of `4294967295` |
| `"number"` | also known as "varint". Auto-detects the number type to use. (may use one extra byte when encoding) | `0` to `18446744073709551615` |
| `"boolean"` | `true` or `false` | `0` or `1` |
| `"int8"` | signed 8-bit integer | `-128` to `127` |
| `"uint8"` | unsigned 8-bit integer | `0` to `255` |
| `"int16"` | signed 16-bit integer | `-32768` to `32767` |
| `"uint16"` | unsigned 16-bit integer | `0` to `65535` |
| `"int32"` | signed 32-bit integer | `-2147483648` to `2147483647` |
| `"uint32"` | unsigned 32-bit integer | `0` to `4294967295` |
| `"int64"` | signed 64-bit integer | `-9223372036854775808` to `9223372036854775807` |
| `"uint64"` | unsigned 64-bit integer | `0` to `18446744073709551615` |
| `"float32"` | single-precision floating-point number | `-3.40282347e+38` to `3.40282347e+38`|
| `"float64"` | double-precision floating-point number | `-1.7976931348623157e+308` to `1.7976931348623157e+308` |