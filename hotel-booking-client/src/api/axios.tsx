import axios from "axios";

export const baseURL = "http://localhost:5125";

const baseURL_API = "http://localhost:5125/api";

export const axiosInstance = axios.create({
  baseURL: baseURL_API,
});

export const axiosPrivateInstance = axios.create({
  baseURL: baseURL_API,
  withCredentials: true,
});