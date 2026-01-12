const getPushTokenModel = require("../../Models/PushNotiModels/PushTokenModel");

const savePushToken = async (req, res) => {
  const { email, token } = req.body;
  if (!email || !token) return res.sendStatus(400);

  const PushToken = await getPushTokenModel();

  await PushToken.updateOne({ email }, { token }, { upsert: true });

  res.json({ success: true });
};

module.exports = savePushToken;
