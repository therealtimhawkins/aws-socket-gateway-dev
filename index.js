require("dotenv").config()
require("dotenv").config({ path: process.env.LAMBDA_ENV_PATH })
require("./gateways/socket")
require("./gateways/server")
