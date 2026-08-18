// src/components/invoice/Invoice.jsx
import React, { useRef } from "react";

const Invoice = ({ isOpen, onClose, orderData }) => {
  const receiptRef = useRef(null);

  if (!isOpen || !orderData) return null;

  const { customerDetails, items, bills, paymentMethod } = orderData;

  const handlePrint = () => {
    const printContent = receiptRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=400,height=750");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            @page { size: 80mm auto; margin: 0; }
            body {
              font-family: 'Courier New', Courier, monospace;
              width: 290px;
              margin: 0 auto;
              padding: 20px 12px;
              color: #000;
              background: #fff;
              font-size: 12px;
              line-height: 1.4;
            }
            .header { text-align: center; margin-bottom: 16px; }
            .restaurant-name { font-size: 20px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
            .info-line { font-size: 11px; color: #444; margin-top: 3px; }
            .divider { border-bottom: 1px dashed #000; margin: 12px 0; }
            .meta-table, .item-table, .totals-table { width: 100%; font-size: 11px; border-collapse: collapse; }
            .meta-table td, .totals-table td { padding: 3px 0; }
            .item-table { margin: 10px 0; }
            .item-table th { text-align: left; border-bottom: 1px solid #000; padding-bottom: 6px; font-weight: bold; }
            .item-table td { padding: 6px 0; vertical-align: top; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .grand-total {
              font-size: 14px;
              font-weight: bold;
              border-top: 1px dashed #000;
              border-bottom: 1px dashed #000;
            }
            .grand-total td { padding: 8px 0 !important; }
            .footer { text-align: center; margin-top: 18px; font-size: 11px; color: #333; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#18181b] text-white w-full max-w-lg rounded-2xl border border-[#27272a] shadow-2xl flex flex-col overflow-hidden transform transition-all">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#27272a] bg-[#121215]">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">Order Successful</h2>
              <p className="text-xs text-gray-400">Receipt generated and ready to print</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white hover:bg-[#27272a] rounded-lg p-1.5 transition-all text-lg font-bold"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Invoice Body (Styled as Thermal Paper Slip) */}
        <div className="p-6 overflow-y-auto max-h-[65vh] bg-[#121215]">
          <div 
            ref={receiptRef}
            className="bg-white text-gray-900 font-mono p-6 rounded-xl shadow-inner border border-gray-200 tracking-tight"
          >
            {/* Header Section */}
            <div className="header text-center">
              <h1 className="restaurant-name text-xl font-extrabold tracking-wider text-black">
                POS RESTAURANT
              </h1>
              <p className="info-line text-xs text-gray-600 font-medium tracking-normal mt-1">
                Official Customer Order Receipt
              </p>
              <p className="info-line text-[11px] text-gray-500 mt-1">
                {new Date().toLocaleString(undefined, { 
                  dateStyle: 'medium', 
                  timeStyle: 'short' 
                })}
              </p>
            </div>

            <div className="divider my-4 border-b border-dashed border-gray-400" />

            {/* Order Details Metadata */}
            <table className="meta-table w-full text-xs">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-1.5 text-gray-500 font-medium">Customer</td>
                  <td className="py-1.5 text-right font-semibold text-gray-800">
                    {customerDetails?.name || "Walk-in Customer"}
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-gray-500 font-medium">Phone</td>
                  <td className="text-right py-1.5 font-semibold text-gray-800">
                    {customerDetails?.phone || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-gray-500 font-medium">Order Type</td>
                  <td className="text-right py-1.5 font-semibold text-gray-800">
                    <span className="inline-block bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      {customerDetails?.orderType || "Dine in"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-gray-500 font-medium">Table No</td>
                  <td className="text-right py-1.5 font-bold text-gray-900">
                    {customerDetails?.tableNo ? `Table ${customerDetails.tableNo}` : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-gray-500 font-medium">Payment Method</td>
                  <td className="text-right py-1.5 font-semibold text-gray-800">
                    {paymentMethod || "Cash"}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="divider my-4 border-b border-dashed border-gray-400" />

            {/* Order Items Table */}
            <table className="item-table w-full text-xs">
              <thead>
                <tr className="border-b-2 border-gray-800 text-gray-700">
                  <th className="py-2 text-left font-bold uppercase text-[10px] tracking-wider">Item</th>
                  <th className="py-2 text-center font-bold uppercase text-[10px] tracking-wider">Qty</th>
                  <th className="py-2 text-right font-bold uppercase text-[10px] tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items?.map((item, index) => (
                  <tr key={index} className="text-gray-800">
                    <td className="py-2.5 font-medium pr-2">{item.name}</td>
                    <td className="py-2.5 text-center font-bold text-gray-600">{item.quantity || 1}</td>
                    <td className="py-2.5 text-right font-semibold">
                      PKR {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="divider my-4 border-b border-dashed border-gray-400" />

            {/* Totals Section */}
            <table className="totals-table w-full text-xs space-y-1">
              <tbody>
                <tr>
                  <td className="py-1 text-gray-600">Subtotal</td>
                  <td className="py-1 text-right font-medium text-gray-800">
                    PKR {(bills?.total || 0).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Tax (5.25%)</td>
                  <td className="py-1 text-right font-medium text-gray-800">
                    PKR {(bills?.tax || 0).toFixed(2)}
                  </td>
                </tr>
                <tr className="grand-total border-y-2 border-dashed border-gray-800">
                  <td className="py-3 font-extrabold text-sm text-black">Grand Total</td>
                  <td className="py-3 text-right font-extrabold text-sm text-black">
                    PKR {(bills?.totalWithTax || 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Footer */}
            <div className="footer text-center mt-6 pt-2">
              <p className="text-xs font-bold text-gray-800">Thank you for dining with us!</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Please visit us again</p>
            </div>
          </div>
        </div>

        {/* Footer Actions / Buttons */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-[#27272a] bg-[#18181b]">
          <button
            onClick={onClose}
            className="w-full bg-[#27272a] hover:bg-[#3f3f46] text-gray-300 hover:text-white font-medium py-3 rounded-xl transition-all duration-200 text-sm tracking-wide"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="w-full bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold py-3 rounded-xl transition-all duration-200 text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 active:scale-[0.98]"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
            </svg>
            Print Receipt
          </button>
        </div>

      </div>
    </div>
  );
};

export default Invoice;