"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import LoadingIndicator from "@/components/layout/loading-indicator";
import { useCategories } from "@/hooks/use-categories";
import { CategoryResponse } from "@/lib/models/category";
import { UserResponse } from "@/lib/models/user";
import { useRates } from "@/hooks/use-rates";
import { RateResponse } from "@/lib/models/summary";
import { useBudgets } from "@/hooks/use-budgets";
import { useTransactions } from "@/hooks/use-transactions";
import { TransactionResponse } from "@/lib/models/transaction";
import { BudgetResponse } from "@/lib/models/budget";
import BudgetDetails from "@/components/budgets/budget-details";

export default function BudgetsPage() {
  const { user } = useAuth();
  const { data: categories } = useCategories();
  const { data: transactions } = useTransactions();
  const { data: budgets } = useBudgets();
  const { data: rate } = useRates();

  return (
    <div className="flex flex-col space-y-3 p-2 md:p-6">
      <div className="flex items-center justify-between">
        <div className="md:px-1">
          <h1 className="text-2xl font-bold text-foreground">Budgeting</h1>
          <p className="text-muted-foreground text-sm">
            Track your spending against your budget limits
          </p>
        </div>
      </div>
      {user && transactions && categories && rate && budgets ? (
        <BudgetsFilter
          budgets={budgets}
          transactions={transactions}
          categories={categories}
          rate={rate}
          user={user}
        />
      ) : (
        <LoadingIndicator />
      )}
    </div>
  );
}

interface BudgetsFilterProps {
  budgets: BudgetResponse[];
  transactions: TransactionResponse[];
  categories: CategoryResponse[];
  rate: RateResponse;
  user: UserResponse;
}
function BudgetsFilter({
  budgets,
  transactions,
  categories,
  rate,
  user,
}: BudgetsFilterProps) {
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

  const currentBudget = useMemo(() => {
    return budgets.find((budget) => {
      const budgetDate = new Date(budget.period);
      return (
        budgetDate.getMonth() === currentDate.getMonth() &&
        budgetDate.getFullYear() === currentDate.getFullYear()
      );
    });
  }, [budgets, transactions, currentDate]);

  // 3. Filter transactions for the selected month/year
  const budgetTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return (
        txDate.getMonth() === currentDate.getMonth() &&
        txDate.getFullYear() === currentDate.getFullYear()
      );
    });
  }, [budgets, transactions, currentDate]);

  // Format month label (e.g., "January 2026")
  const monthLabel = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
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
      <BudgetDetails
        budget={currentBudget}
        transactions={budgetTransactions}
        categories={categories}
        currentDate={currentDate}
        rate={rate}
        user={user}
      />
    </div>
  );
}
