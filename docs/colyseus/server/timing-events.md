# Server API &raquo; Timing Events

For [timing events](https://www.w3.org/TR/2011/WD-html5-20110525/timers.html),
it's recommended to use the [`this.clock`](/server/room/#clock-clocktimer) methods,
from your `Room` instance.

!!! Tip
    All intervals and timeouts registered on
    [`this.clock`](/server/room/#clock-clocktimer) are cleared automatically when
    the `Room` is disposed.

!!! Warning "Important"
    The built-in
    [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)
    and
    [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval)
    methods rely on CPU load, which may delay an unexpected amount of time to execute.

## Clock

The clock is provided as a useful mechanism to time events outside of a stateful simulation. An example use case could be: when a player collects an item you might `clock.setTimeout` to create a new collectible. One advantage to using `clock.` is that you do not have to be concerned with room updates and deltas and can instead focus on timing your events independently of the room state.

### Public methods

*Note: `time` parameters are in milliseconds*

#### `clock.setInterval(callback, time, ...args): Delayed`

The `setInterval()` method repeatedly calls a function or executes a code
snippet, with a fixed time delay between each call. It returns
[`Delayed`](#delayed) instance which identifies the interval, so you can
manipulate it later.

#### `clock.setTimeout(callback, time, ...args): Delayed`

The `setTimeout()` method sets a timer which executes a function or specified
piece of code once after the timer expires. It returns [`Delayed`](#delayed)
instance which identifies the interval, so you can manipulate it later.

**Example**

This MVP example shows a Room with: `setInterval()`, `setTimeout` and clearing a previously stored instance of type `Delayed`; along with showing the currentTime from the Room's clock instance.
After 1 second 'Time now ' + `this.clock.currentTime` is `console.log`'d, and then after 10 seconds we clear the interval: `this.delayedInterval.clear();`.

```typescript fct_label="TypeScript"
// Import Delayed
import { Room, Client, Delayed } from "colyseus";

export class MyRoom extends Room {
    // For this example
    public delayedInterval!: Delayed;

    // When room is initialized
    onCreate(options: any) {
        // start the clock ticking
        this.clock.start();

        // Set an interval and store a reference to it
        // so that we may clear it later
        this.delayedInterval = this.clock.setInterval(() => {
            console.log("Time now " + this.clock.currentTime);
        }, 1000);

        // After 10 seconds clear the timeout;
        // this will *stop and destroy* the timeout completely
        this.clock.setTimeout(() => {
            this.delayedInterval.clear();
        }, 10_000);
    }
}
```

#### `clock.clear()`

Clear all intervals and timeouts registered with `clock.setInterval()` and `clock.setTimeout()`.

#### `clock.start()`

Start counting time.

#### `clock.stop()`

Stop counting time.

#### `clock.tick()`

This method is called automatically at every simulation interval step. All
`Delayed` instances are checked during `tick`.

!!! tip
    See [Room#setSimiulationInterval()](/server/room/#setsimulationinterval-callback-milliseconds166) for more details.

### Public properties

#### `clock.elapsedTime`

Elapsed time in milliseconds since [`clock.start()`](#clockstart) method was called. Read only.

#### `clock.currentTime`

Current time in milliseconds. Read only.

#### `clock.deltaTime`

The difference in milliseconds between the last and current `clock.tick()` call. Read only.

## Delayed

Delayed instances are created from
[`clock.setInterval()`](#clocksetintervalcallback-time-args-delayed) or
[`clock.setTimeout()`](#clocksettimeoutcallback-time-args-delayed) methods.

### Public methods

#### `delayed.pause()`

Pause the time of a particular `Delayed` instance. (`elapsedTime` is not going to increase until `.resume()` is called.)

#### `delayed.resume()`

Resumes the time of a particular `Delayed` instance. (`elapsedTime` is going to continue to increase normally)

#### `delayed.clear()`

Clears the timeout or interval.

#### `delayed.reset()`

Reset the elapsed time.

### Public properties

#### `delayed.elapsedTime: number`

Elapsed time of the `Delayed` instance, in milliseconds since started.

#### `delayed.active: boolean`

Returns `true` if timer is still running.

#### `delayed.paused: boolean`

Returns `true` if timer has been paused via `.pause()`.


