const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmailOTP = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: 'RakshaNow Email Verification',
      text: `Your RakshaNow verification code is: ${otp}. Valid for 10 minutes.`
    });
    console.log(`📧 Email OTP sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Email OTP Error:", error);
    return false;
  }
};

module.exports = { sendEmailOTP };