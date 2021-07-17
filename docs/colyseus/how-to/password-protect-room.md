## Step 1: allow the matchmaker to identify the `"password"` field.

Define the `"password"` field inside the `filterBy()` method.

```typescript
gameServer
  .define("battle", BattleRoom)
  .filterBy(['password'])
```


## Step 2: make the room unlisted

If a password was provided for `create()` or `joinOrCreate()`, set the room listing as private:

```typescript
export class BattleRoom extends Room {

  onCreate(options) {
    if (options.password) {
      this.setPrivate();
    }
  }

}
```
