import axios from "axios";

// In development the Vite proxy forwards /api/* to localhost:4000, so baseURL is "".
// In production set VITE_API_BASE_URL to your deployed API origin.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || ""
});

// Holds a reference to the Redux store. Populated by injectStore() which is
// called from main.jsx AFTER the store is created. This breaks the circular
// dependency:  store → authSlice → axios → store
let _store;
export const injectStore = (store) => {
  _store = store;
};

api.interceptors.request.use((config) => {
  const token = _store?.getState().auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getApiError = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

export default api;
