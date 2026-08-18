const express = require("express");
const { isVerifiedUser } = require("../middlewares/tokenVerfication");
const {
  createSafepayOrder,
  createEasypaisaOrder,
  safepayWebhook,
} = require("../controllers/paymentController");

const router = express.Router();

// 1. Safepay Routes
router.route("/safepay/create-order").post(isVerifiedUser, createSafepayOrder);
// routes/paymentRoutes.js
router.route("/safepay/webhook").post(express.raw({ type: "application/json" }), safepayWebhook);
// 2. EasyPaisa Route
router.route("/easypaisa/create-order").post(isVerifiedUser, createEasypaisaOrder);

module.exports = router;