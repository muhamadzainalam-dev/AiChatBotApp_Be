const cron = require("node-cron");
const getScheduleModel = require("../../Models/ScheduleModels/ScheduleModel");

function ScheduleNotifier(io) {
  // Runs every minute
  cron.schedule("* * * * *", async () => {
    const Schedule = await getScheduleModel();

    const now = new Date();

    const dueTasks = await Schedule.find({
      taskEndTime: { $lte: now },
      triggered: false,
    });

    for (const task of dueTasks) {
      // 1️⃣ Send socket notification
      io.to(task.email).emit("reminder", {
        title: task.title,
        description: task.description,
        time: task.taskEndTime,
      });

      // 2️⃣ Send email
      await sendReminderEmail(task.email, task);

      // 3️⃣ Mark as triggered
      task.triggered = true;
      await task.save();
    }
  });
}

module.exports = startReminderScheduler;
