import { ObjectId } from "mongodb";
import z from "zod";

export const wishSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  currency: z.enum(["zar", "usd"]),
  description: z.string().min(1, "Description is required").max(36),
  priority: z.coerce.number().min(1).max(1000),
  date: z.coerce.date(),
  fulfilled: z.boolean(),
});
export type WishFormValues = z.infer<typeof wishSchema>;

export type Wish = {
  _id?: ObjectId;
  amount: number;
  currency: "zar" | "usd";
  description: string;
  priority: number;
  date: Date;
  fulfilled: boolean;
};

export interface WishResponse {
  id: string;
  amount: number;
  currency: "zar" | "usd";
  description: string;
  priority: number;
  date: string;
  fulfilled: boolean;
}

export function sanitizeWish(wish: Wish): WishResponse {
  return {
    id: wish._id!.toString(),
    amount: wish.amount,
    currency: wish.currency,
    description: wish.description,
    priority: wish.priority,
    date: wish.date.toISOString(),
    fulfilled: wish.fulfilled,
  };
}
