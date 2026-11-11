const express = require("express")
const router = express.Router()
const apirouter = require("./api")

router.use("/api", apirouter)

module.exports = router