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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";
import { formatCategory, convertAndFormat, convertAmount } from "@/lib/utils";
import { TransactionResponse } from "@/lib/models/transaction";
import { UserResponse } from "@/lib/models/user";
import { RateResponse } from "@/lib/models/summary";

type TimeRange = "7d" | "30d" | "90d" | "1y" | "all";

const CHART_COLORS = [
  "#2563eb", // blue
  "#16a34a", // green
  "#dc2626", // red
  "#ca8a04", // yellow
  "#9333ea", // purple
  "#0891b2", // cyan
  "#ea580c", // orange
  "#64748b", // slate
  "#db2777", // pink
  "#059669", // emerald
];

type ReportsMobileViewProps = {
  transactions: TransactionResponse[];
  user: UserResponse;
  rate: RateResponse;
};

export default function ReportsMobileView({
  transactions,
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

  const summaryStats = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce(
        (sum, t) =>
          sum + convertAmount(t.amount, t.currency, user.currency, rate),
        0,
      );
    const expenses = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce(
        (sum, t) =>
          sum + convertAmount(t.amount, t.currency, user.currency, rate),
        0,
      );
    const balance = income - expenses;
    const transactionCount = filteredTransactions.length;

    return { income, expenses, balance, transactionCount };
  }, [filteredTransactions]);

  const categoryData = useMemo(() => {
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
        fill: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const monthlyData = useMemo(() => {
    const monthlyTotals: Record<string, { income: number; expenses: number }> =
      {};

    filteredTransactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = { income: 0, expenses: 0 };
      }

      if (t.type === "income") {
        monthlyTotals[monthKey].income += convertAmount(
          t.amount,
          t.currency,
          user.currency,
          rate,
        );
      } else {
        monthlyTotals[monthKey].expenses += convertAmount(
          t.amount,
          t.currency,
          user.currency,
          rate,
        );
      }
    });

    return Object.entries(monthlyTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => {
        const [year, monthNum] = month.split("-");
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return {
          month: `${monthNames[parseInt(monthNum) - 1]} ${year}`,
          income: data.income,
          expenses: data.expenses,
          net: data.income - data.expenses,
        };
      });
  }, [filteredTransactions]);

  const dailyData = useMemo(() => {
    const dailyTotals: Record<string, number> = {};

    filteredTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const dateKey = t.date.split("T")[0];
        dailyTotals[dateKey] =
          (dailyTotals[dateKey] || 0) +
          convertAmount(t.amount, t.currency, user.currency, rate);
      });

    return Object.entries(dailyTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30)
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        amount,
      }));
  }, [filteredTransactions]);

  return (
    <div className="p-6 space-y-6">
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Income</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {convertAndFormat(
                summaryStats.income,
                user.currency,
                user.currency,
                rate,
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="size-3 text-green-600" />
              <span>
                {filteredTransactions.filter((t) => t.type === "income").length}
              </span>
              <span>transactions</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Expenses</CardDescription>
            <CardTitle className="text-2xl text-destructive">
              {convertAndFormat(
                summaryStats.expenses,
                user.currency,
                user.currency,
                rate,
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingDown className="size-3 text-destructive" />
              <span>
                {
                  filteredTransactions.filter((t) => t.type === "expense")
                    .length
                }
              </span>
              <span>transactions</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Net Cashflow</CardDescription>
            <CardTitle
              className={`text-2xl ${summaryStats.balance >= 0 ? "text-green-600" : "text-destructive"}`}
            >
              {convertAndFormat(
                summaryStats.balance,
                user.currency,
                user.currency,
                rate,
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {summaryStats.balance >= 0 ? (
                <TrendingUp className="size-3 text-green-600" />
              ) : (
                <TrendingDown className="size-3 text-destructive" />
              )}
              {summaryStats.balance >= 0 ? "Positive" : "Negative"} cash flow
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Transactions</CardDescription>
            <CardTitle className="text-2xl">
              {summaryStats.transactionCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BarChart3 className="size-3" />
              Total recorded
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5" />
              Income vs Expenses
            </CardTitle>
            <CardDescription>
              Monthly comparison of income and expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ChartContainer
                config={{
                  income: { label: "Income", color: "#16a34a" },
                  expenses: { label: "Expenses", color: "#dc2626" },
                }}
                className="h-75"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="income"
                      fill="#16a34a"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="expenses"
                      fill="#dc2626"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-75 text-muted-foreground">
                No data available for the selected period
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
            {categoryData.length > 0 ? (
              <ChartContainer
                config={Object.fromEntries(
                  categoryData.map((item) => [
                    item.name,
                    { label: item.name, color: item.fill },
                  ]),
                )}
                className="h-75"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border border-border rounded-lg p-2 shadow-lg">
                              <p className="font-medium">
                                {formatCategory(data.name)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {convertAndFormat(
                                  data.value,
                                  user.currency,
                                  user.currency,
                                  rate,
                                )}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-75 text-muted-foreground">
                No expense data available
              </div>
            )}
            {categoryData.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {categoryData.slice(0, 6).map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div
                      className="size-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="truncate text-muted-foreground">
                      {formatCategory(item.name)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="size-5" />
            Daily Spending Trend
          </CardTitle>
          <CardDescription>
            Your expense pattern over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dailyData.length > 0 ? (
            <ChartContainer
              config={{
                amount: { label: "Spending", color: "#2563eb" },
              }}
              className="h-62.5"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailyData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-62.5 text-muted-foreground">
              No expense data available for the selected period
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
