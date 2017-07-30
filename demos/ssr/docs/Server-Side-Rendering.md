# Server Side Rendering

It is possible for components to define a `asyncData` hook that will be called server side when rendering the component. This hook should return a promise that will resolve once the component is ready to be rendered.

The interesting part in `entry-server.js`:

```javascript
// Call fetchData hooks on components matched by the route.
// A preFetch hook dispatches a store action and returns a Promise,
// which is resolved when the action is complete and store state has been
// updated.
Promise.all(matchedComponents.map((component) => {
	return component.asyncData && component.asyncData({
		store,
		route: router.currentRoute
	})
})).then(....)
```

The `asyncData` hook will get access to the vuex `store` object to allow the dispatching of vuex action and also to the `route` object to access route parameters.

## Use cases

* Fetching stateless data (page content)

## More

* Check out [the official documentation for SSR](https://ssr.vuejs.org/en/)
