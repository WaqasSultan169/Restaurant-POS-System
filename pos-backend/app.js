const express = require("express");
const connectDB = require("./config/database");
const config = require("./config/config");
const globalErrorHandler = require('./middlewares/globalErrorHandler');
const cookieParser = require('cookie-parser');
const cors = require("cors");

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://restaurant-pos-system-blush.vercel.app',
  process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : null
].filter(Boolean);

// 1. Enable Cors for all routes (automatically handles OPTIONS preflight)
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// 2. Database Connection Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database Connection Failure:", err);
    next(err);
  }
});

app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => res.json({ message: "Hello from POS Server!" }));
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/table", require("./routes/tableRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = config.port || 8000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}