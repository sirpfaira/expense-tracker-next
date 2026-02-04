import { ObjectId } from "mongodb";
import { z } from "zod";
import { AccountCurrency } from "./account";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense", "transfer"]),
  category: z.string().min(1, "Category is required"),
  account: z.string().min(1, "Account is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(1, "Description is required").max(36),
  date: z.coerce.date(),
});

export const dbTransactionSchema = z.object({
  type: z.enum(["income", "expense", "transfer"]),
  category: z.string().min(1, "Category is required"),
  account: z.string().min(1, "Account is required"),
  currency: z.enum(["usd", "zar"]),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(1, "Description is required").max(36),
  date: z.coerce.date(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

export type TransactionType = "income" | "expense" | "transfer";

export interface TransactionInput {
  type: TransactionType;
  category: string;
  account: string;
  currency: AccountCurrency;
  amount: number;
  description: string;
  date: string;
}

export interface Transaction {
  _id?: ObjectId;
  username: string;
  type: TransactionType;
  category: string;
  account: string;
  currency: AccountCurrency;
  amount: number;
  description: string;
  date: Date;
}

export interface TransactionResponse {
  id: string;
  username: string;
  type: TransactionType;
  category: string;
  account: string;
  currency: AccountCurrency;
  amount: number;
  description: string;
  date: string;
}

export function sanitizeTransaction(
  transaction: Transaction,
): TransactionResponse {
  return {
    id: transaction._id!.toString(),
    username: transaction.username,
    type: transaction.type,
    category: transaction.category,
    account: transaction.account,
    currency: transaction.currency,
    amount: transaction.amount,
    description: transaction.description,
    date: transaction.date.toISOString(),
  };
}
