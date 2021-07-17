# Package.json / Folder Locations

## Package.json Usage

When deployed on Arena Cloud your package.json file is not fully used by your deployment. Arena Cloud copies the custom dependencies into a manage Arena package.json which is then installed at the launch your server. 

## Relative & Absolute Folder Locations

It is important to note that this json file is located at the root directory of your Arena Cloud server and not the root directory of your server code. If you are referencing a custom module from your package.json you will need to put its relative path based of the Arena Cloud server root.

The relative path of your uploaded server code is ```./app/server/arena/```.

The absolute path of your uploaded server code is  ```./colyseus/app/server/arena/```