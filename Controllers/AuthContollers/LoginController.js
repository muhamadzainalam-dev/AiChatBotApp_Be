const dotenv = require("dotenv");
const User = require("../../Models/AuthModels/UserModel");
const NodeMailer = require("../../lib/NodeMailer");
const bcrypt = require("bcrypt");

dotenv.config();

const Login = async (req, res) => {
  try {
    // Get Auth Details From Frontend
    const { email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Email not exists" });
    }

    // Compare Password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Password does not match." });
    }

    // Send OTP
    const Generated_OTP = Math.floor(100000 + Math.random() * 900000);
    NodeMailer(email, Generated_OTP);

    // Save OTP Details In DB
    existingUser.OTP = Generated_OTP;
    existingUser.OTP_Limit = Date.now() + 1 * 60 * 1000;
    existingUser.verified = false;

    await existingUser.save();

    // Send Response After API Work Complete
    res.json({
      message: "OTP sent to your email. Please verify to complete login.",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = Login;
