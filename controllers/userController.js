const { Users } = require("../models/userModel");
const { Queue } = require("bullmq");

const notificationQueue = new Queue("email-queue", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});

const createUser = async (req, res) => {
  const { userName, email, age, phone } = req.body;
  const user = await Users.create({ userName, email, age, phone });
  const job = await notificationQueue.add("sendWelcomeEmail", {
    email: user.email,
    subject: "Welcome Mail",
    text: `Hello ${user.userName},\n\nWelcome to our service! We're glad to have you with us.`,
  });
  res
    .status(200)
    .json({ message: "Job added to queue successfully", jobId: job.id });
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const user = await Users.findById(userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
  }
  const { userName, email, age, phone } = req.body;
  const updatedUser = await Users.findByIdAndUpdate(
    userId,
    { userName, email, age, phone },
    { new: true }
  );
  const job = await notificationQueue.add("sendUpdateEmail", {
    email: user.email,
    subject: "Updated Profile",
    text: `Hello ${user.userName},\n\nYour Profile has been updated.`,
  });
  res
    .status(200)
    .json({ message: "Job added to queue successfully", jobId: job.id });
};

module.exports = { createUser , updateUser};
