"use client";

import { useAuth } from "@/components/providers/auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTransactions } from "@/hooks/use-transactions";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: transactions } = useTransactions();

  const totalIncome =
    transactions
      ?.filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0) || 0;

  const totalExpenses =
    transactions
      ?.filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0) || 0;

  const balance = totalIncome - totalExpenses;

  const recentTransactions = transactions?.slice(0, 5) || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-UK", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome Back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your finances
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="px-6 py-4 bg-card rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Balance
              </p>
              <h3 className="text-2xl font-bold">{formatCurrency(balance)}</h3>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-card rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-full text-green-500">
              <ArrowUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                This Month Income
              </p>
              <h3 className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </h3>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-card rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-full text-red-500">
              <ArrowDown className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                This Month Expenses
              </p>
              <h3 className="text-2xl font-bold text-red-500">
                {formatCurrency(totalExpenses)}
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Budget</CardTitle>
              <CardDescription>
                Stay on track with your spending goals
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="p-4 bg-card rounded-xl border shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-full text-green-500">
                    <ArrowUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Income</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
                <span className="font-medium">{formatCurrency(20000)}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Received</span>
                  <span>{80}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${80}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="p-4 bg-card rounded-xl border shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-full text-red-500">
                    <ArrowDown className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Expenses</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
                <span className="font-medium">{formatCurrency(14000)}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Utilized</span>
                  <span>{60}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-400"
                    style={{ width: `${60}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/transactions">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Wallet className="size-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground">
                  Add your first transaction to get started
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/transactions">Add Transaction</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-muted border-t border-muted">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center size-9 rounded-full ${
                          transaction.type === "income"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-red-100 text-red-500"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUp className="size-4" />
                        ) : (
                          <ArrowDown className="size-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.category} -{" "}
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-medium ${
                        transaction.type === "income"
                          ? "text-emerald-600"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks at your fingertips</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button
              variant="outline"
              className="justify-start h-auto py-3 bg-transparent"
              asChild
            >
              <Link href="/transactions">
                <ArrowDownCircle className="size-6 mr-3 text-red-500" />
                <div className="text-left">
                  <p className="font-medium">Add Expense</p>
                  <p className="text-xs text-muted-foreground">
                    Record a new expense
                  </p>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto py-3 bg-transparent"
              asChild
            >
              <Link href="/transactions">
                <ArrowUpCircle className="size-6 mr-3 text-emerald-600" />
                <div className="text-left">
                  <p className="font-medium">Add Income</p>
                  <p className="text-xs text-muted-foreground">
                    Record a new income
                  </p>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto py-3 bg-transparent"
              asChild
            >
              <Link href="/reports">
                <TrendingUp className="size-6 mr-3" />
                <div className="text-left">
                  <p className="font-medium">View Reports</p>
                  <p className="text-xs text-muted-foreground">
                    Analyze your spending
                  </p>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
