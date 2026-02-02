import { useAuth } from "@/components/providers/auth-provider";
import { useTransactions } from "@/hooks/use-transactions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  formatCategory,
  convertAndFormat,
  formatDate,
  convertAmount,
  formatCurrency,
} from "@/lib/utils";
import LoadingIndicator from "@/components/layout/loading-indicator";
import { useRates } from "@/hooks/use-rates";
import { TransactionResponse } from "@/lib/models/transaction";
import { UserResponse } from "@/lib/models/user";
import { RateResponse } from "@/lib/models/summary";
import { useAccounts } from "@/hooks/use-accounts";
import { AccountResponse } from "@/lib/models/account";
import { BudgetExpense, BudgetResponse } from "@/lib/models/budget";
import { CategoryResponse } from "@/lib/models/category";
import { useState } from "react";
import {
  useAddBudgetExpense,
  useDeleteBudgetExpense,
} from "@/hooks/use-budgets";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  CreditCard,
  Plus,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Wallet,
} from "lucide-react";

type BudgetCardProps = {
  budgets: BudgetResponse[];
  transactions: TransactionResponse[];
  user: UserResponse;
  rate: RateResponse;
};

const BudgetCard = ({ budgets, transactions, user, rate }: BudgetCardProps) => {
  const budget = budgets.find((budget) => {
    const budgetDate = new Date(budget.period);
    return (
      budgetDate.getMonth() === new Date().getMonth() &&
      budgetDate.getFullYear() === new Date().getFullYear()
    );
  });

  const currentTransactions = transactions.filter((t) => {
    const trxDate = new Date(t.date);
    return (
      trxDate.getMonth() === new Date().getMonth() &&
      trxDate.getFullYear() === new Date().getFullYear()
    );
  });

  const getStatusInfo = (expense: BudgetExpense) => {
    const expensesTotal =
      currentTransactions
        .filter((t) => t.category === expense.category)
        .reduce(
          (sum, b) =>
            sum + convertAmount(b.amount, b.currency, user.currency, rate),
          0,
        ) || 0;
    const percentage: number =
      (expensesTotal /
        convertAmount(expense.amount, expense.currency, user.currency, rate)) *
      100;
    if (percentage >= 100) {
      return {
        actual: expensesTotal,
        percentage: percentage,
        color: "text-red-600",
        bgColor: "bg-red-500",
        icon: AlertTriangle,
        label: "Over Budget",
      };
    }
    if (percentage >= 80) {
      return {
        actual: expensesTotal,
        percentage: percentage,
        color: "text-amber-600",
        bgColor: "bg-amber-500",
        icon: AlertTriangle,
        label: "Near Limit",
      };
    }
    return {
      actual: expensesTotal,
      percentage: percentage,
      color: "text-green-600",
      bgColor: "bg-green-500",
      icon: CheckCircle2,
      label: "On Track",
    };
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Budgeting</CardTitle>
          <CardDescription>Stay on track with your goals</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/budgets">View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-3">
        {budget ? (
          <div className="space-y-4">
            {budget.expenses
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 2)
              .map((expense, index) => {
                const status = getStatusInfo(expense);
                const StatusIcon = status.icon;
                const convertedExpenseAmount = convertAmount(
                  expense.amount,
                  expense.currency,
                  user.currency,
                  rate,
                );

                return (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {expense.description}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {formatCategory(expense.category)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <StatusIcon className={`size-4 ${status.color}`} />
                          <span className={status.color}>{status.label}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {formatCurrency(status.actual, user.currency)} spent
                        </span>
                        <span className="font-medium">
                          {formatCurrency(
                            convertedExpenseAmount,
                            user.currency,
                          )}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(status.percentage, 100)}
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{status.percentage.toFixed(1)}% used</span>
                        <span>
                          {formatCurrency(
                            convertedExpenseAmount - status.actual > 0
                              ? convertedExpenseAmount - status.actual
                              : 0,
                            user.currency,
                          )}{" "}
                          remaining
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div>No budgeted expenses yet</div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetCard;
