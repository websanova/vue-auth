<template lang="pug">
	header.AppHeader
		router-link.AppHeader__link(to="/")
			img.AppHeader__logo(src="~images/logo.png", alt="Logo")
			div.AppHeader__name
				h3.AppHeader__title Site Name
		NoSSR
			.SessionInfo
				p LoginStatus
				template(v-if="$auth")
					a(v-if="!$auth.check()") Not logged in
					a(v-if="$auth.check()") You are logged in
					button(@click=`$auth.login({
						data: {
							username: 'admin',
							password: 'secret'
						}
					})`) Login
</template>

<style lang="scss">
.AppHeader {
	padding: 1rem;
	font-size: 1.25rem;
	background-color: whitesmoke;
	display: flex;

	&__link {
		color: black;
		flex: 1;
	}

	&__logo {
		vertical-align: middle;
		width: 2.5rem;
		margin-right: 0.5rem;
	}

	&__name,
	&__subtitle {
		display: inline-block;
	}

	&__name {
		vertical-align: middle;
		margin-right: 0.5rem;
	}

	&__title {
		margin-right: 0.5rem;
	}
}
</style>

<script>
import NoSSR from "vue-no-ssr"

export default {
	name: "AppHeader",
	components: { NoSSR }
}
</script>
