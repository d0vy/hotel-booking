import axios from "axios";
import { axiosInstance, axiosPrivateInstance } from "../axios";

const APIAccessTokenEndpoint = "/accessToken";

export const getUserToken = async () => {
  try {
    const response = await axiosPrivateInstance.post(APIAccessTokenEndpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.message);
      return null;
    } else {
      console.log(error);
      return null;
    }
  }
};

const APIRegisterEndpoint = "/accounts";

export const register = async (
  userName: string,
  email: string,
  password: string
) => {
  const user = {
    userName: userName,
    email: email,
    password: password,
  };

  try {
    const response = await axiosInstance.post(APIRegisterEndpoint, user);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
      return error.response?.data;
    } else {
      console.log(error);
      return null;
    }
  }
};

const APILoginEndpoint = "/login";

export const login = async (userName: string, password: string) => {
  const user = {
    userName: userName,
    password: password,
  };

  try {
    const response = await axiosPrivateInstance.post(APILoginEndpoint, user);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
      return error.response?.data;
    } else {
      console.log(error);
      return null;
    }
  }
};

const APILogoutEndpoint = "/logout";

export const logout = async () => {
  try {
    const response = await axiosPrivateInstance.post(APILogoutEndpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.message);
      return null;
    } else {
      console.log(error);
      return null;
    }
  }
};
