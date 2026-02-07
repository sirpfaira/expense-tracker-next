"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatCategory,
  convertAndFormat,
  convertAmount,
  formatCurrency,
} from "@/lib/utils";
import { TransactionResponse } from "@/lib/models/transaction";
import { UserResponse } from "@/lib/models/user";
import { RateResponse } from "@/lib/models/summary";
import { CategoryResponse } from "@/lib/models/category";
import {
  PieChart as PieChartIcon,
  TrendingDown,
  Calendar,
  ArrowUp,
  ArrowDown,
  Utensils,
  Car,
  Film,
  Zap,
  HeartPulse,
  ShoppingBag,
  GraduationCap,
  Plane,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  PlusCircle,
  MinusCircle,
  Home,
  Phone,
  Wifi,
  Music,
  Gamepad2,
  Dumbbell,
  Coffee,
  Beer,
  Pizza,
  Shirt,
  Scissors,
  Palette,
  Book,
  Newspaper,
  PiggyBank,
  LucideIcon,
  ShoppingBasket,
  BriefcaseBusiness,
  Sofa,
  Church,
  CircleDollarSign,
} from "lucide-react";

type ReportsMobileViewProps = {
  transactions: TransactionResponse[];
  categories: CategoryResponse[];
  user: UserResponse;
  rate: RateResponse;
};

