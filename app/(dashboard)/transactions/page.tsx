"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionsList } from "@/components/transactions/transactions-list";
import {
  useTransactions,
  useCreateTransaction,
} from "@/hooks/use-transactions";
import {
  TransactionInput,
  TransactionResponse,
} from "@/lib/models/transaction";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import LoadingIndicator from "@/components/layout/loading-indicator";
import { useCategories } from "@/hooks/use-categories";
import { useAccounts } from "@/hooks/use-accounts";
import { AccountResponse } from "@/lib/models/account";
import { UserResponse } from "@/lib/models/user";
import { useRates } from "@/hooks/use-rates";
import { RateResponse } from "@/lib/models/summary";
import Link from "next/link";

export default function TransactionsPage() {
  const { user } = useAuth();
  const { data: categories } = useCategories();
  const { data: transactions } = useTransactions();
  const { data: accounts } = useAccounts();
  const { data: rate } = useRates();
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
    <div className="flex flex-col space-y-3 p-2 md:p-6">
      <div className="flex items-center justify-between">
        <div className="md:px-1">
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
      {user && transactions && categories && accounts && rate ? (
        <TransactionsFilter
          transactions={transactions}
          accounts={accounts}
          rate={rate}
          user={user}
        />
      ) : (
        <LoadingIndicator />
      )}
    </div>
  );
}

interface TransactionsFilterProps {
  transactions: TransactionResponse[];
  accounts: AccountResponse[];
  rate: RateResponse;
  user: UserResponse;
}
function TransactionsFilter({
  transactions,
  accounts,
  rate,
  user,
}: TransactionsFilterProps) {
  // 1. Set current month/year as default state
  const [currentDate, setCurrentDate] = useState(new Date());

  // 2. Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  // 3. Filter transactions for the selected month/year
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return (
        txDate.getMonth() === currentDate.getMonth() &&
        txDate.getFullYear() === currentDate.getFullYear() &&
        tx.type !== "transfer"
      );
    });
  }, [transactions, currentDate]);

  // Format month label (e.g., "January 2026")
  const monthLabel = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {accounts.length > 0 ? (
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between text-muted-foreground md:pl-2">
            <p className="font-medium text-lg">Month</p>
            <div className="flex space-x-2 justify-between items-center">
              <Button variant={"ghost"} size={"icon"} onClick={handlePrevMonth}>
                <ChevronLeft className="size-6" />
              </Button>
              <h2 className="font-medium">{monthLabel}</h2>
              <Button variant={"ghost"} size={"icon"} onClick={handleNextMonth}>
                <ChevronRight className="size-6" />
              </Button>
            </div>
          </div>
          <TransactionsList
            transactions={filteredTransactions}
            rate={rate}
            user={user}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <ArrowDownCircle className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No accounts yet</p>
          <p className="text-sm text-muted-foreground">
            To add a transaction you should have an account first
          </p>
          <Button className="mt-4" asChild>
            <Link href="/accounts">Add Account</Link>
          </Button>
        </div>
      )}
    </>
  );
}
