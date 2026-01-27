"use client";

import { useState } from "react";
import {
  Card,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
} from "lucide-react";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionsList } from "@/components/transactions/transactions-list";
import {
  useTransactions,
  useCreateTransaction,
} from "@/hooks/use-transactions";
import { TransactionType, TransactionCategory } from "@/lib/models/transaction";
import { toast } from "sonner";

export default function TransactionsPage() {
  const { data: transactions, isLoading: transactionsLoading } =
    useTransactions();
  const createMutation = useCreateTransaction();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreate = async (data: {
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
    description: string;
    date: string;
  }) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Transaction created successfully");
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create transaction",
      );
    }
  };

  const totalIncome =
    transactions
      ?.filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0) || 0;

  const totalExpenses =
    transactions
      ?.filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0) || 0;

  const balance = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">
            Manage your income and expenses
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
              <DialogDescription>
                Enter the details for your new transaction.
              </DialogDescription>
            </DialogHeader>
            <TransactionForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ArrowUpCircle className="size-4 text-emerald-600" />
              Total Income
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">
              {formatCurrency(totalIncome)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ArrowDownCircle className="size-4 text-red-500" />
              Total Expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(totalExpenses)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Wallet className="size-4" />
              Balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${
                balance >= 0 ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {formatCurrency(balance)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            View and manage all your transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TransactionsList transactions={transactions || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
