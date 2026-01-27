import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function sanitizeUser(user: User): UserResponse {
  return {
    id: user._id!.toString(),
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
