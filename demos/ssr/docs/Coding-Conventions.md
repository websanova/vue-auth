# Coding Conventions

Most of the coding convetions are covered by linters: you will get errors at compile time if something is wrong.

We are using [ESLint](http://eslint.org/) for linting Javascript and [stylelint](https://stylelint.io/) for linting CSS/Sass.

Indentation and other whitespace-related conventions are taken care by the `.editorconfig` file. Please setup your text editor to support [EditorConfig](http://editorconfig.org/). All [major editors](http://editorconfig.org/#download) are supporting EditorConfig either natively or via a plugin.

Yes, we use **tabs over spaces**. This is because with tabs, everyone can choose the width of the tab in their text editor and because tabs are meant for indentation.

## HTML and CSS

### Classes and Identifiers

* We are trying to follow [BEM naming conventions](http://getbem.com/naming/).
* Avoid identifiers (`id="..."`).
	* The only `id` permitted right now is `#app` for the mounting point of the webapp
* Views should have a `view--ViewName` class in their root tag.
* Components should have a `ComponentName` class in their root tag.

### Components

* If a tag (and its children) is repeating more than once it should be a separate component
* If a tag (and its children) is meaningful on its own it should be a separate component
* Anything else: [Components on vuejs.org](https://vuejs.org/v2/guide/components.html)

## Javascript

We use ES6 features. We are using [babel](https://babeljs.io/) to transpile to browser-supported Javascript.

We make large use of `Promise`s, arrow functions, string templating and functional directives (`map`, `filter`, ...)

A quick overview is available over at [lukehoban/es6features](https://github.com/lukehoban/es6features).
