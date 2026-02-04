"use client";

import { Dispatch, SetStateAction } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash2 } from "lucide-react";
import { TransactionResponse } from "@/lib/models/transaction";
import { formatCategory, convertAndFormat, formatDate } from "@/lib/utils";
import { UserResponse } from "@/lib/models/user";
import { RateResponse } from "@/lib/models/summary";
import { Virtuoso } from "react-virtuoso";

type TransactionsMobileViewProps = {
  transactions: TransactionResponse[];
  rate: RateResponse;
  user: UserResponse;
  setEditingTransaction: Dispatch<SetStateAction<TransactionResponse | null>>;
  setDeletingTransaction: Dispatch<SetStateAction<TransactionResponse | null>>;
};

const TransactionsMobileView = ({
  transactions,
  setEditingTransaction,
  setDeletingTransaction,
  rate,
  user,
}: TransactionsMobileViewProps) => {
  return (
    <div className="flex flex-col h-[75vh]">
      <div className="flex flex-col h-full pr-3 md:pr-0">
        <Virtuoso
          style={{ height: "100%" }}
          data={transactions}
          itemContent={(_, transaction) => (
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
                      transaction.type === "income" ||
                      transaction.category === "trf-transfer-in"
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
          )}
        />
      </div>
    </div>
  );
};

export default TransactionsMobileView;
