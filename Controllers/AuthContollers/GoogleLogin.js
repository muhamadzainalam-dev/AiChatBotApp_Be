const jwt = require("jsonwebtoken");
const User = require("../../Models/AuthModels/UserModel");
const ImagePath = require("../../Models/AuthModels/ImagePathModel");
const dotenv = require("dotenv");

dotenv.config();

const secretKey = process.env.JWT_SCRET_KEY;

const GoogleLogin = async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token) {
      return res.status(400).json({ message: "Access token missing" });
    }

    const googleRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const googleData = await googleRes.json();
    const { email, name } = googleData;

    if (!email) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        password: "ThisUserIsUsingThirdPartyAuth",
        OTP: undefined,
        OTP_Limit: undefined,
        verified: true,
      });
      await user.save();
    }

    profileimage = new ImagePath({
      user: email,
      imageURL: googleData.picture,
    });
    await profileimage.save();

    const token = jwt.sign({ id: user._id, email: user.email }, secretKey);

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Google authentication failed" });
  }
};

module.exports = GoogleLogin;
