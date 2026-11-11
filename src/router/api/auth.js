const express = require("express")
const { signupController, signinController, otpVerifyController, resendOtpController, forgotPasswordController} = require("../../controllers/auth.controller")
const router = express.Router()

router.post("/signup", signupController)
router.post("/signin", signinController)
router.post("/otp-verify", otpVerifyController)
router.post("/resend-otp", resendOtpController);
router.post("/forgot-password", forgotPasswordController)
router.post("/rest-password", )

module.exports = router