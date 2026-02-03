"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
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
import { formatCategory, convertAndFormat, formatDate } from "@/lib/utils";
import { CategoryResponse } from "@/lib/models/category";
import { AccountResponse } from "@/lib/models/account";
import { UserResponse } from "@/lib/models/user";
import { RateResponse } from "@/lib/models/summary";

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
        <div className="flex flex-col divide-y divide-muted border-y border-muted pr-3 md:pr-0">
          {transactions.map((transaction) => (
            <DropdownMenu key={transaction.id}>
              <DropdownMenuTrigger asChild>
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3 max-w-[70%]">
                    <div className="w-full">
                      <p className="text-sm font-medium">
                        {formatCategory(transaction.category)}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        <span> {formatDate(transaction.date, "SHORT")}</span>
                        <span> - </span>
                        <span className="capitalize">
                          {transaction.description}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-medium text-sm ${
                      transaction.type === "income"
                        ? "text-emerald-600"
                        : "text-destructive"
                    }`}
                  >
                    {convertAndFormat(
                      transaction.amount,
                      transaction.currency,
                      user.currency,
                      rate,
                    )}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setEditingTransaction(transaction)}
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeletingTransaction(transaction)}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-12.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {transaction.type === "income" ? (
                      <ArrowUpCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ArrowDownCircle className="w-4 h-4 text-destructive" />
                    )}
                    <span className="capitalize">{transaction.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {formatCategory(transaction.category)}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">
                  {transaction.account.toLowerCase()}
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    transaction.type === "income"
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  {convertAndFormat(
                    transaction.amount,
                    transaction.currency,
                    user.currency,
                    rate,
                  )}
                </TableCell>
                {user.username === transaction.username && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingTransaction(transaction)}
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeletingTransaction(transaction)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
