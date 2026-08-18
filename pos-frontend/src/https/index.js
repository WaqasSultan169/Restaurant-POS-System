import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ==========================================
// User Authentication Endpoints
// ==========================================
export const login = (data) => api.post("/api/user/login", data);
export const register = (data) => api.post("/api/user/register", data);
export const getUserData = () => api.get("/api/user");
export const logout = () => api.post("/api/user/logout");

// ==========================================
// Order Endpoints
// ==========================================
export const addOrder = (data) => api.post("/api/order", data); // ✅ Fixed: api.post
export const getOrders = () => api.get("/api/order");          // ✅ Fixed: api.get
export const updateOrderStatus = ({ orderId, orderStatus }) =>
  api.put(`/api/order/${orderId}`, { orderStatus });           // ✅ Fixed: api.put

// ==========================================
// Table Endpoints
// ==========================================
export const addTable = (data) => api.post("/api/table", data);
export const getTables = () => api.get("/api/table");

// ==========================================
// Payment Endpoints (New)
// ==========================================
export const createSafepayOrder = (data) =>
  api.post("/api/payment/safepay/create-order", data);

export const createEasypaisaOrder = (data) =>
  api.post("/api/payment/easypaisa/create-order", data);

export default api;