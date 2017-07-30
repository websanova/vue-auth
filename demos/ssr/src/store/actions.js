import axios from "axios"

export const actions = {
	INCREMENT_COUNTER: ({ commit, state }) => {
		commit("SET_COUNTER", { value: (state.counter + 1) })
	},

	LOAD_REMOTE_PAGE: ({ commit, state }) => {
		return axios.get("https://jsonplaceholder.typicode.com/posts/1")
			.then((response) => {
				commit("SET_REMOTE_PAGE_CONTENT", { content: response.data.title })
			})
	},

	LOAD_PAGE_FAILING: ({ commit, state }) => {
		return axios.get("https://www.google.com/404")
	}
}
