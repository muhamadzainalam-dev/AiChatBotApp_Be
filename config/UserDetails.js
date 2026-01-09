const User = require("../Models/AuthModels/UserModel");
const ImagePath = require("../Models/AuthModels/ImagePathModel");
const jwt = require("jsonwebtoken");

const UserDetails = async (req, res) => {
  try {
    const requestedToken = req.body.token;

    // Decode The Token
    const decodedPayload = jwt.decode(requestedToken);
    const userEmail = decodedPayload.email;

    if (!decodedPayload) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userDetails = await User.findOne({ email: userEmail });
    const imagePath = await ImagePath.findOne({ user: userEmail });

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ userDetails, imagePath });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = UserDetails;
