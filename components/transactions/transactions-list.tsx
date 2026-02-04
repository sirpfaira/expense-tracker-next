"use client";

import { useState } from "react";
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
import { ArrowDownCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TransactionForm } from "./transaction-form";
import {
  TransactionInput,
  TransactionResponse,
} from "@/lib/models/transaction";
import {
  useUpdateTransaction,
  useDeleteTransaction,
} from "@/hooks/use-transactions";
import { toast } from "sonner";
import { CategoryResponse } from "@/lib/models/category";
import { AccountResponse } from "@/lib/models/account";
import { UserResponse } from "@/lib/models/user";
import { RateResponse } from "@/lib/models/summary";
import TransactionsMobileView from "./transactions-mobile-view";
import TransactionsDesktopView from "./transactions-desktop-view";

interface TransactionsListProps {
  transactions: TransactionResponse[];
  categories: CategoryResponse[];
  accounts: AccountResponse[];
  rate: RateResponse;
  user: UserResponse;
}

export function TransactionsList({
  transactions,
  categories,
  accounts,
  rate,
  user,
}: TransactionsListProps) {
  const isMobile = useIsMobile();
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionResponse | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<TransactionResponse | null>(null);

  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const handleUpdate = async (data: TransactionInput) => {
    if (!editingTransaction) return;

    try {
      await updateMutation.mutateAsync({
        id: editingTransaction.id,
        ...data,
      });
      toast.success("Transaction updated successfully");
      setEditingTransaction(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update transaction",
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingTransaction) return;

    try {
      await deleteMutation.mutateAsync(deletingTransaction.id);
      toast.success("Transaction deleted successfully");
      setDeletingTransaction(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete transaction",
      );
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <ArrowDownCircle className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">
          No transactions found for the month
        </p>
        <p className="text-sm text-muted-foreground">
          Add your first transaction to get started
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {isMobile ? (
        <TransactionsMobileView
          transactions={transactions}
          setEditingTransaction={setEditingTransaction}
          setDeletingTransaction={setDeletingTransaction}
          rate={rate}
          user={user}
        />
      ) : (
        <TransactionsDesktopView
          transactions={transactions}
          setEditingTransaction={setEditingTransaction}
          setDeletingTransaction={setDeletingTransaction}
          rate={rate}
          user={user}
        />
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Update the transaction details below.
            </DialogDescription>
          </DialogHeader>
          <TransactionForm
            categories={categories}
            accounts={accounts}
            transaction={editingTransaction}
            onSubmit={handleUpdate}
            onCancel={() => setEditingTransaction(null)}
            isLoading={updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingTransaction}
        onOpenChange={(open) => !open && setDeletingTransaction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
