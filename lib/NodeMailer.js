const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const UserMail = process.env.User_Mail;
const UserPass = process.env.User_Pass;

async function NodeMailer(recipientEmail, otp) {
  //  Transporter with Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: UserMail,
      pass: UserPass,
    },
  });

  // Email content
  const mailOptions = {
    from: '"Login And Signup Component" muhamadzainalam.dev@gmail.com',
    to: recipientEmail,
    subject: "Your One-Time Password (OTP)",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #004aad;">Your Verification Code</h2>
        <p>Dear user,</p>
        <p>Your one-time password (OTP) is:</p>
        <h1 style="color: #004aad; letter-spacing: 3px;">${otp}</h1>
        <p>This code will expire in <strong>10 minutes</strong>. Please do not share it with anyone.</p>
        <p>Regards,<br><b>Your Company Team</b></p>
      </div>
    `,
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);
  console.log("OTP email sent:", info.messageId);
}

module.exports = NodeMailer;
