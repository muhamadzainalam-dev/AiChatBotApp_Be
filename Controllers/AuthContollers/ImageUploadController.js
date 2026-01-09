const CloudinaryImageUploader = require("../../config/CloudinaryImageUploader");
const ImageURL = require("../../Models/AuthModels/ImagePathModel");
const jwt = require("jsonwebtoken");

const ImageUploadController = async (req, res) => {
  try {
    // Upload Image to Cloudinary
    const fileBuffer = `data:image/jpeg;base64,${req.file.buffer.toString(
      "base64"
    )}`;
    const result = await CloudinaryImageUploader(fileBuffer);

    // Get and Decode Token
    const requestedToken = req.body.token;
    const decodedPayload = jwt.decode(requestedToken);
    const userEmail = decodedPayload.email;

    // Check if an image path already exists for the user
    const isImageExist = await ImageURL.findOne({ user: userEmail });

    if (isImageExist) {
      // Update existing image
      isImageExist.imageURL = result.secure_url;
      await isImageExist.save();
      return res.json(result);
    } else {
      // Save new image path
      const newImagePath = new ImageURL({
        user: userEmail,
        imageURL: result.secure_url,
      });
      await newImagePath.save();
    }

    res.json({ success: true, message: "Image changed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Image upload failed" });
  }
};

module.exports = ImageUploadController;
