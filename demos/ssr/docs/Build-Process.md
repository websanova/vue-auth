# Build Process

The build process is carried out by [webpack](https://webpack.js.org/)

There are two build process, one for the client and one for the server.

You can start the build process with `npm/yarn run build`. You can also run only the client or the server build process with `yarn run build:client`, `yarn run build:server`.

## Build Variables

Specify the `BUILD_LANGUAGE` environment variable (two letter language code defined in `config.js`) to build the project for a different language, by default `BUILD_LANGUAGE` is `en`.

`BUILD_LANGUAGE=it yarn run build`

## Exploring the build process

### Common build process

* Source javascript files get linted
* Source javascript files get transpiled to browser-compatible javascript via [babel](https://babeljs.io/)
* Vue components get compiled via [vue-loader](https://github.com/vuejs/vue-loader)
* Resources such as images get included in source files if they are small enough, otherwise they are copied to the `dist/` folder by [file-loader](https://github.com/webpack-contrib/file-loader)
* Style gets linted via [stylelint](https://stylelint.io/)
* [Localization](Localization.md) is carried out for HTML/pug templates

### Client build process

* Everything in the common build process
* A Service Worker is generated for caching and offline support
* The main bundle (`app.js`) gets split in three parts, `vendor.js` for dependencies, `manifest.js` for Webpack-related code, and `app.js` only for the code we wrote. This will allow you to change the app code without the need for the user to redownload all the external depedencies again, which is what would happen if you had a single bundle.
* Javascript gets uglified and minified
* An index.html file is built

### Server build process

* Everything in the common build process
* Some files needed for SSR are created
