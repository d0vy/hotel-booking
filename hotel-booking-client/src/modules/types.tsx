export type Hotel = {
  id: string;
  name: string;
  description: string;
  address: string;
  hasPool: boolean;
  isClosed: boolean;
  imageUrl: string;
};

export type CreateHotel = {
  name: string;
  description: string;
  address: string;
  hasPool: boolean;
  image: File;
};

export type Room = {
  id: string;
  number: number;
  bedAmount: number;
  description: string;
};

export type CreateRoom = {
  number: number;
  bedAmount: number;
  description: string;
};

export type Comment = {
  id: string;
  text: string;
  createdAt: Date;
  userName: string;
};

export type CreateComment = {
  text: string;
};

export type LoginUser = {
  userName: string;
  password: string;
};

export type User = {
  userId: string;
  userName: string;
  groups: string[];
};

export type RegisterUser = {
  userName: string;
  email: string;
  password: string;
};
