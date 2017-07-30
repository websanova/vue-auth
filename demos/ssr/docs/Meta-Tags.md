# Meta Tags

It is possible to inject and edit at run time (both on the server and on the client) various meta tags, such as for changing the title of the page, the description and the keywords.

This is possible thanks to the [metaInfo mixin](../src/utils/metaInfo.mixin.js).

To specify meta tags information you have to define a `meta()` function in your component (or better, in your view), the `meta()` function should return an object containing the various meta-informations.

For example:

```javascript
meta() {
	return {
		title: "Home",
		description: "This is the meta description for the home page"
	}
}
```

This will set the `<title></title>` to `Home` and the `<meta name="description">` content's to `This is the meta description...`.

## Referencing variables

You can reference the instance variables in the meta informations, this mean that you could set the `title` to `this.myVariableTitle` where `this.myVariableTitle` is either a `computed` or a `data` variable.

## Supported meta informations

Currently only the title and the description are supported, but adding new tags is very trivial. Another field you can set is `httpStatusCode` (more on this in the [relevant doc entry](Error-Handling.md))

## Adding support for new meta informations

To add new meta informations we have to do a few simple things, add support for the variable on the server, on the client, specify the information inside the components and add default values.

In this example we are adding support for meta keywords.

**Server**

Open [index.template.html](../src/index.template.html), find the `head` and add `<meta name="keywords" content="{{ meta.keywords }}">`.

**Client**

Open the [metaInfo mixin](../src/utils/metaInfo.mixin.js), find the declaration of `clientMetaInfoMixin` and add inside the conditional check the JS needed to update the meta tag in the browser, in our case
```javascript
document.querySelector("meta[name=keywords]")
				.setAttribute("content", meta.keywords)
			```

**Components**

Finally we have to add the relevant informations to our components (or actually our views), find the meta() function declarations and add the `keywords` property to the object that would be returned.

**Defaults**

To specify default/fallback values you have to edit [server.js](../server.js) and find the relevant `context` variable and add the default values for your informations there.
