import axios from "axios";
import { Hotel, Room, Comment } from "../modules/types";
import { axiosInstance } from "./axios";

const APIHotelEndpoint = "/hotels";

export const getHotels = async () => {
  try {
    const response = await axiosInstance.get<Hotel[]>(APIHotelEndpoint);
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

export const getHotel = async (id: string) => {
  try {
    const response = await axiosInstance.get<Hotel>(
      APIHotelEndpoint + `/${id}`
    );
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

const APIRoomEndpoint = "/rooms";

export const getRooms = async (hotelId: string) => {
  try {
    const response = await axiosInstance.get<Room[]>(
      APIHotelEndpoint + `/${hotelId}` + APIRoomEndpoint
    );
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

export const getRoom = async (hotelId: string, roomId: string) => {
  try {
    const response = await axiosInstance.get<Room>(
      APIHotelEndpoint + `/${hotelId}` + APIRoomEndpoint + `/${roomId}`
    );
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

const APICommentEndpoint = "/comments";

export const getComments = async (hotelId: string, roomId: string) => {
  try {
    const response = await axiosInstance.get<Comment[]>(
      APIHotelEndpoint +
        `/${hotelId}` +
        APIRoomEndpoint +
        `/${roomId}` +
        APICommentEndpoint
    );
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
