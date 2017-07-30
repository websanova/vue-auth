# Error Handling (& HTTP Status Codes)

## Error Handling

This project comes with [a mixin](../src/mixins/errorHandler.js) to help you handle and manage errors (mostly errors generated during the `asyncData` part of the code).


First of all you have to import the mixin and mount it in your component.

```javascript
import ErrorHandler from "mixins/errorHandler"

// Your component declaration
export default {
	// ...
	mixins: [ErrorHandler]
	// ...
}
```

Then you have to catch the error, and, after you catched the error, commit the mutation `SET_ERROR`, passing the error as a parameter

```javascript
asyncData({ store }) {
	return store.dispatch("LOAD_PAGE")
		.catch((error) => {
			return store.commit("SET_ERROR", { error: error.message })
		})
}
```

This will make the error available in the `this.error` variable, allowing you to render it on the page:


```pug
// display the error
div(v-if="error")
	br
	b Error
	p {{ error }}
```

You can combine this behavior with the next section to achieve the best results

## HTTP Status Codes

Sometimes when rendering the page you might want to return a different HTTP status code (because for example it is a 404 page or because the data you requested in the `asyncData` hook was not available).

This is pretty simple.

In the [meta() function](Meta-Tags.md) you can add an `httpStatusCode` field, giving it the value you want to be sent to the browser requesting the page.

Remember, the `meta()` function has access to `data` and `computed` values, so you can vary the status code according to the value of variables.

For example this `meta()` function will return 200 when `this.varValue` is set, 404 otherwise:

```javascript
meta() {
		return {
			title: this.varValue || "No var",
			description: "This is the meta description for the page",
			httpStatusCode: this.varValue ? 200 : 404
		}
	}
```

