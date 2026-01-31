import { ObjectId } from "mongodb";
import z from "zod";

export const budgetSchema = z.object({
  period: z.coerce.number().positive("Period must be a positive number"),
  expenses: z.array(
    z.object({
      category: z.string().min(1, "Category is required"),
      amount: z.coerce.number().positive("Amount must be a positive number"),
    }),
  ),
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;

export interface Budget {
  _id?: ObjectId;
  period: number;
  expenses: BudgetExpense[];
}

export type BudgetExpense = {
  _id?: ObjectId;
  category: string;
  amount: number;
};

export interface BudgetResponse {
  id: string;
  period: number;
  expenses: BudgetExpense[];
}

export function sanitizeBudget(budget: Budget): BudgetResponse {
  return {
    id: budget._id!.toString(),
    period: budget.period,
    expenses: budget.expenses,
  };
}
