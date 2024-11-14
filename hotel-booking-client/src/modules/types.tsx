export type Hotel = {
  id: string;
  name: string;
  description: string;
  address: string;
  hasPool: boolean;
  isClosed: boolean;
};

export type Room = {
  id: string;
  number: number;
  bedAmount: number;
  description: string;
};

export type Comment = {
  id: string;
  text: string;
  createdAt: Date;
};
