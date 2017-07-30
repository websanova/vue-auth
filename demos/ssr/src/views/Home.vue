<template lang="pug">
    NoSrr
        main.view--Home
            h1 Home Page
            router-link(to="/private") Go to the private page (require login)
</template>

<script>
import NoSrr from "vue-no-ssr"

export default {
	name: "Home",
	components: { NoSrr },
	meta() {
		return {
			title: "Home",
			description: "This is the meta description for the home page"
		}
	}
}
</script>
