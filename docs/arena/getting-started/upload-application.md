# Web Interface

### Requirements

* [Created](../create-application/) an Arena application deployment.

## Upload Your Code
At the bottom left side of the Application dashboard select **Server Code** to access the integrated web IDE and Uploader. 

![Arena Application Management View](../../images/edit-server-code.jpg)

From this screen you can **CREATE**, **DELETE**, **UPLOAD** and **DEPLOY** code to your deployments game server fleet. Select **Upload** to open up the dialog, from here you can choose to upload a single file or upload a folder. 

![Arena Application Management View](../../images/upload-dialog.jpg)

!!! NOTE
    - Arena Applications **ONLY SUPPORTS** compiled Javascript code, if you are using TypeScript be sure to BUILD your code first and upload the content of the build folder.
    - If you used the ***NPM*** template to create your Colyseus server the ``` npm run build ``` command will compile and copy all required files into your output folder.
    - Build Output folder for TypeScript: ``` lib ``` / JavaScript: ``` upload ```

## Server Code Overview

After completing your upload you should see the following files and folder structure if you used the ``` npm run build ``` template. 

![Arena Code Template](../../images/code-template.jpg)

- **arena.config.js:** This file is where you should add your room declarations, express add-ons and any other functions you need called before server launch. Consider this as your ***index.js*** when deploying your application to Arena Cloud.

*File ```arena.config.js``` Example:*
```
const Arena = require("@colyseus/arena").default;
const { monitor } = require("@colyseus/monitor");

/**
 * Import your Room files
 */
const { ShootingGalleryRoom } = require("./rooms/ShootingGalleryRoom");

module.exports = Arena({
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('ShootingGalleryRoom', ShootingGalleryRoom);
    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         */
        app.get("/", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        /**
         * Bind @colyseus/monitor
         * It is recommended to protect this route with a password.
         * Read more: https://docs.colyseus.io/tools/monitor/
         */
        app.use("/colyseus", monitor());
    },

    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }

});
```
- **arena.env:** In this file you will define any custom environment variables that your application requires. This would be a good file to use to store keys that separate development and production environments.

*File ```arena.env``` Example:*
```
NODE_ENV=production
ABC_GAME_MODE=dev
```

 - **index.js** This file is NOT used when hosted on Arena Cloud. This file facilitates local development hosting or self-hosting. When using Arena Cloud, your *arena.config.js* is initialized by a modified version of Colyseus Open-Source designed for enterprise grade scalability and stability.

 - **package.json** The build command on the **NPM** template copies your existing package.json into the distribution folder. This file is used to install user defined modules at the launch of the game server.

- **.npmrc** *(optional)*: See [Using a Private NPM Repository](../../reference/npmrc-custom/)