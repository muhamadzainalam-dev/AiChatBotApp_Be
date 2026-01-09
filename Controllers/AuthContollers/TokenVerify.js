const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SCRET_KEY;

const TokenVerify = (req, res) => {
  const TokenToVerify = req.body.token;

  jwt.verify(TokenToVerify, JWT_SECRET, (err) => {
    if (err) {
      res.send({ status: 403, message: "Access Denied" });
    } else {
      res.json({
        message: "Protected route accessed",
      });
    }
  });
};

module.exports = TokenVerify;
