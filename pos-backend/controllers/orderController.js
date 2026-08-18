const createHttpError = require("http-errors");
const Order = require("../models/orderModel");
const Table = require("../models/tableModel"); // 1. Import Table Model
const mongoose = require("mongoose");

const addOrder = async (req, res, next) => {
    try {
        // Create and save the new order
        const order = new Order(req.body);
        await order.save();

        // Extract table identifier from order payload or customerDetails
        const tableId = req.body.table || req.body.tableId;
        const tableNo = req.body.customerDetails?.tableNo;

        // 2. Mark table as booked in database
        if (tableId && mongoose.Types.ObjectId.isValid(tableId)) {
            await Table.findByIdAndUpdate(tableId, {
                status: "booked",
                currentOrder: order._id
            });
        } else if (tableNo && tableNo !== "N/A") {
            await Table.findOneAndUpdate(
                { tableNo: tableNo },
                {
                    status: "booked",
                    currentOrder: order._id
                }
            );
        }

        res.status(201).json({ success: true, message: "Order Created", data: order });

    } catch (error) {
        next(error);
    }
}

const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            const error = createHttpError(404, "Invalid id!");
            return next(error);
        }

        const order = await Order.findById(id);
        if(!order){
            const error = createHttpError(404, "Order not found!");
            return next(error);
        }

        res.status(200).json({success: true, data: order});

    } catch (error) {
        next(error);
    }
}

const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate("table");
        res.status(200).json({data: orders});

    } catch (error) {
        next(error);
    }
}

const updateOrder = async (req, res, next) => {
    try {
        const { orderStatus } = req.body;
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            const error = createHttpError(404, "Invalid id!");
            return next(error);
        }

        const order = await Order.findByIdAndUpdate(
            id,
            {orderStatus},
            {new: true}
        );

        if(!order){
            const error = createHttpError(404, "Order not found!");
            return next(error);
        }

        // Optional: If order is completed or cancelled, release the table back to "Available"
        if (orderStatus === "Completed" && order.table) {
            await Table.findByIdAndUpdate(order.table, {
                status: "Available",
                currentOrder: null
            });
        }

        res.status(200).json({success: true, message: "Order updated", data: order});

    } catch (error) {
        next(error);
    }
}

module.exports = { addOrder, getOrderById, getOrders, updateOrder };