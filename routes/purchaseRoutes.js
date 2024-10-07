const express = require("express");
const router = express.Router();
const { createPurchase } = require("../controllers/purchaseController");

router.post("/invoice", createPurchase);

module.exports = router;