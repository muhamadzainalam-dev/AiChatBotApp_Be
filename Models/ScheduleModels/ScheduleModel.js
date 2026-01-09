const mongoose = require("mongoose");
const { Schema } = mongoose;
const connectDB = require("../../lib/ConnectToDB");

let Schedule;

async function getScheduleModel() {
  if (Schedule) return Schedule;

  const scheduleDB = await connectDB();

  const ScheduleSchema = new Schema({
    email: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    taskStartTime: { type: Date, default: Date.now },
    taskEndTime: { type: Date, required: true },
    triggered: { type: Boolean, default: false },
  });

  Schedule = scheduleDB.model("Schedule", ScheduleSchema, "Scheduling_App_COL");

  return Schedule;
}

module.exports = getScheduleModel;
