const getScheduleModel = require("../../Models/ScheduleModels/ScheduleModel");
const chrono = require("chrono-node");

//  GET ALL SCHEDULES
const getSchedules = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: true,
        message: "Email is required",
      });
    }

    const Schedule = await getScheduleModel();
    const schedules = await Schedule.find({ email }).sort({
      taskStartTime: -1,
    });

    res.status(200).json({
      error: false,
      schedules,
    });
  } catch (error) {
    console.error("Schedule fetching error:", error);
    res.status(500).json({
      error: true,
      message: "Server error fetching schedules",
    });
  }
};

//  ADD SCHEDULE
const addSchedule = async (req, res) => {
  try {
    const { email, title, description, taskStartTime, taskEndTime, time_text } =
      req.body;

    if (!email || !title || !description) {
      return res.status(400).json({
        error: true,
        message: "Missing required fields",
      });
    }

    const Schedule = await getScheduleModel();

    let startTime = taskStartTime;
    let endTime = taskEndTime;

    // If frontend sends natural language time
    if (time_text) {
      const parsedDate = chrono.parseDate(time_text);
      if (parsedDate) {
        endTime = parsedDate;
      }
    }

    const newSchedule = new Schedule({
      email,
      title,
      description,
      taskStartTime: startTime || Date.now(),
      taskEndTime: endTime,
      triggered: false,
    });

    await newSchedule.save();

    res.status(201).json({
      error: false,
      message: "Schedule added successfully",
      schedule: newSchedule,
    });
  } catch (error) {
    console.error("Add schedule error:", error);
    res.status(500).json({
      error: true,
      message: "Server error adding schedule",
    });
  }
};

//  UPDATE SCHEDULE
const updateSchedule = async (req, res) => {
  try {
    const { id, title, description, taskStartTime, taskEndTime, triggered } =
      req.body;

    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Schedule ID is required",
      });
    }

    const Schedule = await getScheduleModel();

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(taskStartTime && { taskStartTime }),
        ...(taskEndTime && { taskEndTime }),
        ...(typeof triggered === "boolean" && { triggered }),
      },
      { new: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({
        error: true,
        message: "Schedule not found",
      });
    }

    res.status(200).json({
      error: false,
      message: "Schedule updated successfully",
      schedule: updatedSchedule,
    });
  } catch (error) {
    console.error("Update schedule error:", error);
    res.status(500).json({
      error: true,
      message: "Server error updating schedule",
    });
  }
};

//  DELETE SCHEDULE
const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        error: true,
        message: "Schedule ID is required",
      });
    }

    const Schedule = await getScheduleModel();

    const deleted = await Schedule.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        error: true,
        message: "Schedule not found",
      });
    }

    res.status(200).json({
      error: false,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    console.error("Delete schedule error:", error);
    res.status(500).json({
      error: true,
      message: "Server error deleting schedule",
    });
  }
};

//  EXPORT CONTROLLERS
module.exports = {
  getSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule,
};
