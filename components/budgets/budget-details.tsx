import { CategoryResponse } from "@/lib/models/category";
import { RateResponse } from "@/lib/models/summary";
import { UserResponse } from "@/lib/models/user";
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
import { Button } from "@/components/ui/button";
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
import {
  BudgetExpense,
  BudgetExpenseFormValues,
  BudgetResponse,
} from "@/lib/models/budget";
import { TransactionResponse } from "@/lib/models/transaction";
import { BudgetForm } from "./budget-form";
import { formatCategory } from "@/lib/utils";

interface BudgetDetailsProps {
  budget: BudgetResponse | undefined;
  transactions: TransactionResponse[];
  categories: CategoryResponse[];
  currentDate: Date;
  rate: RateResponse;
  user: UserResponse;
}

const BudgetDetails = ({
  budget,
  transactions,
  categories,
  currentDate,
  rate,
  user,
}: BudgetDetailsProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const addBudgetExpense = useAddBudgetExpense();
  const deleteBudgetExpense = useDeleteBudgetExpense();
  const [editingBudgetExpense, setEditingBudgetExpense] =
    useState<BudgetExpenseFormValues | null>(null);
  const [deletingBudgetExpense, setDeletingBudgetExpense] =
    useState<BudgetExpenseFormValues | null>(null);

  const totalBudget =
    budget?.expenses?.reduce((sum, b) => sum + b.amount, 0) || 0;
  const totalSpent =
    transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, b) => sum + b.amount, 0) || 0;
  const overBudgetCount =
    totalSpent > totalBudget ? totalSpent - totalBudget : 0;

  const handleAddExpenseBudget = async (data: BudgetExpenseFormValues) => {
    try {
      await addBudgetExpense.mutateAsync(data);
      toast.success("Budget expense saved successfully");
      setIsCreateDialogOpen(false);
      setEditingBudgetExpense(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save budget expense",
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingBudgetExpense || !budget) return;

    try {
      await deleteBudgetExpense.mutateAsync({
        ...deletingBudgetExpense,
        id: budget.id,
      });
      toast.success("Budget expense deleted successfully");
      setDeletingBudgetExpense(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete budget",
      );
    }
  };

  const getStatusInfo = (expense: BudgetExpense) => {
    const expensesTotal =
      transactions
        .filter((t) => t.category === expense.category)
        .reduce((sum, b) => sum + b.amount, 0) || 0;
    const percentage: number = (expensesTotal / expense.amount) * 100;
    if (percentage >= 100) {
      return {
        amount: expensesTotal,
        percentage: percentage,
        color: "text-red-600",
        bgColor: "bg-red-500",
        icon: AlertTriangle,
        label: "Over Budget",
      };
    }
    if (percentage >= 80) {
      return {
        amount: expensesTotal,
        percentage: percentage,
        color: "text-amber-600",
        bgColor: "bg-amber-500",
        icon: AlertTriangle,
        label: "Near Limit",
      };
    }
    return {
      amount: expensesTotal,
      percentage: percentage,
      color: "text-green-600",
      bgColor: "bg-green-500",
      icon: CheckCircle2,
      label: "On Track",
    };
  };

  return (
    <div>
      {!budget || budget?.expenses?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CreditCard className="size-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No budgeted expenses yet
          </h3>
          <p className="text-muted-foreground max-w-sm mb-4">
            Create your first expense budget to start tracking your spending and
            stay on top of your finances.
          </p>
          {user.role === "admin" && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="size-4" />
              Add Budget Expense
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Wallet className="size-4" />
                  Total Budget
                </CardDescription>
                <CardTitle className="text-2xl">
                  $
                  {totalBudget.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Across {budget?.expenses.length || 0} active budgets
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <TrendingUp className="size-4" />
                  Total Spent
                </CardDescription>
                <CardTitle className="text-2xl">
                  $
                  {totalSpent.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {totalBudget > 0
                    ? ((totalSpent / totalBudget) * 100).toFixed(1)
                    : 0}
                  % of total budget
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <AlertTriangle className="size-4" />
                  Over Budget
                </CardDescription>
                <CardTitle
                  className={`text-2xl ${overBudgetCount > 0 ? "text-red-600" : "text-green-600"}`}
                >
                  {overBudgetCount}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {overBudgetCount === 0
                    ? "All budgets on track"
                    : `${overBudgetCount} budget(s) exceeded`}
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-5" />
                Your Budgeted Expenses
              </CardTitle>
              <CardDescription>
                Track your spending against your budget limits
              </CardDescription>
              <CardAction>
                {user.role === "admin" && (
                  <Button
                    size={"icon"}
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="size-4" />
                  </Button>
                )}
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budget.expenses.map((expense, index) => {
                  const status = getStatusInfo(expense);
                  const StatusIcon = status.icon;
                  const currentExpense: BudgetExpenseFormValues = {
                    period: currentDate.toISOString().split("T")[0],
                    category: expense.category,
                    amount: expense.amount,
                    currency: expense.currency,
                    description: expense.description,
                  };

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
                        {user.role === "admin" && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setDeletingBudgetExpense(currentExpense)
                              }
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            ${status.amount} spent
                          </span>
                          <span className="font-medium">
                            $
                            {expense.amount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <Progress
                          value={Math.min(status.percentage, 100)}
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{status.percentage.toFixed(1)}% used</span>
                          <span>
                            ${expense.amount - status.amount} remaining
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Budget</DialogTitle>
            <DialogDescription>
              Set a spending limit for a specific period
            </DialogDescription>
          </DialogHeader>
          <BudgetForm
            budgetExpense={editingBudgetExpense}
            categories={categories}
            user={user}
            onSubmit={handleAddExpenseBudget}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={addBudgetExpense.isPending}
          />
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingBudgetExpense}
        onOpenChange={() => setDeletingBudgetExpense(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;
              {deletingBudgetExpense?.description}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteBudgetExpense.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BudgetDetails;
