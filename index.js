const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");

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

const savePushToken = require("./Controllers/PushNotiCont/savePushToken");

dotenv.config();

const server = express();
server.use(express.json());
server.use(cors());

const app = http.createServer(server);

const PORT = process.env.PORT || 4000;

// Connection To DB
ConnectToDB();

// SOCKET.IO SETUP
const io = new Server(app, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// When user connects
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join", (email) => {
    socket.join(email);
    console.log(`User joined room: ${email}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// CRON JOB
// Check reminders every 5 seconds
cron.schedule("*/5 * * * * *", async () => {
  try {
    await ScheduleNotifier(io);
  } catch (err) {
    console.error("Cron error:", err);
  }
});

// AUTH ROUTES
server.post("/signup", SignUp);
server.post("/login", Login);
server.post("/verify", VerifyOTP);
server.post("/tokenverify", TokenVerify);
server.post("/googlelogin", GoogleLogin);
server.post("/upload", upload.single("image"), ImageUploadController);
server.post("/userdetails", UserDetails);

// SCHEDULE ROUTES
server.post("/getschedule", getSchedules);
server.post("/addschedule", addSchedule);
server.post("/updateschedule", updateSchedule);
server.post("/deleteschedule", deleteSchedule);

// CHAT ROUTES
server.get("/history", getChatHistory);
server.post("/message", addMessage);
server.delete("/clear-chat", clearChat);

// NOTIFICATION ROUTE
server.post("/savepushtoken", savePushToken);

// SERVER START
app.listen(PORT, () => {
  console.log(`Server Is Listening On Port ${PORT}`);
});
