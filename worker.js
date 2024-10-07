const { Worker, tryCatch } = require("bullmq");
require("dotenv").config();
const nodemailer = require("nodemailer");

// const sendEmail = async () => {
//   return new Promise((res, rej) => setTimeout(() => res(), 5 * 1000));
// };

// const worker = new Worker(
//   "email-queue",
//   async (job) => {
//     console.log("Message Received", job.id);
//     console.log("Message Processing");
//     console.log("Sending Message");
//     await sendEmail();
//     console.log("Message Sent");
//   },
//   {
//     connection: {
//       host: "127.0.0.1",
//       port: 6379,
//     },
//   }
// );

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (data) => {

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: data.subject,
    text: data.text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      "Email sent successfully to:::::::::::::::::::::::::::::::::",
      data.email
    );
    return { success: true, email: data.email };
  } catch (error) {
    return { success: false, error: error };
  }
};

const worker = new Worker(
  "email-queue",
  async (job) => {
    console.log(`Message recieved: ${job.id}`);
    console.log("Processing message", job.data);

    const result = await sendEmail(job.data);

    console.log("Result:", result.success);

    if (result.success == false) {
      console.log(`Failed to send email to ${result.email}: ${result.error}`);

      try {
        console.log("Retrying job");
        await job.retry();
      } catch (error) {
        console.log("Failed to retry job:", error.message);
        await job.moveToFailed({ message: error }, true);
        console.log(`Moved job ${job.id} to failed queue`);
      }
    }
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

worker.on("completed", (job) => {
  console.log("Job completed", job.id);
});

worker.on("failed", (job, error) => {
  console.log("Job failed", job.id, "error:", error.message);
});
