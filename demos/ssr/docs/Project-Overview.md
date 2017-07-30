# Project Overview

## Technological stack

**Frontend**

* [Vue.js](https://vuejs.org/)
	* [ES6 Javascript](http://es6-features.org)
	* Routing with [vue-router](https://router.vuejs.org/en/)
	* Store with [vuex](https://vuex.vuejs.org/en/)
	* Fetching data with [axios](https://github.com/mzabriskie/axios)
* [Pug](https://pugjs.org/)
	* For less verbose and easier to read components
* [Sass](http://sass-lang.com/)
	* Scss variant
	* For easier to read styles and also variables and mixins

**Backend**

* Node
	* [Express](https://expressjs.com/)
		* Configured to work with [Vue Server Side Rendering](https://ssr.vuejs.org/en/)

**Build process**

The building process is carried out by [webpack](https://webpack.js.org/).

There are two sequential build processes, the first is for the *client* and the second is for the *server*.

During the build process all the relevant files will be passed to various linters to check for coding conventions.

For detailed explaination check out the [Build Process](Build-Process.md) documentation page.

## Project Structure

* `/`
	* `build/`, Webpack build configs
		* `webpack.base.config.js`, the build config used both for the client and for the server
		* `webpack.client.config.js`, extends the base config to implement customizations strictly related to the client
		* `webpack.server.config.js`, same as the client one but for the server
	* `docs/`, documentation about the project
	* `i18n/`, localization files
	* `src/`, source file for the project
		* `components/`, reusable Vue UI components
		* `images/`, images used by the application
			* These will be processed by webpack's `url-loader`
		* `router/`, Vue-router specific files
		* `store/`, Vuex specific files
		* `styles/`, global style declarations
		* `utils/`, utility functions and Vue mixins
		* `views/`, Vue components that define the layout of the app
		* `App.vue`, the main/entry-point component
		* `app.js`, the script that initializes the whole App
		* `entry-client.js`, bootstrap script executed by the client only
		* `entry-server.js`, bootstrap script executed by the server only, used in SSR
	* `static/`, static files to be served as is
		* Don't put images required by components here
	* `tests/`
		* `e2e/specs/`, Nightwatch end-to-end tests
	* `dist/`, contains built files
	* `config.js`, configuration file for building the project
	* `server.js`, a standard Express server configured for SSR
