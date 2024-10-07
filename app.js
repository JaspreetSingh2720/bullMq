const { Queue } = require("bullmq");
const express = require("express");
const { connectToMongoDb } = require("./config/connection");
require("dotenv").config();
// const notificationQueue = new Queue("email-queue", {
//   connection: {
//     host: "127.0.0.1",
//     port: 6379,
//   },
// });

connectToMongoDb(process.env.MONGO_URL)
.then(()=>console.log("MongoDb connected"))
.catch((err)=> console.log(`connection failed err : ${err}`));

const app = express();
app.use(express.json());


app.use("/user", require("./routes/userRoutes"));
app.use("/purchase", require("./routes/purchaseRoutes"));

// app.post("/sendEmail", async (req, res) => {
//   const { email, subject, body } = req.body;

//   try {
//     console.log("..................");

//     const job = await notificationQueue.add("sendEmail", {
//       email,
//       subject,
//       body,
//     }, {delay: 5000});  

//     res
//       .status(200)
//       .json({ message: "Job added to queue successfully", jobId: job.id });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to add job to queue", error : error.message });
//   }
// });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
