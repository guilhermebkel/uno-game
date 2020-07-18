const path = require("path")

module.exports = {
  webpack: {
    alias: {
			"@unoenty": path.resolve(__dirname, "src"),
			"@shared/protocols": path.resolve(__dirname, "..", "shared", "protocols")
    }
  }
}
