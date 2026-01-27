import { ObjectId } from "mongodb";

export type CategoryType = "income" | "expense";

export interface Category {
  _id?: ObjectId;
  userId: ObjectId;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryResponse {
  id: string;
  userId: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export function sanitizeCategory(category: Category): CategoryResponse {
  return {
    id: category._id!.toString(),
    userId: category.userId.toString(),
    name: category.name,
    type: category.type,
    icon: category.icon,
    color: category.color,
    isDefault: category.isDefault,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

export const DEFAULT_CATEGORIES: Omit<Category, "_id" | "userId" | "createdAt" | "updatedAt">[] = [
  // Expense categories
  { name: "Food & Dining", type: "expense", icon: "utensils", color: "#ef4444", isDefault: true },
  { name: "Transportation", type: "expense", icon: "car", color: "#f97316", isDefault: true },
  { name: "Entertainment", type: "expense", icon: "film", color: "#a855f7", isDefault: true },
  { name: "Utilities", type: "expense", icon: "zap", color: "#eab308", isDefault: true },
  { name: "Healthcare", type: "expense", icon: "heart-pulse", color: "#ec4899", isDefault: true },
  { name: "Shopping", type: "expense", icon: "shopping-bag", color: "#06b6d4", isDefault: true },
  { name: "Education", type: "expense", icon: "graduation-cap", color: "#8b5cf6", isDefault: true },
  { name: "Travel", type: "expense", icon: "plane", color: "#0ea5e9", isDefault: true },
  // Income categories
  { name: "Salary", type: "income", icon: "briefcase", color: "#22c55e", isDefault: true },
  { name: "Freelance", type: "income", icon: "laptop", color: "#10b981", isDefault: true },
  { name: "Investment", type: "income", icon: "trending-up", color: "#14b8a6", isDefault: true },
  { name: "Gift", type: "income", icon: "gift", color: "#f43f5e", isDefault: true },
  { name: "Other Income", type: "income", icon: "plus-circle", color: "#6366f1", isDefault: true },
  { name: "Other Expense", type: "expense", icon: "minus-circle", color: "#64748b", isDefault: true },
];

export const ICON_OPTIONS = [
  "utensils", "car", "film", "zap", "heart-pulse", "shopping-bag",
  "graduation-cap", "plane", "briefcase", "laptop", "trending-up",
  "gift", "plus-circle", "minus-circle", "home", "phone", "wifi",
  "music", "gamepad-2", "dumbbell", "coffee", "beer", "pizza",
  "shirt", "scissors", "palette", "book", "newspaper", "piggy-bank",
];

export const COLOR_OPTIONS = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
  "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#64748b",
];
