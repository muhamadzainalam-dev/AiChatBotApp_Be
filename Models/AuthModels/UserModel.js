const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  join_Date: { type: Date, default: Date.now },
  isSubcribed: { type: Boolean, default: true },
  OTP: { type: String, default: 0 },
  OTP_Limit: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
});

const User = mongoose.model("User", UserSchema, "LoginSignup_COL");
module.exports = User;
