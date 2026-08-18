require("dotenv").config();

const config = Object.freeze({
  port: process.env.PORT || 3000,
  databaseURI: process.env.MONGODB_URI || "mongodb://localhost:27017",
  nodeEnv: process.env.NODE_ENV || "development",
  accessTokenSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  // Safepay Configurations
  safepayApiKey: process.env.SAFEPAY_API_KEY, // 👈 Added: Required by Safepay SDK (sec_...)
  safepaySecretKey: process.env.SAFEPAY_SECRET_KEY,
  safepayWebhookSecret: process.env.SAFEPAY_WEBHOOK_SECRET,
  safepayEnv: process.env.SAFEPAY_ENVIRONMENT || "sandbox",

  // EasyPaisa Configurations
  easypaisaStoreId: process.env.EASYPAISA_STORE_ID,
  easypaisaUser: process.env.EASYPAISA_USER,
  easypaisaPassword: process.env.EASYPAISA_PASSWORD,
  easypaisaEnv: process.env.EASYPAISA_ENV || "sandbox",
});

module.exports = config;