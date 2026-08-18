// src/components/bill/Bill.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { getTotalPrice } from "../../redux/slices/cartSlice";
import { enqueueSnackbar } from "notistack";
import { createSafepayOrder, createEasypaisaOrder, addOrder } from "../../https/index";
import Invoice from "../invoice/Invoice"; // Invoice Modal

const getSafepaySDK = () => {
  return new Promise((resolve, reject) => {
    if (window.Safepay) return resolve(window.Safepay);

    const script = document.createElement("script");
    script.src = "/safepay-checkout.js";
    script.async = true;
    script.onload = () => setTimeout(() => resolve(window.Safepay), 100);
    script.onerror = () => reject(new Error("Failed to load Safepay SDK"));
    document.head.appendChild(script);
  });
};

const Bill = () => {
  const queryClient = useQueryClient();
  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector((state) => state.cart);

  const total = useSelector(getTotalPrice);
  const taxRate = 5.25;
  const tax = (total * taxRate) / 100;
  const totalPricewithTax = total + tax;

  const [paymentCategory, setPaymentCategory] = useState("");
  const [onlineGateway, setOnlineGateway] = useState("");
  const [showOnlineMenu, setShowOnlineMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [easypaisaMobile, setEasypaisaMobile] = useState(customerData?.phone || "");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  const handleOnlineCategoryClick = () => {
    setPaymentCategory("Online");
    setShowOnlineMenu((prev) => !prev);
  };

  const handleCashCategoryClick = () => {
    setPaymentCategory("Cash");
    setOnlineGateway("");
    setShowOnlineMenu(false);
  };

  const selectGateway = (gatewayName) => setOnlineGateway(gatewayName);

  // Helper to format payload
  const buildOrderPayload = () => {
    const customerInfo = customerData?.customer || customerData;

    return {
      customerDetails: {
        name: customerInfo?.name || customerData?.customerName || "Walk-in Customer",
        phone: customerInfo?.phone || customerData?.customerPhone || "N/A",
        email: customerInfo?.email || customerData?.email || "guest@example.com",
        orderType: customerInfo?.orderType || customerData?.orderType || "Dine in",
        tableNo: customerInfo?.tableNo || customerData?.tableNo || "N/A",
        guests: Number(customerInfo?.guests || customerData?.guests) || 1,
      },
      table: customerInfo?._id || customerInfo?.tableId || customerData?.tableId || null,
      items: cartData.map((item) => ({
        id: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      })),
      bills: {
        total: Number(total.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        totalWithTax: Number(totalPricewithTax.toFixed(2)),
      },
      paymentMethod: paymentCategory === "Cash" ? "Cash" : onlineGateway || "Pending",
      orderStatus: "In Progress",
    };
  };

  // Direct manual print preview button handler
  const handleDirectPrintReceipt = () => {
    if (!cartData || cartData.length === 0) {
      enqueueSnackbar("Cart is empty! Add items to print a receipt.", { variant: "warning" });
      return;
    }
    const currentPayload = buildOrderPayload();
    setPlacedOrderDetails(currentPayload);
    setIsModalOpen(true);
  };

  const handlePlaceOrder = async () => {
    if (!paymentCategory) {
      enqueueSnackbar("Please select a payment method!", { variant: "warning" });
      return;
    }

    if (paymentCategory === "Online" && !onlineGateway) {
      enqueueSnackbar("Please choose Safepay or EasyPaisa!", { variant: "warning" });
      setShowOnlineMenu(true);
      return;
    }

    const currentOrderPayload = buildOrderPayload();
    setLoading(true);

    try {
      if (paymentCategory === "Cash") {
        await addOrder(currentOrderPayload);
        queryClient.invalidateQueries({ queryKey: ["tables"] });
        enqueueSnackbar("Order placed successfully with Cash!", { variant: "success" });

        // Open Modal
        setPlacedOrderDetails(currentOrderPayload);
        setIsModalOpen(true);

      } else if (paymentCategory === "Online" && onlineGateway === "Safepay") {
        const reqData = { amount: currentOrderPayload.bills.totalWithTax, currency: "PKR" };
        const { data } = await createSafepayOrder(reqData);

        if (data?.token) {
          const safepay = await getSafepaySDK();
          safepay.Checkout.init({
            tracker: data.token,
            env: "sandbox",
            onDismiss: () => enqueueSnackbar("Payment window closed", { variant: "info" }),
            onSuccess: async () => {
              currentOrderPayload.paymentId = data.token;
              await addOrder(currentOrderPayload);
              queryClient.invalidateQueries({ queryKey: ["tables"] });
              enqueueSnackbar("Payment complete!", { variant: "success" });

              setPlacedOrderDetails(currentOrderPayload);
              setIsModalOpen(true);
            },
          });
        }
      } else if (paymentCategory === "Online" && onlineGateway === "EasyPaisa") {
        const cleanMobile = (easypaisaMobile || customerData?.phone || "").trim();
        if (!cleanMobile || cleanMobile.length !== 11) {
          enqueueSnackbar("Please enter a valid 11-digit EasyPaisa mobile number!", { variant: "warning" });
          setLoading(false);
          return;
        }

        const reqData = {
          amount: currentOrderPayload.bills.totalWithTax,
          mobileNumber: cleanMobile,
          email: currentOrderPayload.customerDetails.email,
        };

        const { data } = await createEasypaisaOrder(reqData);

        if (data?.responseCode === "0000" || data?.success) {
          currentOrderPayload.paymentId = data?.transactionId || data?.orderId || "EASYPAISA_DIRECT";
          await addOrder(currentOrderPayload);
          queryClient.invalidateQueries({ queryKey: ["tables"] });
          enqueueSnackbar("EasyPaisa payment initiated!", { variant: "success" });

          setPlacedOrderDetails(currentOrderPayload);
          setIsModalOpen(true);
        }
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.response?.data?.message || "Order placement failed!", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Total Calculations */}
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium">Items ({cartData.length})</p>
        <h1 className="text-[#f5f5f5] text-md font-bold">PKR {total.toFixed(2)}</h1>
      </div>

      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium">Tax (5.25%)</p>
        <h1 className="text-[#f5f5f5] text-md font-bold">PKR {tax.toFixed(2)}</h1>
      </div>

      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium">Total With Tax</p>
        <h1 className="text-[#f5f5f5] text-md font-bold text-yellow-500">
          PKR {totalPricewithTax.toFixed(2)}
        </h1>
      </div>

      {/* Payment Options */}
      <div className="flex items-center gap-3 px-5 mt-4">
        <button
          onClick={handleCashCategoryClick}
          className={`${
            paymentCategory === "Cash"
              ? "bg-[#383737] border-2 border-yellow-500 text-white"
              : "bg-[#1f1f1f] text-[#ababab]"
          } px-4 py-3 w-full rounded-lg font-semibold transition-all`}
        >
          Cash
        </button>

        <button
          onClick={handleOnlineCategoryClick}
          className={`${
            paymentCategory === "Online"
              ? "bg-[#383737] border-2 border-blue-500 text-white"
              : "bg-[#1f1f1f] text-[#ababab]"
          } px-4 py-3 w-full rounded-lg font-semibold flex items-center justify-center gap-2 transition-all`}
        >
          <span>Online</span>
          {onlineGateway && (
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-normal">
              {onlineGateway}
            </span>
          )}
        </button>
      </div>

      {/* Gateway Dropdown */}
      {showOnlineMenu && (
        <div className="mx-5 mt-3 p-3 bg-[#181818] border border-[#2e2e2e] rounded-xl space-y-3 transition-all">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => selectGateway("Safepay")}
              className={`p-3 rounded-lg border text-sm font-semibold ${
                onlineGateway === "Safepay" ? "bg-[#282828] border-blue-500 text-white" : "bg-[#1f1f1f] text-[#ababab]"
              }`}
            >
              Safepay
            </button>
            <button
              onClick={() => selectGateway("EasyPaisa")}
              className={`p-3 rounded-lg border text-sm font-semibold ${
                onlineGateway === "EasyPaisa" ? "bg-[#282828] border-green-500 text-white" : "bg-[#1f1f1f] text-[#ababab]"
              }`}
            >
              EasyPaisa
            </button>
          </div>

          {onlineGateway === "EasyPaisa" && (
            <input
              type="text"
              maxLength={11}
              placeholder="03001234567"
              value={easypaisaMobile}
              onChange={(e) => setEasypaisaMobile(e.target.value)}
              className="w-full bg-[#1f1f1f] border border-[#383737] rounded-lg px-3 py-2 text-white text-sm"
            />
          )}
        </div>
      )}

      {/* Action Buttons: Print Receipt + Place Order */}
      <div className="flex items-center gap-3 px-5 mt-4">
        <button
          onClick={handleDirectPrintReceipt}
          className="bg-[#3642ed] hover:bg-[#3663f8] px-4 py-3 w-full rounded-lg text-[#ffffff] font-bold text-lg transition"
        >
          Print Receipt
        </button>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="bg-[#f6b100] hover:bg-[#e0a200] px-4 py-3 w-full rounded-lg text-[#1f1f1f] font-bold text-lg transition"
        >
          {loading ? "Processing..." : `Place Order ${onlineGateway ? `(${onlineGateway})` : ""}`}
        </button>
      </div>

      {/* Invoice Modal */}
      <Invoice
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderData={placedOrderDetails}
      />
    </>
  );
};

export default Bill;