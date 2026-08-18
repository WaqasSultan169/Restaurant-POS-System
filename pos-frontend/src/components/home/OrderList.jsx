import React from "react";
import { FaCheckDouble, FaCircle, FaClock } from "react-icons/fa";

const OrderList = ({ order }) => {
    const customerName = order?.customerDetails?.name || "Walk-in Customer";
    const totalItems = order?.items?.length || 0;
    const tableNo = order?.customerDetails?.tableNo || "N/A";
    const orderStatus = order?.orderStatus || "In Progress";

    const getInitials = (name) => {
        if (!name) return "WC";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const isCompleted = orderStatus === "Completed" || orderStatus === "Ready";

    return (
        <div className="grid grid-cols-[auto_1fr_140px_130px] items-center gap-4 mb-3 p-3 bg-[#1f1f1f] rounded-lg hover:bg-[#252525] transition-all">
            <button className="bg-[#f6b100] text-[#1f1f1f] w-12 h-12 flex items-center justify-center font-bold rounded-lg text-lg shrink-0">
                {getInitials(customerName)}
            </button>

            <div className="flex flex-col items-start gap-0.5 overflow-hidden pr-2">
                <h1 className="text-[#f5f5f5] text-base font-semibold tracking-wide truncate w-full">
                    {customerName}
                </h1>
                <p className="text-[#ababab] text-sm">
                    {totalItems} {totalItems === 1 ? "Item" : "Items"}
                </p>
            </div>

            <div className="flex justify-center">
                <h1 className="text-[#f6b100] text-sm font-semibold border border-[#f6b100] rounded-lg px-3 py-1.5 whitespace-nowrap">
                    Table No: {tableNo}
                </h1>
            </div>

            <div className="flex flex-col items-end gap-1">
                <p className={`text-sm font-semibold ${isCompleted ? "text-green-500" : "text-yellow-500"}`}>
                    {isCompleted ? (
                        <>
                            <FaCheckDouble className="inline mr-1" /> {orderStatus}
                        </>
                    ) : (
                        <>
                            <FaClock className="inline mr-1" /> {orderStatus}
                        </>
                    )}
                </p>
                <p className="text-[#ababab] text-xs flex items-center gap-1">
                    <FaCircle className={`text-[8px] ${isCompleted ? "text-green-500" : "text-yellow-500"}`} />
                    {isCompleted ? "Ready to Serve" : "Preparing"}
                </p>
            </div>
        </div>
    );
};

export default OrderList;