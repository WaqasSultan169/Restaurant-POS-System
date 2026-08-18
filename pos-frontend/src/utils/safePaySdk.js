// Function to dynamically load Safepay Checkout SDK script
export const loadSafepaySDK = (environment = "sandbox") => {
  return new Promise((resolve, reject) => {
    if (window.Safepay) {
      return resolve(window.Safepay);
    }

    const script = document.createElement("script");
    script.src =
      environment === "production"
        ? "https://api.getsafepay.com/checkout.js"
        : "https://sandbox.api.getsafepay.com/checkout.js";

    script.onload = () => {
      if (window.Safepay) {
        resolve(window.Safepay);
      } else {
        reject(new Error("Safepay SDK loaded but global Safepay object not found"));
      }
    };

    script.onerror = () => {
      reject(new Error("Failed to load Safepay SDK script"));
    };

    document.head.appendChild(script);
  });
};