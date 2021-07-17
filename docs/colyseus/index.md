# Welcome to Colyseus

!!! tip "Important Notices"
    - Documentation is currently being updated and improved.
    - Translation of the documentation is in progress.
    - [0.13 & Older Docs can be found here](https://0-13-x.docs.colyseus.io/)



## Getting started

Before we start, let's make sure we have the necessary system requirements installed in your local machine.

**Requirements**:

- [Download and install Node.js](https://nodejs.org/) v12.0 or higher
- [Download and install Git SCM](https://git-scm.com/downloads)
- [Download and install Visual Studio Code](https://code.visualstudio.com/) (or other editor of your choice)

### Creating a barebones Colyseus server

Use the `npm init colyseus-app` command to generate a barebones Colyseus server. You may select between TypeScript (recommended), JavaScript or Haxe as your language of choice for the server.

```
npm init colyseus-app ./my-colyseus-app
```

### From the official examples

Alternatively, you can check some examples in action by cloning the [examples project](https://github.com/colyseus/colyseus-examples) and running it locally.

```
git clone https://github.com/colyseus/colyseus-examples.git
cd colyseus-examples
npm install
```

To run the server locally, run `npm start`, then open [http://localhost:2567](http://localhost:2567) to explore each example.

### Presentation: Overview of how Colyseus works

<center>
  <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vSjJtmU-SIkng_bFQ5z1000M6nPSoAoQL54j0Y_Cbg7R5tRe9FXLKaBmcKbY_iyEpnMqQGDjx_335QJ/embed?start=false&loop=false&delayms=3000" frameborder="0" width="680" height="411" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</center>
