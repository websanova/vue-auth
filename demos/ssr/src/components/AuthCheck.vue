<script>
export default {
	name: "AuthCheck",
	beforeMount() {
		this.$auth.refresh({
			success: () => {
				this.handleRedirect()
			},
			error: () => {
				this.handleRedirect()
			}
		})
	},
	methods: {
		handleRedirect() {
			this.$auth.options.checkAuthenticated.call(this.$auth, () => {
				if (Object.keys(this.$route.meta).length !== 0) {
					if (this.$auth.check()) {
						console.log("You are authorized")
					} else {
						console.log("You are not authorized")
						this.$router.replace(this.$auth.options.authRedirect.path)
					}
				} else {
					console.log("No need to check auth")
				}
			})
		}
	},
	render(h) {
		return h(null)
	}
}
</script>
