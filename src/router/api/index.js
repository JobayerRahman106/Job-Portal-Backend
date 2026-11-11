const express = require("express")
const router = express.Router()
const authrouter = require("./auth")

router.use("/auth", authrouter)

module.exports = router