import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5125/api",
});
