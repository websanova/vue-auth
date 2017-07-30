<template lang="pug">
	#app.App
		AuthCheck
		noscript Your browser does not have JS enabled, you are still able to browse the website but you won't be able to access advanced features such as editing or loggin-in.
		AppHeader
		transition(name="fade", mode="out-in")
			router-view.view
</template>

<style lang="scss">
@import "~styles/global";

noscript {
	display: block;
	padding: 1rem;
	background-color: red;
	color: white;
	font-size: 1.5rem;
}

.fade-enter-active,
.fade-leave-active {
	transition: all 0.2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
</style>

<script>
import AppHeader from "components/AppHeader"
import AuthCheck from "components/AuthCheck"

export default {
	name: "App",
	components: {
		AppHeader,
		AuthCheck
	}
}
</script>
