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
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your finances
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${balance >= 0 ? "text-emerald-600" : "text-red-500"}`}
            >
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current account balance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpCircle className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">All time income</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <ArrowDownCircle className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">All time expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactions?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total transactions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
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
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between"
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
                          <ArrowUpCircle className="size-4" />
                        ) : (
                          <ArrowDownCircle className="size-4" />
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
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks at your fingertips</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button
              variant="outline"
              className="justify-start h-auto py-3 bg-transparent"
              asChild
            >
              <Link href="/transactions">
                <ArrowDownCircle className="size-4 mr-3 text-red-500" />
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
                <ArrowUpCircle className="size-4 mr-3 text-emerald-600" />
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
                <TrendingUp className="size-4 mr-3" />
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
