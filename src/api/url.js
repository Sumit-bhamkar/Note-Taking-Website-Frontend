import axios from "axios";

const BACKEND_URL = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export default BACKEND_URL;
