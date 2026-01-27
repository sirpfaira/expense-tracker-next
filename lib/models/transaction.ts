import { ObjectId } from "mongodb";

export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "food"
  | "transportation"
  | "entertainment"
  | "utilities"
  | "healthcare"
  | "shopping"
  | "salary"
  | "freelance"
  | "investment"
  | "other";

export interface Transaction {
  _id?: ObjectId;
  userId: ObjectId;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionResponse {
  id: string;
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export function sanitizeTransaction(transaction: Transaction): TransactionResponse {
  return {
    id: transaction._id!.toString(),
    userId: transaction.userId.toString(),
    type: transaction.type,
    category: transaction.category,
    amount: transaction.amount,
    description: transaction.description,
    date: transaction.date.toISOString(),
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
  };
}

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  food: "Food & Dining",
  transportation: "Transportation",
  entertainment: "Entertainment",
  utilities: "Utilities",
  healthcare: "Healthcare",
  shopping: "Shopping",
  salary: "Salary",
  freelance: "Freelance",
  investment: "Investment",
  other: "Other",
};

export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  "food",
  "transportation",
  "entertainment",
  "utilities",
  "healthcare",
  "shopping",
  "other",
];

export const INCOME_CATEGORIES: TransactionCategory[] = [
  "salary",
  "freelance",
  "investment",
  "other",
];
