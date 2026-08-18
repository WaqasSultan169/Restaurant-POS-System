const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);


const express = require("express");
const connectDB = require("./config/database");
const config = require("./config/config")
const globalErrorHandler = require('./middlewares/globalErrorHandler');
const createHttpError = require('http-errors');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require("cors");

const PORT = config.port;
connectDB();

// Middlewares
app.use(express.json()); // parse incoming request in json format
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173']
}))

// Root Endpoint
app.get("/", (req, res) => {
    res.json({message : "Hello from POS Server!"});
})

// Other Endpoints
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/table", require("./routes/tableRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));

// Global Error Handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`POS Server is listening on port ${PORT}`);
})