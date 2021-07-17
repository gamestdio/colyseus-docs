- [Inspector (`--inspect` flag)](#inspector)
- [Debug messages](#debug-messages)

## Inspector

You can use the the built-in inspector from Node.js to debug your application.

!!! Tip
    Read more about [Debugging Node.js Applications](https://nodejs.org/en/docs/inspector/).

### Using the inspector on production environment

Be careful when using the inspector on production. Using memory snapshots and breakpoints will impact the experience of your users directly.

*1.* Connect to the remote server:

```
ssh root@remote.example.com
```

*2.* Check the PID of the Node process

```
ps aux | grep node
```

*3.* Attach the inspector on the process

```
kill -usr1 PID
```

*4.* Create a SSH tunnel from your local machine to the remote inspector

```
ssh -L 9229:localhost:9229 root@remote.example.com
```

Your production server should now appear on [`chrome://inspect`](`chrome://inspect`).

## Debug messages

To enable all debug logs, run your server using the `DEBUG=colyseus:*` environment variable:

```
DEBUG=colyseus:* npm start
```

Alternatively, you can only enable to printing debug logs per category. 

### `colyseus:patch`

Logs the number of bytes and interval between patches broadcasted to all clients.

```
colyseus:patch "chat" (roomId: "ryWiL5rLTZ") is sending 28 bytes: +57ms
```

### `colyseus:errors`

Logs whenever unexpected (or expected, internally) errors happens on the server-side.

### `colyseus:matchmaking`

Logs whenever a room is spanwed or disposed.

```
colyseus:matchmaking spawning 'chat' on worker 77218 +52s
colyseus:matchmaking disposing 'chat' on worker 77218 +2s
```
