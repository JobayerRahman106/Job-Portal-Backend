const { sendEmail } = require("../helpers/sendEmail");
const UserModel = require("../model/user.model");
const apiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.signupController = asyncHandler(async (req, res)=> {
  let { name, email, password } = req.body;
  let existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    apiResponse(res, 409, "user already exits");
  } else {
    bcrypt.hash(password, 10, async function (err, hash) {
      if (err) {
        apiResponse(res, 500, err || "Internal server error");
      } else {
        const otp = uuidv4().toString().substring(0, 4);
        let user = new UserModel({
          name,
          email,
          password: hash,
          otpExpire: Date.now() + 2 * 60 * 1000,
          otp
        });
        await user.save();

        sendEmail(name, email, otp, "signup-otp");
        apiResponse(res, 201, "Account create successfully", user);
      }
    });
  }
});

exports.signinController = asyncHandler(async (req, res)=> {
  let { email, password } = req.body;
  let existingUser = await UserModel.findOne({ email }).select("+password");
  if (!existingUser) {
    apiResponse(res, 404, "Email not found");
  } else {
    bcrypt.compare(password, existingUser.password, function (err, result) {
      if (result) {
        let user = {
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
          isActive: existingUser.isActive,
          isVerified: existingUser.isVerified,
        };
        jwt.sign(
          { email: existingUser.email, id: existingUser._id },
          process.env.privateKey,
          { expiresIn: "10m" },
          function (err, token) {
            apiResponse(res, 200, "user login successful", { ...user, token });
          },
        );
      } else {
        apiResponse(res, 404, "Invalid password");
      }
    });
  }
});

exports.otpVerifyController = asyncHandler(async (req, res)=>{
  let {email, otp} = req.body
  let user = await UserModel.findOne({email})

  //   if (!user) {
  //   return apiResponse(res, 404, "User not found");
  // }

  // if (user.isVerified) {
  //   return apiResponse(res, 400, "Email already verified");
  // }

  if(user.otp == otp){
    if(user.otpExpire.getTime() > new Date()){
      user.otp = null
      user.isVerified = true

      await user.save()
      apiResponse(res, 202, "OTP verified successfully")
    }else{
      apiResponse(res, 401, "OTP expired. Please resend OTP")
    }
  }
  else{
    apiResponse(res, 401, "Invalid OTP")
  }
  
});

exports.resendOtpController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if(user){
    if(user.otpExpire > new Date()){
      apiResponse(res, 429, "OTP resend limit exceeded")
    }
    else{
      const otp = uuidv4().toString().substring(0, 4);
      user.otpExpire = Date.now() + 2 * 60 * 1000;
      user.otp = otp;
      await user.save();
      await sendEmail(user.name, user.email, otp, "resend-otp");
      apiResponse(res, 200, "New OTP sent successfully");
    }

  }
  else{
    apiResponse(res, 404, "User not found")
  }
});

exports.forgotPasswordController = asyncHandler(async (req, res)=>{
  let {email} = req.body
  let user = await UserModel.findOne({email})

  if(user){
    const otp = uuidv4().toString().substring(0, 4); 
    user.otp = otp
    user.otpExpire = Date.now()+2*60*1000
    await user.save()
    apiResponse(res, 200, "forgot password otp send successfully")
  }else{
    apiResponse(res, 404, "No account found")
  }
});

exports.resetPasswordController = asyncHandler(async (req, res)=>{
  let {email, password, otp} = req.body
  let user = await UserModel.findOne({email})

    if (user) {
    if (user.otp == otp) {
      if (user.otpExpire > new Date()) {
       let hashpassword = await bcrypt.hash(password, 10)
        user.otp = null;
        user.password = hashpassword
        await user.save();
        apiResponse(res, 200, "OTP Verify successful");
      }else {
        apiResponse(
          res,
          400,
          "The One-Time Password has expired. Please request a new one.",
        );
      }
    }else {
      apiResponse(res, 400, "otp not matched");
    }
  }else {
    apiResponse(res, 404, "No account found.");
  }
});
