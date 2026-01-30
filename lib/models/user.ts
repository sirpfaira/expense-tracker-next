import { ObjectId } from "mongodb";
import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6).max(64),
    inviteCode: z.string().min(1, "Invitation code is required"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  });
export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  role: string;
  currency: "usd" | "zar";
}

export interface UserResponse {
  id: string;
  name: string;
  role: string;
  currency: "usd" | "zar";
}

export function sanitizeUser(user: User): UserResponse {
  return {
    id: user._id!.toString(),
    name: user.name,
    role: user.role,
    currency: user.currency,
  };
}
