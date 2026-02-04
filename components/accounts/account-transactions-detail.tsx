"use client";

import { AccountCard } from "@/components/accounts/accounts-list";
import { useRates } from "@/hooks/use-rates";
import { useAuth } from "@/components/providers/auth-provider";
import { useAccountTransactions } from "@/hooks/use-accounts";
import LoadingIndicator from "@/components/layout/loading-indicator";
import { TransactionsList } from "@/components/transactions/transactions-list";
import { useCategories } from "@/hooks/use-categories";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface AccountTransactionsDetailsProps {
  id: string;
}

export default function AccountTransactionsDetails({
  id,
}: AccountTransactionsDetailsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: rate } = useRates();
  const { data: payload } = useAccountTransactions(id);
  const { data: categories } = useCategories();

  return (
    <div className="px-3 md:px-6 lg:px-8 py-2 md:py-6">
      {rate && payload && categories && user ? (
        <div className="space-y-3 md:space-y-6">
          <div className="flex space-x-2 items-center">
            <ChevronLeft
              className="size-10 text-muted-foreground cursor-pointer"
              onClick={() => router.back()}
            />
            <h1 className="text-2xl font-medium">
              {payload.account.name} account
            </h1>
          </div>
          <div className="max-w-md">
            <AccountCard
              account={payload.account}
              rate={rate}
              user={user}
              // Actions are disabled or handled via parent in this view
              setEditingAccount={() => {}}
              setDeletingAccount={() => {}}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <div className="md:py-1 md:border md:px-2 rounded-md">
              <p className="text-lg font-medium md:py-1">
                Account Transactions
              </p>
            </div>

            <TransactionsList
              transactions={payload.transactions}
              categories={categories}
              accounts={[payload.account]}
              rate={rate}
              user={user}
            />
          </div>
        </div>
      ) : (
        <LoadingIndicator />
      )}
    </div>
  );
}
