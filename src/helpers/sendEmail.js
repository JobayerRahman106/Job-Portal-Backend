const nodemailer = require("nodemailer");

exports.sendEmail = async (name, email, otp, otptype)=>{

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

try {
  const info = await transporter.sendMail({
    from: process.env.SMTP_USER, 
    to: email , 
    subject: `${otptype == "signup-otp" ? "user Verification Email" : "Resend OTP verification"}`, 
    text: "Hello world?", 
    html: `${otptype == "signup-otp" 
      ? 
      `<div style="margin:0;padding:30px 15px;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif"><div style="max-width:500px;margin:0 auto;background-color:#fff;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb"><div style="padding:25px 20px;text-align:center;background-color:#102a43"><h1 style=margin:0;color:#fff;font-size:28px>JobBoard</h1><p style="margin:8px 0 0;color:#d9e2ec;font-size:13px">Your Career Journey Starts Here</div><div style="padding:30px 25px;color:#334155;font-size:15px;line-height:1.7"><h2 style="margin:0 0 20px;color:#102a43;font-size:22px">Verify Your Email Address</h2><p style="margin:0 0 15px">Hi <strong> ${name} </strong>,<p style="margin:0 0 15px">Welcome to <strong>JobBoard</strong>! We're excited to have you join our professional community.<p style="margin:0 0 20px">To complete your account registration, please use the One-Time Password (OTP) below.<div style="padding:25px 15px;text-align:center;background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:8px"><p style="margin:0 0 12px;color:#1e40af;font-size:14px">Your Verification Code<p style=margin:0;color:#2563eb;font-size:32px;font-weight:700;letter-spacing:8px> ${otp} <p style="margin:15px 0 0;color:#64748b;font-size:12px">This OTP is valid for 5 minutes.</div><p style="margin:22px 0 12px;color:#475569;font-size:13px"><p style="margin:25px 0 0;color:#334155">Best regards,<br><strong style=color:#102a43>The JobBoard Team</strong></div><div style="padding:20px;text-align:center;background-color:#f8fafc;border-top:1px solid #e2e8f0"><p style="margin:0 0 6px;color:#64748b;font-size:12px">Connecting Talent with Opportunity.<p style=margin:0;color:#94a3b8;font-size:11px>© 2026 JobBoard. All rights reserved.</div></div></div>`
    : 
    `<div style=font-family:Arial,Helvetica,sans-serif;padding:20px;background-color:#f4f4f4><div style="max-width:450px;margin:0 auto;padding:25px;background-color:#fff;border-radius:8px"><h2 style="margin:0 0 20px;color:#102a43">JobBoard - OTP Verification</h2><p style=color:#333;font-size:14px>Hello <strong> ${name} </strong>,<p style=color:#555;font-size:14px;line-height:1.6>As requested, here is your new OTP to verify your email address.<div style="margin:20px 0;padding:15px;text-align:center;background-color:#eff6ff;border-radius:6px"><p style="margin:0 0 10px;color:#555;font-size:13px">Your New OTP<h1 style=margin:0;color:#2563eb;font-size:30px;letter-spacing:6px> ${otp} </h1></div><p style=color:#666;font-size:13px>This OTP is valid for 5 minutes. Please do not share it with anyone.<p style=margin-top:25px;color:#333;font-size:14px>Best regards,<br><strong>JobBoard Team</strong></div></div>`}    
    `, 
  });

  console.log("Message sent: %s", info.messageId);
} catch (err) {
  console.error("Error while sending mail:", err);
}


}