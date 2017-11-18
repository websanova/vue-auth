# Demos

To run the front end part of the demo just install and run. The demo runs on a publicly available server so just the front end needs run.

* Demo server available publicly at https://api-demo.websanova.com
* Demo server on GitHub https://github.com/websanova/laravel-api-demo
* Change the http options root in the `app.js` demo file to a different server for personal testing.

The demos are in separate folders to make it simpler to test standalone side by side.

```shell
> cd vue-auth
> npm install
> cd vue-auth/demos/2.x
> npm install
> npm run demo

https://192.168.10.10:8002
```

```shell
> cd vue-auth
> npm install
> cd vue-auth/demos/1.x
> npm install
> npm run demo

https://192.168.10.10:8001
```

```shell
> cd vue-auth
> npm install
> cd vue-auth/demos/ssr
> npm install
> npm run demo

https://192.168.10.10:8003
```

**Note:** By default the config for the demos is assuming that it's running on a virtual box on host `0.0.0.0`.

To connect to the demos you would connect to that boxes IP address followed by the port.


## Changing Local Path of Demo App

The `npm run demo` is just a short cut to a command in the `scripts` section of the `package.json`.

```json
"scripts": {
    "demo": "webpack-dev-server --https --host=0.0.0.0 --port=8002"
  }
```

This command can be run directly with whatever parameters are required locally.