import { ObjectId } from "mongodb";

export type BudgetPeriod = "weekly" | "monthly" | "yearly";

export interface Budget {
  _id?: ObjectId;
  userId: ObjectId;
  categoryId: ObjectId | null;
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetResponse {
  id: string;
  userId: string;
  categoryId: string | null;
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetWithSpending extends BudgetResponse {
  spent: number;
  remaining: number;
  percentage: number;
}

export function sanitizeBudget(budget: Budget): BudgetResponse {
  return {
    id: budget._id!.toString(),
    userId: budget.userId.toString(),
    categoryId: budget.categoryId?.toString() || null,
    name: budget.name,
    amount: budget.amount,
    period: budget.period,
    startDate: budget.startDate.toISOString(),
    isActive: budget.isActive,
    createdAt: budget.createdAt.toISOString(),
    updatedAt: budget.updatedAt.toISOString(),
  };
}

export function getPeriodDateRange(period: BudgetPeriod, startDate: Date): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(startDate);
  let end = new Date(startDate);

  switch (period) {
    case "weekly":
      // Find current week's start based on original start date
      while (end <= now) {
        start.setTime(end.getTime());
        end.setDate(end.getDate() + 7);
      }
      start.setDate(start.getDate() - 7);
      break;
    case "monthly":
      // Find current month's start based on original start date
      start.setFullYear(now.getFullYear(), now.getMonth(), startDate.getDate());
      if (start > now) {
        start.setMonth(start.getMonth() - 1);
      }
      end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      break;
    case "yearly":
      // Find current year's start based on original start date
      start.setFullYear(now.getFullYear(), startDate.getMonth(), startDate.getDate());
      if (start > now) {
        start.setFullYear(start.getFullYear() - 1);
      }
      end = new Date(start);
      end.setFullYear(end.getFullYear() + 1);
      break;
  }

  return { start, end };
}

export const PERIOD_LABELS: Record<BudgetPeriod, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};
