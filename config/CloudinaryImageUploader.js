const CloudinaryConfig = require("../lib/Cloudinary");

const CloudinaryImageUploader = async (fileBuffer) => {
  const result = await CloudinaryConfig.uploader.upload(fileBuffer, {
    folder: "uploads",
  });
  return result;
};

module.exports = CloudinaryImageUploader;
