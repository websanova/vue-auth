// import Vue from "vue"

export const mutations = {
	SET_COUNTER(state, { value }) {
		state.counter = value
	},

	SET_REMOTE_PAGE_CONTENT(state, { content }) {
		state.remotePageContent = content
	},

	SET_ERROR(state, { error }) {
		if (typeof error !== Object) {
			state.error = error
		} else {
			state.error = Object.assign({}, error) // clone
		}
	},

	CLEAR_ERROR(state) {
		state.error = null
	}

}
