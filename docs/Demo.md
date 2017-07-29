# Demo

To run the front end part of the demo just install and run. The demo runs on a publicly available server so just the front end needs run.

* Demo server available publicly at https://api-demo.websanova.com
* Demo server on GitHub https://github.com/websanova/laravel-api-demo
* Change the http options root in the `app.js` demo file to a different server for personal testing.

~~~
> npm install
> npm run 1.x.demo
> npm run 2.x.demo
~~~

Note: For Vue 2 demo there is a separate package.json. Unfortunately there is no really great way to run both at the same time.


If a different path is required it must be set in the `demo/app.js` file.

To run the build:

~~~
> webpack
~~~