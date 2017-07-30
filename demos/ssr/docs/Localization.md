# Localization

Localization is implemented by the library [vue-i18n](https://kazupon.github.io/vue-i18n/en/). There are two kind of localization implemented in this project, static (or build-time localization) and dynamic (or runtime localization).

Specify the `BUILD_LANGUAGE` environment variable (two letter language code defined in `config.js`) to build the project for a different language, by default `BUILD_LANGUAGE` is `en`.

`BUILD_LANGUAGE=it yarn run build`

## Static localization

**Static localization** is localization applied to the templates at build time.

This kind of localization is done once (and directly on the source files) and does not need to be repeated for each request to the webapp. The resulting built files are already localized.

This kind of localization was implemented in the hope of slightly better performance (although we don't have benchmarks yet). Since it is basically *free* to implement both for the building process and for the programmer (and it does result in less work for the client) we decided to go with it.

## Dynamic localization

**Dynamic localization** is localization done at runtime (usually by the *client*). Think of this as the classic localization process. The localized strings get rendered for each request.

## To each his own

**When should I use dynamic localization?**

Basically as little as possible. Most of the strings can be localized at build time, even for some dynamic things like status-dependent messages (e.g. authentication-related strings). Use dynamic localization mostly for pluralizing strings (e.g. a message that displays the number of elements).

## How to localize

Right now localization works only on template (Pug/HTML) files.

### Static localization

Use the `$ts` (think of it as translate-static) directive.

Example:

```html
<p>$ts("key-name")</p>
```

Full documentation can be found at [this page](https://kazupon.github.io/vue-i18n/en/pluralization.html) (don't worry about the fact it is using `$tc`, `$ts` is just a in-house renamed version of `$tc` to make it work at compile time)

### Dynamic localization

Use the `$t` or `$tc` (think of it as translate and translate-counting) directives.

Since it is dynamic you have to use this inside Vue's double brackets.

Example:

```html
<p>{{ $ts("key-name") }}</p>
```

Full documentation available for both directives on [vue-i18n](https://kazupon.github.io/vue-i18n/en/)

## Localization files

Localization files are stored in the `/i18n` folder.

We are following [vue-i18n' syntax](https://kazupon.github.io/vue-i18n/en/syntax.html).

### Adding new languages

Open the file [config.js](../config.js) and define a new entry inside the `languages` object.
