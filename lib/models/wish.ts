import { ObjectId } from "mongodb";
import z from "zod";

export const wishSchema = z.object({
  amount: z.coerce.number().positive("Amount must be a positive number"),
  currency: z.enum(["zar", "usd"]),
  description: z.string().min(1, "Description is required").max(36),
  fulfilled: z.boolean(),
});
export type WishFormValues = z.infer<typeof wishSchema>;

export type Wish = {
  _id?: ObjectId;
  amount: number;
  currency: "zar" | "usd";
  description: string;
  fulfilled: boolean;
};

export interface WishResponse {
  id: string;
  amount: number;
  currency: "zar" | "usd";
  description: string;
  fulfilled: boolean;
}

export function sanitizeWish(wish: Wish): WishResponse {
  return {
    id: wish._id!.toString(),
    amount: wish.amount,
    currency: wish.currency,
    description: wish.description,
    fulfilled: wish.fulfilled,
  };
}
