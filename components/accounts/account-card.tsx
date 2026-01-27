"use client";

import { Account } from "@/lib/models/account";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Banknote } from "lucide-react";

interface AccountCardProps {
  account: Account;
}

const iconMap = {
  BANK: CreditCard,
  CASH: Banknote,
};

export function AccountCard({ account }: AccountCardProps) {
  const Icon = iconMap[account.type] || CreditCard;

  //   const formatter = new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: account.currency,
  //   });

  return (
    <div className="p-6 bg-card rounded-xl border shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-full text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold">{account.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">
            {account.type.toLowerCase()} • {account.currency}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg">
          {formatCurrency(account.balance, "ZAR")}
        </p>
      </div>
    </div>
  );
}
