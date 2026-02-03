import { ObjectId } from "mongodb";
import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  shortCode: z
    .string()
    .min(3, "3+ chars required")
    .max(8, "Max 8 chars")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Short code can only contain letters, numbers, and underscores",
    ),
  type: z.enum(["bank", "cash", "savings"]),
  currency: z.enum(["zar", "usd"]),
  balance: z.coerce.number(),
  showInReports: z.boolean(),
});
export type AccountFormValues = z.infer<typeof accountSchema>;

export const transferSchema = z.object({
  from: z.string().min(1, "From is required"),
  to: z.string().min(1, "To is required"),
  amount: z.coerce.number(),
  currency: z.enum(["zar", "usd"]),
  date: z.coerce.date(),
});
export type AccountTransferValues = z.infer<typeof transferSchema>;
export type TransferInput = {
  date: string;
  currency: "zar" | "usd";
  from: string;
  to: string;
  amount: number;
};

export type AccountType = "bank" | "cash" | "savings";
export type AccountCurrency = "zar" | "usd";

export interface Account {
  _id?: ObjectId;
  name: string;
  shortCode: string;
  type: AccountType;
  currency: AccountCurrency;
  balance: number;
  showInReports: boolean;
}

export interface AccountResponse {
  id: string;
  name: string;
  shortCode: string;
  type: AccountType;
  currency: AccountCurrency;
  balance: number;
  showInReports: boolean;
}

export function sanitizeAccount(account: Account): AccountResponse {
  return {
    id: account._id!.toString(),
    name: account.name,
    shortCode: account.shortCode,
    type: account.type,
    currency: account.currency,
    balance: account.balance,
    showInReports: account.showInReports,
  };
}

export const ACCOUNT_TYPES: AccountType[] = ["bank", "cash", "savings"];
export const ACCOUNT_CURRENCIES: AccountCurrency[] = ["zar", "usd"];
