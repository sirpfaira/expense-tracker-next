"use client";

import { useState } from "react";
import {
  useBudgets,
  useCreateBudget,
  useUpdateBudget,
  useDeleteBudget,
} from "@/hooks/use-budgets";
import { useCategories } from "@/hooks/use-categories";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  Pencil,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { BudgetExpense, BudgetResponse } from "@/lib/models/budget";
import { useTransactions } from "@/hooks/use-transactions";

interface BudgetFormData {
  period: number;
  expenses: BudgetExpense[];
}

export default function BudgetsPage() {
  const { data: budgets, isLoading } = useBudgets();
  const { data: categories } = useCategories();
  const { data: transactions } = useTransactions();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetResponse | null>(
    null,
  );
  const [deletingBudget, setDeletingBudget] = useState<BudgetResponse | null>(
    null,
  );

  Add budget expenses to current or upcoming months 
  Remove adding budget expenses feature for previous past months
  on update check if budget with that period already exists and overwrite it otherwise create new onemptied

  Research on how to use zod with array values and react hook form

  
  const [formData, setFormData] = useState<BudgetFormData>({
    name: "",
    amount: "",
    period: "monthly",
    categoryId: null,
  });

  const expenseCategories =
    categories?.filter((c) => c.type === "expense") || [];

  const resetForm = () => {
    setFormData({
      name: "",
      amount: "",
      period: "monthly",
      categoryId: null,
    });
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a budget name");
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await createBudget.mutateAsync({
        name: formData.name,
        amount: Number(formData.amount),
        period: formData.period,
        categoryId: formData.categoryId,
      });
      toast.success("Budget created successfully");
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create budget",
      );
    }
  };

  const handleUpdate = async () => {
    if (!editingBudget || !formData.name.trim()) {
      toast.error("Please enter a budget name");
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await updateBudget.mutateAsync({
        id: editingBudget.id,
        name: formData.name,
        amount: Number(formData.amount),
        period: formData.period,
        categoryId: formData.categoryId,
      });
      toast.success("Budget updated successfully");
      setEditingBudget(null);
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update budget",
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingBudget) return;

    try {
      await deleteBudget.mutateAsync(deletingBudget.id);
      toast.success("Budget deleted successfully");
      setDeletingBudget(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete budget",
      );
    }
  };

  const openEditDialog = (budget: BudgetWithSpending) => {
    setEditingBudget(budget);
    setFormData({
      name: budget.name,
      amount: budget.amount.toString(),
      period: budget.period,
      categoryId: budget.categoryId,
    });
  };

  const getStatusInfo = (budget: BudgetWithSpending) => {
    if (budget.percentage >= 100) {
      return {
        color: "text-red-600",
        bgColor: "bg-red-500",
        icon: AlertTriangle,
        label: "Over Budget",
      };
    }
    if (budget.percentage >= 80) {
      return {
        color: "text-amber-600",
        bgColor: "bg-amber-500",
        icon: AlertTriangle,
        label: "Near Limit",
      };
    }
    return {
      color: "text-green-600",
      bgColor: "bg-green-500",
      icon: CheckCircle2,
      label: "On Track",
    };
  };

  const totalBudget = budgets?.reduce((sum, b) => sum + b.amount, 0) || 0;
  const totalSpent = budgets?.reduce((sum, b) => sum + b.spent, 0) || 0;
  const overBudgetCount =
    budgets?.filter((b) => b.percentage >= 100).length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const BudgetForm = ({
    onSubmit,
    submitLabel,
    isLoading: isSubmitting,
  }: {
    onSubmit: () => void;
    submitLabel: string;
    isLoading: boolean;
  }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Budget Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Monthly Groceries"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            placeholder="0.00"
            className="pl-7"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="period">Period</Label>
        <Select
          value={formData.period}
          onValueChange={(v) =>
            setFormData({ ...formData, period: v as BudgetPeriod })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category (Optional)</Label>
        <Select
          value={formData.categoryId || "all"}
          onValueChange={(v) =>
            setFormData({ ...formData, categoryId: v === "all" ? null : v })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All expenses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Expenses</SelectItem>
            {expenseCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Leave empty to track all expenses, or select a category to track
          specific spending.
        </p>
      </div>

      <DialogFooter>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </Button>
      </DialogFooter>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Budgets</h1>
          <p className="text-muted-foreground">
            Set and track your spending budgets
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="size-4" />
          Create Budget
        </Button>
      </div>

      {/* Summary Cards */}
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
              Across {budgets?.length || 0} active budgets
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
              {totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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

      {/* Budget List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-5" />
            Your Budgets
          </CardTitle>
          <CardDescription>
            Track your spending against your budget limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!budgets || budgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CreditCard className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No budgets yet
              </h3>
              <p className="text-muted-foreground max-w-sm mb-4">
                Create your first budget to start tracking your spending and
                stay on top of your finances.
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="size-4" />
                Create Budget
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.map((budget) => {
                const status = getStatusInfo(budget);
                const StatusIcon = status.icon;
                const categoryName = expenseCategories.find(
                  (c) => c.id === budget.categoryId,
                )?.name;

                return (
                  <div
                    key={budget.id}
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {budget.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {PERIOD_LABELS[budget.period]}
                          </Badge>
                          {categoryName && (
                            <Badge variant="secondary" className="text-xs">
                              {categoryName}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <StatusIcon className={`size-4 ${status.color}`} />
                          <span className={status.color}>{status.label}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(budget)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingBudget(budget)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          $
                          {budget.spent.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          spent
                        </span>
                        <span className="font-medium">
                          $
                          {budget.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(budget.percentage, 100)}
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{budget.percentage.toFixed(1)}% used</span>
                        <span>
                          $
                          {budget.remaining.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          remaining
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Budget</DialogTitle>
            <DialogDescription>
              Set a spending limit for a specific period
            </DialogDescription>
          </DialogHeader>
          <BudgetForm
            onSubmit={handleCreate}
            submitLabel="Create Budget"
            isLoading={createBudget.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingBudget}
        onOpenChange={() => setEditingBudget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>Update your budget settings</DialogDescription>
          </DialogHeader>
          <BudgetForm
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
            isLoading={updateBudget.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingBudget}
        onOpenChange={() => setDeletingBudget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingBudget?.name}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteBudget.isPending ? (
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
}
