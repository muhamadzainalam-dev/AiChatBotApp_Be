const mongoose = require("mongoose");
const { Schema } = mongoose;
const connectDB = require("../../lib/ConnectToDB");

let PushToken;

async function getPushTokenModel() {
  if (PushToken) return PushToken;

  const db = await connectDB();

  const PushTokenSchema = new Schema({
    email: { type: String, required: true, index: true },
    token: { type: String, required: true },
  });

  PushToken = db.model("PushToken", PushTokenSchema, "PushTokens_COL");
  return PushToken;
}

module.exports = getPushTokenModel;
