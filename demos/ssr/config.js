// the environment that will be considered when building the skin, either `production` or `development`
const nodeEnv = process.env.NODE_ENV || "development"

module.exports = {
	nodeEnv: nodeEnv,
	isProduction: nodeEnv === "production",
	isTesting: nodeEnv === "testing",

	server: {
		port: process.env.SERVER_PORT || 8003
	}
}
