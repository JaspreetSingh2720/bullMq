// const { Queue } = require("bullmq");

// const notificationQueue = new Queue("email-queue", {
//   connection: {
//     host: "127.0.0.1",
//     port: 6379,
//   },
// });

// async function init() {
//   const res = await notificationQueue.add("sendEmail", {
//     email: "jass27singh@gmail",
//     subject: "Welcome Mail",
//     body: "Hi Jass Welcome to our team",
//   });
// //   console.log("Job added to queue", res.id);
// }

// init();
