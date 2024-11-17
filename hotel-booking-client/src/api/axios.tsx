import axios from "axios";

const baseURL = "http://localhost:5125/api";

export const axiosInstance = axios.create({
  baseURL: baseURL,
});

export const axiosPrivateInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});