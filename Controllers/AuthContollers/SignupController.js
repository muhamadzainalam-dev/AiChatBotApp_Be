const dotenv = require("dotenv");
const User = require("../../Models/AuthModels/UserModel");
const NodeMailer = require("../../lib/NodeMailer");
const bcrypt = require("bcrypt");

dotenv.config();

const SignUp = async (req, res) => {
  try {
    // Get Auth Details From Frontend
    const { name, email, password } = req.body;

    // Hash The Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Send OTP
    const Generated_OTP = Math.floor(100000 + Math.random() * 900000);
    NodeMailer(email, Generated_OTP);

    // Save Auth Details In DB
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      OTP: Generated_OTP,
      OTP_Limit: Date.now() + 5 * 60 * 1000,
      verified: false,
    });
    await newUser.save();

    // Send Response
    res.json({
      message: "OTP sent to your email. Please verify to complete signup.",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = SignUp;
