const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
    },
    email: {
      type: String
    },
    age: {
        type: String
    },
    phone: {
        type: String
    }
},
  { timestamps: true }
);

const Users = mongoose.model("users", usersSchema);

module.exports = { Users };
