import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

// We are also using Webpack code splitting here so that each route's associated
// component code is loaded on-demand only when the route is visited.
// When do you use on-demand load? When the view is not one of the important one. When a route is important? You decide
import Home from "views/Home" // include in the main bundle
import Private from "views/Private" // include in the main bundle

const NotFound = () => System.import("views/NotFound") // load dynamically when needed

let routes = [
    { path: "/", component: Home },
    { path: "/login", component: () => System.import("views/Login") },
    { path: "/private", component: Private, meta: { auth: true } }
]

// push as last element because the wildcard match will catch all the unknown urls
routes.push({ path: "*", component: NotFound })

export function createRouter() {
	return new Router({
		mode: "history",
		scrollBehavior: () => ({ y: 0 }),
		routes
	})
}
