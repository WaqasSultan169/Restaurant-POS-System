const express = require("express");
const connectDB = require("./config/database");
const config = require("./config/config");
const globalErrorHandler = require('./middlewares/globalErrorHandler');
const cookieParser = require('cookie-parser');
const cors = require("cors");

const app = express();

// Ensure MongoDB is connected and cached BEFORE handling any route
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("Database connection failure:", err);
        next(err);
    }
});

// Parse incoming request bodies and cookies
app.use(express.json());
app.use(cookieParser());

// Dynamic CORS logic handling local dev and production frontend
const allowedOrigins = [
    'http://localhost:5173',
    'https://restaurant-pos-system-blush.vercel.app',
    process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : null
].filter(Boolean);

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

// Root Endpoint
app.get("/", (req, res) => {
    res.json({ message: "Hello from POS Server!" });
});

// API Routes
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/table", require("./routes/tableRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));

// Global Error Handler
app.use(globalErrorHandler);

// Export Express app for Vercel Serverless handler
module.exports = app;

// Only spin up app.listen in local development mode
if (process.env.NODE_ENV !== 'production') {
    const PORT = config.port || 8000;
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}