import z from "zod";
import { ObjectId } from "mongodb";

export const currencySchema = z.object({
  currency: z.enum(["usd", "zar"]),
});

export type CurrencyFormValues = z.infer<typeof currencySchema>;

export interface Rate {
  _id?: ObjectId;
  base: string;
  target: string;
  value: number;
  date: Date;
}

export interface RateResponse {
  id: string;
  base: string;
  target: string;
  value: number;
  date: string;
}

export function sanitizeRate(rate: Rate): RateResponse {
  return {
    id: rate._id!.toString(),
    base: rate.base,
    target: rate.target,
    value: rate.value,
    date: rate.date.toISOString(),
  };
}
