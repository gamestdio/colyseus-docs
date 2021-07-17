- [Deploying on Heroku](#heroku)
- [Deploying on Nginx (recommended)](#nginx-recommended)
- [Deploying on Apache](#apache)
- [Using greenlock-express](#greenlock-express)
- [Docker](#docker)

## Heroku

Heroku is recommended just for prototyping. You can deploy the [colyseus-examples](https://github.com/colyseus/colyseus-examples) project on it by hitting this button:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/colyseus/colyseus-examples)

**Important:** Make sure to set the environment variable `NPM_CONFIG_PRODUCTION=false` in order to use dev-dependencies in your deployment, such as `ts-node`, `ts-node-dev`, etc.

## Nginx (recommended)

It's recommended to use `pm2` and `nginx` in your production environment.

### PM2

Install `pm2` in your environment.

```
npm install -g pm2
```

Then start your server using it:

```
pm2 start your-server.js
```

### Nginx configuration

```
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:2567;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

### Nginx configuration with SSL

It's recommended to acquire your certificate from [LetsEncrypt](https://letsencrypt.org).

```
server {
    listen 80;
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /path/to/your/cert.crt;
    ssl_certificate_key /path/to/your/cert.key;

    location / {
        proxy_pass http://localhost:2567;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

## Apache

Here's how to use Apache as a proxy to your Node.js Colyseus app. (Thanks [tomkleine](https://github.com/tomkleine)!)

Install the required Apache modules:

```
sudo a2enmod ssl
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_html
sudo a2enmod proxy_wstunnel
```

Virtual host configuration:

```
<VirtualHost *:80>
    ServerName servername.xyz

    # Redirect all requests received from port 80 to the HTTPS variant (force ssl)
    RewriteEngine On
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]

</VirtualHost>

<VirtualHost *:443>
    ServerName servername.xyz

    # enable SSL
    SSLEngine On
    SSLCertificateFile          /PATH/TO/CERT/FILE
    SSLCertificateKeyFile       /PATH/TO/PRIVATE/KEY/FILE

    #
    # setup the proxy to forward websocket requests properly to a normal websocket
    # and vice versa, so there's no need to change the colyseus library or the
    # server for that matter)
    #
    # (note: this proxy automatically converts the secure websocket (wss)

    RewriteEngine On
    RewriteCond %{HTTP:UPGRADE} ^WebSocket$           [NC,OR]
    RewriteCond %{HTTP:CONNECTION} ^Upgrade$          [NC]
    RewriteRule .* ws://127.0.0.1:APP-PORT-HERE%{REQUEST_URI}  [P,QSA,L]

    # setup the proxy to forward all https requests to http backend
    # (also automatic conversion from https to http and vice versa)

    ProxyPass "/" "http://localhost:APP-PORT-HERE/"
    ProxyPassReverse "/" "http://localhost:APP-PORT-HERE/"

</VirtualHost>
```

## greenlock-express

Greenlock is a great tool if you want to quickly have SSL configured on your server, without the need to configure a reverse-proxy.

When using [`greenlock-express`](https://www.npmjs.com/package/greenlock-express), you should **not** have any reverse-proxy configured behind it, such as [Nginx](#nginx-recommended) or [Apache](#apache).

```
npm install --save greenlock-express
```

Please follow [greenlock-express's README section first](https://www.npmjs.com/package/greenlock-express#1-create-your-project).

Here's the recommended way to handle both development and production environments:

```typescript
import http from "http";
import express from "express";
import { Server } from "colyseus";

function setup(app: express.Application, server: http.Server) {
  const gameServer = new Server({ server });

  // TODO: configure `app` and `gameServer` accourding to your needs.
  // gameServer.define("room", YourRoom);

  return app;
}

if (process.env.NODE_ENV === "production") {
  require('greenlock-express')
    .init(function () {
      return {
        greenlock: require('./greenlock'),
        cluster: false
      };
    })
    .ready(function (glx) {
      const app = express();

      // Serves on 80 and 443
      // Get's SSL certificates magically!
      glx.serveApp(setup(app, glx.httpsServer(undefined, app)));
    });

} else {
  // development port
  const PORT = process.env.PORT || 2567;

  const app = express();
  const server = http.createServer(app);

  setup(app, server);
  server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}

```

## Docker

Prerequisite: 

* `package.json` and `package-lock.json` are in the project.

* Set up the `npm start` command so it starts the server
 
Steps:

**Step 1** Install [Docker](https://www.docker.com/)

**Step 2** Create `Dockerfile` in the root of the colyseus project
```dockerfile
FROM node:12

ENV PORT 8080

WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm ci
# run this for production
# npm ci --only=production

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
```
**Step 3** Create `.dockerignore` file in the same directory
```
node_modules
npm-debug.log
```
This will prevent your local modules and debug logs from being copied onto your Docker image and possibly overwriting modules installed within your image.

**Step 4** Go to the directory that has your Dockerfile and run the following command to build the Docker image. The -t flag lets you tag your image so it's easier to find later using the docker images command:

```
docker build -t <your username>/colyseus-server .
```

**Step 5** Your image will now be listed by Docker with following command:
```
docker images

```
Output: 
```
# Example
REPOSITORY                      TAG        ID              CREATED
node                            12         1934b0b038d1    About a minute ago
<your username>/colseus-server    latest     d64d3505b0d2    About a minute ago
```

**Step 6** Run the Docker Image wiht following command:
```
docker run -p 8080:8080 -d <your username>/colyseus-server
```
Running your image with -d runs the container in detached mode, leaving the container running in the background. The -p flag redirects a public port to a private port inside the container.


**Step 7** Done, now you can connect to the server with `localhost:8080`

More informations:

- [Official Node.js Docker Image](https://hub.docker.com/_/node/)

- [Node.js Docker Best Practices Guide](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)
