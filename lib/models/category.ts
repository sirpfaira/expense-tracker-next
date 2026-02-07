import { ObjectId } from "mongodb";

export type CategoryType = "income" | "expense";

export interface Category {
  _id?: ObjectId;
  name: string;
  uid: string;
  type: CategoryType;
  icon: string;
  color: string;
  isDefault: boolean;
}

export interface CategoryResponse {
  id: string;
  name: string;
  uid: string;
  type: CategoryType;
  icon: string;
  color: string;
  isDefault: boolean;
}

export function sanitizeCategory(category: Category): CategoryResponse {
  return {
    id: category._id!.toString(),
    name: category.name,
    uid: category.uid,
    type: category.type,
    icon: category.icon,
    color: category.color,
    isDefault: category.isDefault,
  };
}

export const DEFAULT_CATEGORIES: Omit<Category, "_id">[] = [
  // Expense categories
  {
    name: "Transaction Charges",
    uid: "exp-transaction-charges",
    type: "expense",
    icon: "circle-dollar-sign",
    color: "#6366f1",
    isDefault: true,
  },
  {
    name: "Groceries",
    uid: "exp-groceries",
    type: "expense",
    icon: "shopping-basket",
    color: "#ef4444",
    isDefault: true,
  },
  {
    name: "Transportation",
    uid: "exp-transportation",
    type: "expense",
    icon: "car",
    color: "#f97316",
    isDefault: true,
  },
  {
    name: "Entertainment",
    uid: "exp-entertainment",
    type: "expense",
    icon: "film",
    color: "#a855f7",
    isDefault: true,
  },
  {
    name: "Utilities",
    uid: "exp-utilities",
    type: "expense",
    icon: "zap",
    color: "#eab308",
    isDefault: true,
  },
  {
    name: "Healthcare",
    uid: "exp-healthcare",
    type: "expense",
    icon: "heart-pulse",
    color: "#ec4899",
    isDefault: true,
  },
  {
    name: "Shopping",
    uid: "exp-shopping",
    type: "expense",
    icon: "shopping-bag",
    color: "#06b6d4",
    isDefault: true,
  },
  {
    name: "Education",
    uid: "exp-education",
    type: "expense",
    icon: "graduation-cap",
    color: "#8b5cf6",
    isDefault: true,
  },
  {
    name: "Furniture",
    uid: "exp-furniture",
    type: "expense",
    icon: "sofa",
    color: "#8c5df6",
    isDefault: true,
  },
  {
    name: "Church",
    uid: "exp-church",
    type: "expense",
    icon: "church",
    color: "#8e4df6",
    isDefault: true,
  },
  {
    name: "Family",
    uid: "exp-family",
    type: "expense",
    icon: "gift",
    color: "#f43f5e",
    isDefault: true,
  },
  {
    name: "Telecommunications",
    uid: "exp-telecommunications",
    type: "expense",
    icon: "wifi",
    color: "#f48f5e",
    isDefault: true,
  },
  {
    name: "Business",
    uid: "exp-business",
    type: "expense",
    icon: "briefcase-business",
    color: "#14b8a6",
    isDefault: true,
  },
  // Income categories
  {
    name: "Salary",
    uid: "inc-salary",
    type: "income",
    icon: "briefcase",
    color: "#22c55e",
    isDefault: true,
  },
  {
    name: "Side Hustle",
    uid: "inc-side-hustle",
    type: "income",
    icon: "laptop",
    color: "#10b981",
    isDefault: true,
  },
  {
    name: "Business",
    uid: "inc-business",
    type: "income",
    icon: "briefcase-business",
    color: "#14b8a6",
    isDefault: true,
  },
  {
    name: "Gift",
    uid: "inc-gift",
    type: "income",
    icon: "gift",
    color: "#f43f5e",
    isDefault: true,
  },
];

export const ICON_OPTIONS = [
  "utensils",
  "car",
  "film",
  "zap",
  "heart-pulse",
  "shopping-bag",
  "graduation-cap",
  "plane",
  "briefcase",
  "laptop",
  "trending-up",
  "gift",
  "plus-circle",
  "minus-circle",
  "home",
  "phone",
  "wifi",
  "music",
  "gamepad-2",
  "dumbbell",
  "coffee",
  "beer",
  "pizza",
  "shirt",
  "scissors",
  "palette",
  "book",
  "newspaper",
  "piggy-bank",
  "shopping-basket",
  "briefcase-business",
  "church",
  "sofa",
  "circle-dollar-sign",
];

export const COLOR_OPTIONS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#64748b",
];

export interface CategoryFormData {
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
}
