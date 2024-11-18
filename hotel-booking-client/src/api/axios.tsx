import axios from "axios";

export const baseURL = "https://hotelbookingapi2024.azurewebsites.net/"; //change to localhost

const baseURL_API = baseURL + "/api";

export const axiosInstance = axios.create({
  baseURL: baseURL_API,
});

export const axiosPrivateInstance = axios.create({
  baseURL: baseURL_API,
  withCredentials: true,
});
