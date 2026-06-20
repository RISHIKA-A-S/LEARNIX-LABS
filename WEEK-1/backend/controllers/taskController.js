const tasks = require("../data/tasks");

const getAllTasks = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

module.exports = {
  getAllTasks
};