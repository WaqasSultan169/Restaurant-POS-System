const mongoose = require("mongoose");
const config = require("./config");

// Cache the connection in Node's global scope across serverless executions
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    // 1. Reuse existing connection if present
    if (cached.conn) {
        return cached.conn;
    }

    // 2. Instantiate a new connection promise if none is active
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(config.databaseURI, opts).then((mongooseInstance) => {
            console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
            return mongooseInstance;
        });
    }

    try {
        // 3. Resolve and store the connection
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error(`MongoDB Connection Error: ${error.message}`);
        throw error;
    }

    return cached.conn;
};

module.exports = connectDB;