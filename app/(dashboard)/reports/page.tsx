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

export default function ReportsPage() {
  const { user } = useAuth();
  const { data: transactions } = useTransactions();
  const { data: rate } = useRates();

  return (
    <>
      {user && transactions && rate ? (
        <ReportsView transactions={transactions} user={user} rate={rate} />
      ) : (
        <LoadingIndicator />
      )}
    </>
  );
}

type ReportsViewProps = {
  transactions: TransactionResponse[];
  user: UserResponse;
  rate: RateResponse;
};

function ReportsView({ transactions, user, rate }: ReportsViewProps) {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col">
      {isMobile ? (
        <ReportsMobileView
          transactions={transactions}
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
