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
import { Plus } from "lucide-react";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionsList } from "@/components/transactions/transactions-list";
import {
  useTransactions,
  useCreateTransaction,
} from "@/hooks/use-transactions";
import { TransactionInput } from "@/lib/models/transaction";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import LoadingIndicator from "@/components/layout/loading-indicator";
import { useCategories } from "@/hooks/use-categories";
import { useAccounts } from "@/hooks/use-accounts";

export default function TransactionsPage() {
  const { user } = useAuth();
  const { data: categories } = useCategories();
  const { data: transactions } = useTransactions();
  const { data: accounts } = useAccounts();
  const createMutation = useCreateTransaction();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreate = async (data: TransactionInput) => {
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

  return (
    <div className="flex flex-col p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground text-sm">
            Manage your income and expenses
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              <span className="hidden md:inline-block">Add Transaction</span>
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
              categories={categories}
              accounts={accounts}
              onSubmit={handleCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
      {user && transactions ? (
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>
              View and manage all your transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionsList
              transactions={transactions || []}
              categories={categories}
              accounts={accounts}
              user={user}
            />
          </CardContent>
        </Card>
      ) : (
        <LoadingIndicator />
      )}
    </div>
  );
}
