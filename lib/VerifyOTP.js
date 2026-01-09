const User = require("../Models/AuthModels/UserModel");
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SCRET_KEY;

const VerifyOTP = async (req, res) => {
  try {
    const { email, OTP } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (OTP !== user.OTP) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    if (user.OTP_Limit < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Clear OTP fields
    user.OTP = undefined;
    user.OTP_Limit = undefined;
    user.verified = true;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, secretKey);

    res.json({
      message: "Verification successful",
      token: token,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = VerifyOTP;
