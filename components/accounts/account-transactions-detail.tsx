"use client";

import { AccountCard } from "@/components/accounts/accounts-list";
import { useRates } from "@/hooks/use-rates";
import { useAuth } from "@/components/providers/auth-provider";
import { useAccountTransactions } from "@/hooks/use-accounts";
import LoadingIndicator from "@/components/layout/loading-indicator";
import { TransactionsList } from "@/components/transactions/transactions-list";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronLeft,
  Coins,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { convertAndFormat, formatCurrency } from "@/lib/utils";

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

  const cashIn =
    payload?.transactions.reduce((sum, t) => {
      if (t.type === "income" || t.category === "trf-transfer-in") {
        return sum + t.amount;
      }
      return sum;
    }, 0) || 0;

  const cashOut =
    payload?.transactions.reduce((sum, t) => {
      if (t.type === "expense" || t.category === "trf-transfer-out") {
        return sum + t.amount;
      }
      return sum;
    }, 0) || 0;

  const balance = cashIn - cashOut;

  return (
    <div className="px-3 md:px-6 lg:px-8 py-2 md:py-6">
      {rate && payload && user ? (
        <div className="space-y-3 md:space-y-6">
          <div className="flex space-x-3 items-center">
            <div className="pt-0.5">
              <ArrowLeft
                className="size-8 text-muted-foreground cursor-pointer"
                onClick={() => router.back()}
              />
            </div>
            <h1 className="text-2xl font-medium">
              {payload.account.name} account
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AccountCard
              account={payload.account}
              rate={rate}
              user={user}
              // Actions are disabled or handled via parent in this view
              setEditingAccount={() => {}}
              setDeletingAccount={() => {}}
            />
            <div className="flex flex-col px-6 py-4 bg-card rounded-xl border shadow-sm">
              <div className="pb-2 px-1">
                <p className="font-medium">Account Summary</p>
                <p className="text-sm text-muted-foreground">
                  Get a quick overview of your account balance
                </p>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-500/10 rounded-full text-green-500">
                    <ArrowUp className="size-4" />
                  </div>
                  <h3 className="text-xl font-bold text-green-600">
                    {convertAndFormat(
                      cashIn,
                      payload.account.currency,
                      user.currency,
                      rate,
                    )}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-500/10 rounded-full text-destructive">
                    <ArrowDown className="size-4" />
                  </div>
                  <h3 className="text-xl font-bold text-destructive">
                    {convertAndFormat(
                      cashOut,
                      payload.account.currency,
                      user.currency,
                      rate,
                    )}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {balance >= 0 ? (
                    <div className="p-2 bg-green-500/10 rounded-full text-green-500">
                      <Coins className="size-4" />
                    </div>
                  ) : (
                    <div className="p-2 bg-red-500/10 rounded-full text-destructive">
                      <Coins className="size-6" />
                    </div>
                  )}
                  <h3
                    className={`text-xl font-bold ${
                      balance >= 0 ? "text-green-600" : "text-destructive"
                    }`}
                  >
                    {convertAndFormat(
                      balance,
                      payload.account.currency,
                      user.currency,
                      rate,
                    )}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="md:py-1 md:border md:px-2 rounded-md">
              <p className="text-lg font-medium md:py-1">
                Account Transactions
              </p>
            </div>

            <TransactionsList
              transactions={payload.transactions}
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
