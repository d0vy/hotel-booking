import axios from "axios";
import {
  Hotel,
  Room,
  Comment,
  CreateHotel,
  CreateRoom,
  CreateComment,
} from "../modules/types";
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

export const createHotel = async (hotel: FormData) => {
  try {
    const response = await axiosInstance.post(APIHotelEndpoint, hotel);
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

export const updateHotel = async (hotelId: string, hotel: FormData) => {
  try {
    const response = await axiosInstance.put(
      APIHotelEndpoint + `/${hotelId}`,
      hotel
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

export const deleteHotel = async (hotelId: string) => {
  try {
    await axiosInstance.delete(APIHotelEndpoint + `/${hotelId}`);
    return "success";
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

export const createRoom = async (hotelId: string, room: CreateRoom) => {
  try {
    const response = await axiosInstance.post(
      APIHotelEndpoint + `/${hotelId}` + APIRoomEndpoint,
      room
    );
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

export const updateRoom = async (
  hotelId: string,
  roomId: string,
  room: CreateRoom
) => {
  try {
    const response = await axiosInstance.put(
      APIHotelEndpoint + `/${hotelId}` + APIRoomEndpoint + `/${roomId}`,
      room
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

export const deleteRoom = async (hotelId: string, roomId: string) => {
  try {
    await axiosInstance.delete(
      APIHotelEndpoint + `/${hotelId}` + APIRoomEndpoint + `/${roomId}`
    );
    return "success";
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

export const createComment = async (
  hotelId: string,
  roomId: string,
  comment: CreateComment
) => {
  try {
    const response = await axiosInstance.post(
      APIHotelEndpoint +
        `/${hotelId}` +
        APIRoomEndpoint +
        `/${roomId}` +
        APICommentEndpoint,
      comment
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

export const updateComment = async (
  hotelId: string,
  roomId: string,
  commentId: string,
  comment: CreateComment
) => {
  try {
    const response = await axiosInstance.put(
      APIHotelEndpoint +
        `/${hotelId}` +
        APIRoomEndpoint +
        `/${roomId}` +
        APICommentEndpoint +
        `/${commentId}`,
      comment
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

export const deleteComment = async (
  hotelId: string,
  roomId: string,
  commentId: string
) => {
  try {
    const response = await axiosInstance.delete(
      APIHotelEndpoint +
        `/${hotelId}` +
        APIRoomEndpoint +
        `/${roomId}` +
        APICommentEndpoint +
        `/${commentId}`
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
