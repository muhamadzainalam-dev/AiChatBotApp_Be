const getScheduleModel = require("../../Models/ScheduleModels/ScheduleModel");
const admin = require("../../lib/firebaseAdmin");
const getPushTokenModel = require("../../Models/PushNotiModels/PushTokenModel");

const ScheduleNotifier = async (io) => {
  const Schedule = await getScheduleModel();
  const now = new Date();

  const dueTasks = await Schedule.find({
    taskEndTime: { $lte: now },
    triggered: false,
  });

  for (const task of dueTasks) {
    const PushToken = await getPushTokenModel();
    const userToken = await PushToken.findOne({ email: task.email });

    if (userToken) {
      await admin.messaging().send({
        token: userToken.token,
        notification: {
          title: task.title,
          body: task.description,
        },
      });
    }

    task.triggered = true;
    await task.save();
  }

  console.log(
    `Checked for due tasks at ${now}. Found ${dueTasks.length} due tasks.`
  );
};

module.exports = ScheduleNotifier;
