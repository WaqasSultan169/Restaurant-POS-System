import React from 'react';
import { FaCheckDouble, FaCircle, FaLongArrowAltRight } from 'react-icons/fa';

const OrderCard = ({ order }) => {
  // Destructure fields from order prop safely
  const {
    customerDetails,
    orderStatus,
    orderDate,
    bills,
    items,
    table,
    createdAt
  } = order || {};

  // Get customer name & create initials
  const customerName = customerDetails?.name || "Guest Customer";
  const avatarInitials = customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Safely extract table number from customerDetails or populated table object
  const tableNo =
    customerDetails?.tableNo ||
    customerDetails?.tableNumber ||
    table?.tableNo ||
    (typeof table === 'string' ? table : "N/A");

  // Format date safely
  const formattedDate = new Date(orderDate || createdAt || Date.now()).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Calculate item count
  const itemCount = Array.isArray(items) 
    ? items.reduce((acc, item) => acc + (item.quantity || 1), 0) 
    : 0;

  // Case-insensitive status check
  const isReady = orderStatus?.toLowerCase() === "ready";

  return (
    <div className='w-full bg-[#262626] p-4 rounded-lg mb-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <button className='bg-[#f6b100] p-3 text-xl font-bold rounded-lg min-w-[50px] text-black'>
          {avatarInitials}
        </button>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 w-full'>
          <div className='flex flex-col items-start gap-1'>
            <h1 className='text-[#f5f5f5] text-lg font-semibold tracking-wide'>
              {customerName}
            </h1>
            <p className='text-[#ababab] text-sm'>
              #{Math.floor(new Date(order.orderDate).getTime())} / {customerDetails?.orderType || "Dine in"}
            </p>
            <p className='text-[#ababab] text-sm'>
              Table <FaLongArrowAltRight className='text-[#ababab] ml-2 inline' /> {customerDetails?.tableNo}
            </p>
          </div>
          <div className='flex flex-col items-end gap-2'>
            {isReady ? (
              <>
                <p className='text-green-500 bg-[#2e4a40] px-2 py-1 rounded-lg text-sm font-medium capitalize'>
                  <FaCheckDouble className='inline mr-2' /> {orderStatus}
                </p>
                <p className='text-[#ababab] text-sm'>
                  <FaCircle className='inline mr-2 text-green-600'/> Ready to Serve
                </p>
              </>
            ) : (
              <>
                <p className='text-yellow-600 bg-[#4a462e] px-2 py-1 rounded-lg text-sm font-medium capitalize'>
                  <FaCheckDouble className='inline mr-2' /> {orderStatus || "In Progress"}
                </p>
                <p className='text-[#ababab] text-sm'>
                  <FaCircle className='inline mr-2 text-yellow-600'/> Preparing your order...
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between mt-4 text-[#ababab]'>
        <p>{formattedDate}</p>
        <p>{itemCount} Items</p>
      </div>

      <hr className='w-full mt-4 border-t-1 border-gray-500' />

      <div className='flex items-center justify-between mt-4'>
        <h1 className='text-[#f5f5f5] text-lg font-semibold'>Total</h1>
        <p className='text-[#f5f5f5] text-lg font-semibold'>
          Rs. {bills?.totalWithTax || bills?.total || 0}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;