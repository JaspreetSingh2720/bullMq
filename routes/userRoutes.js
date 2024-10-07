const express = require("express");
const { createUser , updateUser} = require("../controllers/userController");
const router = express.Router();

router.post("/signup", createUser);
router.post("/update/:id", updateUser);

module.exports = router;
