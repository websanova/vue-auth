import Vue from "vue"
import "es6-promise/auto"
import { createApp } from "./app"

import axios from "axios"
import VueAxios from "vue-axios"
Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = 'https://api-demo.websanova.com/api/v1'

// a global mixin that calls `asyncData` when a route component's params change
Vue.mixin({
	beforeRouteUpdate(to, from, next) {
		const { asyncData } = this.$options
		if (asyncData) {
			asyncData({
				store: this.$store,
				route: to
			}).then(next).catch(next)
		} else {
			next()
		}
	}
})

const { app, router, store } = createApp()

Vue.router = router
import VueAuth from "../../../src/index.js"
Vue.use(VueAuth, {
	auth: require("../../../drivers/auth/bearer.js"),
	http: require("../../../drivers/http/axios.1.x.js"),
	router: require("../../../drivers/router/vue-router.2.x.js")
})

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (window.__INITIAL_STATE__) {
	store.replaceState(window.__INITIAL_STATE__)
}

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
	// Add router hook for handling asyncData.
	// Doing it after initial route is resolved so that we don't double-fetch
	// the data that we already have. Using router.beforeResolve() so that all
	// async components are resolved.
	router.beforeResolve((to, from, next) => {
		const matched = router.getMatchedComponents(to)
		const prevMatched = router.getMatchedComponents(from)
		let diffed = false

		if (store.state.error) store.commit("CLEAR_ERROR")

		const activated = matched.filter((component, i) => {
			return diffed || (diffed = (prevMatched[i] !== component))
		})
		if (!activated.length) {
			return next()
		}
		Promise.all(activated.map((c) => {
			if (c.asyncData) {
				return c.asyncData({ store, route: to })
			}
		})).then(() => {
			next()
		}).catch(next)
	})

	// actually mount to DOM
	app.$mount("#app")
})
