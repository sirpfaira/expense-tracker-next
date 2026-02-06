"use client";

import { Dispatch, SetStateAction } from "react";
import { TransactionResponse } from "@/lib/models/transaction";
import { formatCategory, convertAndFormat, formatDate } from "@/lib/utils";
import { UserResponse } from "@/lib/models/user";
import { RateResponse } from "@/lib/models/summary";
import { Virtuoso } from "react-virtuoso";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type TransactionsMobileViewProps = {
  transactions: TransactionResponse[];
  rate: RateResponse;
  user: UserResponse;
  setDeletingTransaction: Dispatch<SetStateAction<TransactionResponse | null>>;
};

const TransactionsMobileView = ({
  transactions,
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
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              rate={rate}
              user={user}
              setDeletingTransaction={setDeletingTransaction}
            />
          )}
        />
      </div>
    </div>
  );
};

export default TransactionsMobileView;

type TransactionCardProps = {
  transaction: TransactionResponse;
  rate: RateResponse;
  user: UserResponse;
  setDeletingTransaction: Dispatch<SetStateAction<TransactionResponse | null>>;
};

function TransactionCard({
  transaction,
  rate,
  user,
  setDeletingTransaction,
}: TransactionCardProps) {
  return (
    <Drawer>
      <DrawerTrigger className="w-full">
        <div className="flex items-center justify-between py-2 w-full">
          <div className="flex items-center gap-3 max-w-[70%]">
            <div className="flex flex-col items-start w-full">
              <p className="text-sm font-medium">
                {formatCategory(transaction.category)}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                <span> {formatDate(transaction.date, "SHORT")}</span>
                <span> - </span>
                <span className="capitalize">{transaction.description}</span>
              </p>
            </div>
          </div>
          <span
            className={`font-medium text-sm ${
              transaction.type === "income" ||
              transaction.category === "trf-transfer-in"
                ? "text-green-600"
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
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Transaction Details</DrawerTitle>
          <DrawerDescription>
            View and delete transaction details here.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex items-center justify-between py-2 px-5">
          <div className="flex items-center gap-3 max-w-[70%]">
            <div className="w-full">
              <p className="text-sm font-medium">
                <span className="capitalize text-sm font-medium">
                  {transaction.description}
                </span>
              </p>
              <div className="text-xs text-muted-foreground truncate">
                <p>
                  {transaction.account.toUpperCase()} <span> - </span>
                  <span className="capitalize">{transaction.type}</span>
                  <span> - </span>
                  <span className="">
                    {formatCategory(transaction.category)}
                  </span>
                </p>
                <p> {formatDate(transaction.date, "FULL")}</p>
              </div>
            </div>
          </div>
          <span
            className={`font-medium text-sm ${
              transaction.type === "income" ||
              transaction.category === "trf-transfer-in"
                ? "text-green-600"
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
        <DrawerFooter>
          {user.username === transaction.username && (
            <DrawerClose>
              <span
                className="flex items-center w-full justify-center bg-destructive text-primary-foreground rounded-md p-1.5"
                onClick={() => setDeletingTransaction(transaction)}
              >
                Delete
              </span>
            </DrawerClose>
          )}
          <DrawerClose>
            <span className="flex items-center w-full justify-center bg-primary text-primary-foreground rounded-md p-1.5">
              Close
            </span>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
