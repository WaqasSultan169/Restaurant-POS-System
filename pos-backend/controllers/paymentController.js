const Safepay = require("@sfpy/node-core");
const crypto = require("crypto");
const axios = require("axios");
const createHttpError = require("http-errors");
const config = require("../config/config");
const Payment = require("../models/paymentModel");

// Initialize Safepay Instance
const safepay = new Safepay({
  apiKey: config.safepayApiKey || "sec_sandbox_placeholder",
  v1Secret: config.safepaySecretKey,
  environment: config.safepayEnv || "sandbox",
});

// 1. SAFEPAY ORDER CREATION
const createSafepayOrder = async (req, res, next) => {
  try {
    const { amount, currency = "PKR" } = req.body;

    if (!amount) {
      return next(createHttpError(400, "Amount is required"));
    }

    const formattedAmount = Number(amount);
    const env = config.safepayEnv === "production" ? "production" : "sandbox";
    const baseUrl =
      env === "production"
        ? "https://api.getsafepay.com"
        : "https://sandbox.api.getsafepay.com";

    const response = await axios.post(
      `${baseUrl}/order/v1/init`,
      {
        client: config.safepayApiKey,
        amount: formattedAmount,
        currency: currency,
        environment: env,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-SFPY-API-KEY": config.safepayApiKey,
        },
      }
    );

    const trackerToken = response.data?.data?.token || response.data?.token;

    if (!trackerToken) {
      return next(createHttpError(500, "Failed to retrieve Safepay token"));
    }

    const checkoutBase =
      env === "production"
        ? "https://checkout.getsafepay.com"
        : "https://sandbox.api.getsafepay.com/checkout";

    const checkoutUrl = `${checkoutBase}?beacon=${trackerToken}&order_id=ORD-${Date.now()}&env=${env}&source=custom&webhooks=true`;

    return res.status(200).json({
      success: true,
      provider: "safepay",
      token: trackerToken,
      checkoutUrl: checkoutUrl,
    });
  } catch (error) {
    console.error(
      "Safepay API Error:",
      error?.response?.data || error.message
    );
    return next(
      createHttpError(
        500,
        error?.response?.data?.message || "Safepay order creation failed"
      )
    );
  }
};

// 2. SAFEPAY WEBHOOK VERIFICATION
const safepayWebhook = async (req, res, next) => {
  try {
    const secret = config.safepayWebhookSecret;
    const signature = req.headers["x-sfpy-signature"];

    // Safepay passes signature verification on the raw body buffer string
    const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

    if (secret && signature && secret !== "your_safepay_webhook_secret_here") {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");

      if (expectedSignature !== signature) {
        return next(createHttpError(400, "Invalid signature"));
      }
    }

    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { event, data } = payload;

    if (event === "payment.captured" || event === "payment.completed") {
      const newPayment = new Payment({
        paymentId: data?.tracker || data?.id,
        orderId: data?.order_id || `ORD-${Date.now()}`,
        amount: data?.amount || 0,
        currency: data?.currency || "PKR",
        status: "Completed",
        method: "Safepay",
      });

      await newPayment.save();
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Safepay Webhook Error:", error);
    return next(error);
  }
};

// 3. EASYPAISA ORDER CREATION
const createEasypaisaOrder = async (req, res, next) => {
  try {
    const { amount, mobileNumber, email } = req.body;

    if (!amount || !mobileNumber) {
      return next(createHttpError(400, "Amount and Mobile Number are required"));
    }

    const orderId = `EP-${Date.now()}`;
    
    // Configurable EasyPaisa URL endpoint to avoid 404 errors
    const easypaisaUrl =
      config.easypaisaApiUrl ||
      (config.easypaisaEnv === "production"
        ? "https://easypay.easypaisa.com.pk/easypay-service/rest/v4/initiate-ma-transaction"
        : "https://stage-easypay.easypaisa.com.pk/easypay-service/rest/v4/initiate-ma-transaction");

    const authCredentials = Buffer.from(
      `${config.easypaisaUser}:${config.easypaisaPassword}`
    ).toString("base64");

    const response = await axios.post(
      easypaisaUrl,
      {
        orderId: orderId,
        storeId: config.easypaisaStoreId,
        transactionAmount: Number(amount).toFixed(2),
        transactionType: "MA",
        mobileAccountNo: mobileNumber,
        emailAddress: email || "customer@example.com",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authCredentials}`,
        },
      }
    );

    if (response.data?.responseCode === "0000" || response.data?.success) {
      const pendingPayment = new Payment({
        paymentId: response.data.transactionId || orderId,
        orderId: orderId,
        amount: amount,
        currency: "PKR",
        status: "Pending OTP",
        method: "EasyPaisa",
        contact: mobileNumber,
      });

      await pendingPayment.save();

      return res.status(200).json({
        success: true,
        message: "OTP prompt sent to EasyPaisa account",
        data: response.data,
      });
    } else {
      return next(
        createHttpError(
          400,
          response.data?.responseDesc || response.data?.message || "EasyPaisa payment failed"
        )
      );
    }
  } catch (error) {
    console.error("EasyPaisa Request Endpoint:", error?.config?.url);
    console.error("EasyPaisa Error Detail:", error?.response?.data || error.message);
    return next(
      createHttpError(
        error?.response?.status || 500,
        error?.response?.data?.responseDesc || error.message || "EasyPaisa transaction error"
      )
    );
  }
};

module.exports = {
  createSafepayOrder,
  safepayWebhook,
  createEasypaisaOrder,
};