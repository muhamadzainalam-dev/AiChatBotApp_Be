const mongoose = require("mongoose");

let scheduleDB;

async function connectDB() {
  if (scheduleDB) return scheduleDB;

  const conn = await mongoose.connect(process.env.MONGODB_URI);
  scheduleDB = conn.connection.useDb("Scheduling_App_DB");

  console.log("Connected to Scheduling DB");
  return scheduleDB;
}

module.exports = connectDB;
