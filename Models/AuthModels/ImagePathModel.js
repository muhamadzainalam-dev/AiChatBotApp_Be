const mongoose = require("mongoose");
const { Schema } = mongoose;

const ImagePathSchema = new Schema({
  user: { type: String, required: true },
  imageURL: { type: String, required: true },
});

const ImageURL = mongoose.model("ImagePath", ImagePathSchema, "ImagePath_COL");
module.exports = ImageURL;
