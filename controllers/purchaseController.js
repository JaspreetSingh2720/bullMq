const { Purchases } = require("../models/purchaseModel");
const { Queue } = require("bullmq");
const { Users } = require("../models/userModel");

// create a new instance of the Queue class from the bullmq library
// this will be used to store jobs (in this case, email notifications)
// the connection object specifies the host and port of the Redis server
// that the queue will use to store and retrieve jobs
const notificationQueue = new Queue("email-queue", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});
const createPurchase = async (req, res) => {
  const { userId, productName, price, quantity } = req.body;
  const purchase = await Purchases.create({
    userId,
    productName,
    price,
    quantity,
  });

  const user = await Users.findById({_id: userId})
  const job = await notificationQueue.add(
    "sendInvoiceEmail",
    {
      email: user.email,
      subject: `Invoice #${purchase._id} for Your Recent Purchase`,
      text: `Dear valued customer,

We hope this email finds you well. We are writing to inform you that your recent purchase has been successfully processed, and we have attached the invoice for your reference.

Invoice Number: ${purchase._id}
Date: ${new Date().toLocaleDateString()}
Total Amount: ${purchase.price * purchase.quantity}

Please find the attached invoice for more details. If you have any questions or concerns, please do not hesitate to contact us.

Thank you for your business.

Best regards,
Sunfocus`,
    },
    {
      delay: 5000,
    }
  );
  res
    .status(200)
    .json({ message: "Job added to queue successfully", jobId: job.id });
};

module.exports = { createPurchase };
