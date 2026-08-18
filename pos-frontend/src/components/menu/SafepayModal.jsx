import React from "react";

const SafepayModal = ({ isOpen, checkoutUrl, onClose }) => {
  if (!isOpen || !checkoutUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-[#181818] border border-[#2e2e2e] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2e2e2e] bg-[#1f1f1f]">
          <h2 className="text-white font-semibold text-lg flex items-center gap-2">
            <span>💳</span> Safepay Secure Payment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg font-bold px-2 py-1 rounded-md hover:bg-[#2e2e2e] transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Body (Safepay Embedded iFrame) */}
        <div className="w-full h-[550px] bg-white">
          <iframe
            src={checkoutUrl}
            title="Safepay Checkout"
            className="w-full h-full border-0"
            allow="payment"
          />
        </div>
      </div>
    </div>
  );
};

export default SafepayModal;