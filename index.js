const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const ConnectToDB = require("./lib/ConnectToDB");
// Auth Imports
const SignUp = require("./Controllers/AuthContollers/SignupController");
const Login = require("./Controllers/AuthContollers/LoginController");
const VerifyOTP = require("./lib/VerifyOTP");
const TokenVerify = require("./Controllers/AuthContollers/TokenVerify");
const GoogleLogin = require("./Controllers/AuthContollers/GoogleLogin");
const ImageUploadController = require("./Controllers/AuthContollers/ImageUploadController");
const UserDetails = require("./config/UserDetails");
// Schedule Imports
const {
  getSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule,
} = require("./Controllers/ScheduleContollers/ScheduleContoller");
const {
  getChatHistory,
  addMessage,
  clearChat,
} = require("./Controllers/ScheduleContollers/ChatHistoryCon");
const ScheduleNotifier = require("./Controllers/ScheduleContollers/ScheduleNotifier");

dotenv.config();
const server = express();
server.use(express.json());
server.use(cors());

const PORT = process.env.PORT || 4000;

// Connection To DB
ConnectToDB();

//Auth Routes
server.post("/signup", SignUp);
server.post("/login", Login);
server.post("/verify", VerifyOTP);
server.post("/tokenverify", TokenVerify);
server.post("/googlelogin", GoogleLogin);
server.post("/upload", upload.single("image"), ImageUploadController);
server.post("/userdetails", UserDetails);

// Schedule Routes
server.post("/getschedule", getSchedules);
server.post("/addschedule", addSchedule);
server.post("/updateschedule", updateSchedule);
server.post("/deleteschedule", deleteSchedule);
server.get("/history", getChatHistory);
server.post("/message", addMessage);
server.delete("/clear-chat", clearChat);

server.listen(PORT, () => {
  console.log(`Server Is Listening On Port ${PORT}`);
});
