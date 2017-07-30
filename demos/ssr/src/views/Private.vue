<template lang="pug">
	.view--Private
		template(v-if="$auth && $auth.check()")
			h1 This view is private and only visible if you are logged in
			p  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus, eum facilis ad, in minima officia quis porro accusamus rerum, inventore ipsum tempora, adipisci sapiente pariatur asperiores voluptatem harum voluptas nam.
		template(v-if="!$auth || !$auth.check()")
			h1 Loading auth
</template>

<script>
export default {
	name: "Private",
	meta() {
		return {
			title: "Private",
			description: "This is the meta description for the private page"
		}
	}
}
</script>
