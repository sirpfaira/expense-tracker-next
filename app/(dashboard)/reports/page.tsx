"use client";

import { useTransactions } from "@/hooks/use-transactions";
import { useAuth } from "@/components/providers/auth-provider";
import { useRates } from "@/hooks/use-rates";
import { TransactionResponse } from "@/lib/models/transaction";
import { UserResponse } from "@/lib/models/user";
import { RateResponse } from "@/lib/models/summary";
import LoadingIndicator from "@/components/layout/loading-indicator";
import { useIsMobile } from "@/hooks/use-mobile";
import ReportsMobileView from "@/components/reports/reports-mobile-view";
import ReportsDesktopView from "@/components/reports/reports-desktop-view";
import { useCategories } from "@/hooks/use-categories";
import { CategoryResponse } from "@/lib/models/category";

export default function ReportsPage() {
  const { user } = useAuth();
  const { data: transactions } = useTransactions();
  const { data: categories } = useCategories();
  const { data: rate } = useRates();

  return (
    <>
      {user && transactions && categories && rate ? (
        <ReportsView
          transactions={transactions}
          categories={categories}
          user={user}
          rate={rate}
        />
      ) : (
        <LoadingIndicator />
      )}
    </>
  );
}

type ReportsViewProps = {
  transactions: TransactionResponse[];
  categories: CategoryResponse[];
  user: UserResponse;
  rate: RateResponse;
};

function ReportsView({
  transactions,
  categories,
  user,
  rate,
}: ReportsViewProps) {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col">
      {isMobile ? (
        <ReportsMobileView
          transactions={transactions}
          categories={categories}
          rate={rate}
          user={user}
        />
      ) : (
        <ReportsDesktopView
          transactions={transactions}
          rate={rate}
          user={user}
        />
      )}
    </div>
  );
}