export default function ReportsMobileView({
  transactions,
  categories,
  user,
  rate,
}: ReportsMobileViewProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    const now = new Date();
    const cutoffDate = new Date();

    switch (timeRange) {
      case "7d":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
        return transactions;
    }

    return transactions.filter((t) => new Date(t.date) >= cutoffDate);
  }, [transactions, timeRange]);

  const income = useMemo(() => {
    const expensesByCategory: Record<string, number> = {};

    filteredTransactions
      .filter((t) => t.type === "income")
      .forEach((t) => {
        expensesByCategory[t.category] =
          (expensesByCategory[t.category] || 0) +
          convertAmount(t.amount, t.currency, user.currency, rate);
      });

    return Object.entries(expensesByCategory)
      .map(([name, value], index) => ({
        name,
        value,
        type: "income",
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const expenses = useMemo(() => {
    const expensesByCategory: Record<string, number> = {};

    filteredTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        expensesByCategory[t.category] =
          (expensesByCategory[t.category] || 0) +
          convertAmount(t.amount, t.currency, user.currency, rate);
      });

    return Object.entries(expensesByCategory)
      .map(([name, value], index) => ({
        name,
        value,
        type: "expense",
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const totalIncome = income.reduce((sum, t) => sum + t.value, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.value, 0);
  const netCashflow = totalIncome - totalExpenses;

  return (
    <div className="flex flex-col p-2 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">
            Analyze your spending patterns and trends
          </p>
        </div>
        <Select
          value={timeRange}
          onValueChange={(v) => setTimeRange(v as TimeRange)}
        >
          <SelectTrigger className="w-full md:w-40">
            <Calendar className="size-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="size-5" />
            Summary
          </CardTitle>
          <CardDescription>Summary of income and expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between w-full px-2 py-3 bg-card rounded-xl border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-full text-green-500">
                  <ArrowUp className="size-6" />
                </div>
                <div>
                  <p className="font-medium">Total Income</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>
                      {
                        filteredTransactions.filter((t) => t.type === "income")
                          .length
                      }
                    </span>
                    <span>transactions</span>
                  </div>
                </div>
              </div>
              <h3 className="px-2 text-2xl font-bold text-green-600">
                {convertAndFormat(
                  totalIncome,
                  user.currency,
                  user.currency,
                  rate,
                )}
              </h3>
            </div>
            <div className="flex items-center justify-between w-full px-2 py-3 bg-card rounded-xl border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-full text-destructive">
                  <ArrowDown className="size-6" />
                </div>
                <div>
                  <p className="font-medium">Total Expenses</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>
                      {
                        filteredTransactions.filter((t) => t.type === "expense")
                          .length
                      }
                    </span>
                    <span>transactions</span>
                  </div>
                </div>
              </div>
              <h3 className="px-2 text-2xl font-bold text-destructive">
                {convertAndFormat(
                  totalExpenses,
                  user.currency,
                  user.currency,
                  rate,
                )}
              </h3>
            </div>
            <div className="flex items-center justify-between w-full px-2 py-3 bg-card rounded-xl border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-full text-destructive">
                  {netCashflow >= 0 ? (
                    <TrendingUp className="size-6 text-green-600" />
                  ) : (
                    <TrendingDown className="size-6 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="font-medium">Net Cashflow</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {netCashflow >= 0 ? "Positive" : "Negative"} cash flow
                  </div>
                </div>
              </div>
              <h3
                className={`text-2xl px-2 font-bold ${netCashflow >= 0 ? "text-green-600" : "text-destructive"}`}
              >
                {convertAndFormat(
                  Math.abs(netCashflow),
                  user.currency,
                  user.currency,
                  rate,
                )}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="size-5" />
            Income by Category
          </CardTitle>
          <CardDescription>
            Distribution of income across categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {expenses.length > 0 ? (
            <div className="flex flex-col divide-y border-y my-1">
              {income.map((expense, index) => (
                <CategoryCard
                  key={index}
                  item={expense}
                  categories={categories}
                  user={user}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-75 text-muted-foreground">
              No expense data available
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="size-5" />
            Expenses by Category
          </CardTitle>
          <CardDescription>
            Distribution of spending across categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {expenses.length > 0 ? (
            <div className="flex flex-col divide-y border-y my-1">
              {expenses.map((expense, index) => (
                <CategoryCard
                  key={index}
                  item={expense}
                  categories={categories}
                  user={user}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-75 text-muted-foreground">
              No expense data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
type CategoryCardProps = {
  item: CategoryItem;
  categories: CategoryResponse[];
  user: UserResponse;
};

function CategoryCard({ item, categories, user }: CategoryCardProps) {
  const category = categories.find((cat) => cat.uid === item.name);
  const catIconString = category?.icon || "circle-dollar-sign";
  const color = category?.color || "#3b82f6";
  const IconComponent = ICON_MAP[catIconString];
  return (
    <div className="flex flex-col py-4">
      <div className="flex justify-between items-center w-full gap-4">
        <div className="flex items-center gap-3">
          <div
            className="size-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <IconComponent className="size-6" style={{ color }} />
          </div>
          <div>
            <p>{formatCategory(item.name)}</p>
          </div>
        </div>
        <h3
          className={`font-medium mx-1 ${item.type === "income" ? "text-green-600" : "text-destructive"}`}
        >
          {formatCurrency(item.value, user.currency)}
        </h3>
      </div>
    </div>
  );
}
type CategoryItem = {
  name: string;
  value: number;
  type: string;
};
type TimeRange = "7d" | "30d" | "90d" | "1y" | "all";

const ICON_MAP: Record<string, LucideIcon> = {
  utensils: Utensils,
  car: Car,
  film: Film,
  zap: Zap,
  "heart-pulse": HeartPulse,
  "shopping-bag": ShoppingBag,
  "shopping-basket": ShoppingBasket,
  "graduation-cap": GraduationCap,
  plane: Plane,
  briefcase: Briefcase,
  "briefcase-business": BriefcaseBusiness,
  laptop: Laptop,
  "trending-up": TrendingUp,
  gift: Gift,
  "plus-circle": PlusCircle,
  "minus-circle": MinusCircle,
  home: Home,
  church: Church,
  sofa: Sofa,
  phone: Phone,
  wifi: Wifi,
  music: Music,
  "gamepad-2": Gamepad2,
  dumbbell: Dumbbell,
  coffee: Coffee,
  beer: Beer,
  pizza: Pizza,
  shirt: Shirt,
  scissors: Scissors,
  palette: Palette,
  book: Book,
  newspaper: Newspaper,
  "piggy-bank": PiggyBank,
  "circle-dollar-sign": CircleDollarSign,
};
