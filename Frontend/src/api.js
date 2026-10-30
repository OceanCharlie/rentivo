import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

const api = axios.create({ baseURL: `${API_URL}/api`, withCredentials: true });

// The backend answers some errors with 4xx; normalize them to { success, message }
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("user")) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.resolve({
      data: { success: false, message: error.response?.data?.message || "Tidak dapat terhubung ke server" },
    });
  }
);

export const imageUrl = (property) =>
  property?.propertyImage?.[0]?.path ? `${API_URL}${property.propertyImage[0].path}` : null;

export const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount || 0);

export const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-";

export default api;
