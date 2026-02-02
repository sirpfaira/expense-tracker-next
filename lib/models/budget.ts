import { ObjectId } from "mongodb";
import z from "zod";

export const budgetExpenseInputSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  currency: z.enum(["zar", "usd"]),
  description: z.string().min(1, "Description is required").max(36),
});
export type BudgetExpenseInput = z.infer<typeof budgetExpenseInputSchema>;

export const budgetExpenseSchema = budgetExpenseInputSchema.extend({
  period: z
    .string()
    .min(1, "Period is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD"), //2026-01-01
});
export type BudgetExpenseFormValues = z.infer<typeof budgetExpenseSchema>;

export interface DeleteBudgetInput extends BudgetExpenseFormValues {
  id: string;
}

export interface Budget {
  _id?: ObjectId;
  period: string;
  expenses: BudgetExpense[];
}

export type BudgetExpense = {
  _id?: ObjectId;
  category: string;
  amount: number;
  currency: "zar" | "usd";
  description: string;
};

export interface BudgetResponse {
  id: string;
  period: string;
  expenses: BudgetExpense[];
}

export function sanitizeBudget(budget: Budget): BudgetResponse {
  return {
    id: budget._id!.toString(),
    period: budget.period,
    expenses: budget.expenses,
  };
}
