"use client";

import { Dispatch, SetStateAction, useMemo } from "react";
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
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowRightLeft,
} from "lucide-react";
import { TransactionResponse } from "@/lib/models/transaction";
import { formatCategory, convertAndFormat, formatDate } from "@/lib/utils";
import { UserResponse } from "@/lib/models/user";
import { RateResponse } from "@/lib/models/summary";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

type TransactionsDesktopViewProps = {
  transactions: TransactionResponse[];
  rate: RateResponse;
  user: UserResponse;
  setEditingTransaction: Dispatch<SetStateAction<TransactionResponse | null>>;
  setDeletingTransaction: Dispatch<SetStateAction<TransactionResponse | null>>;
};

const TransactionsDesktopView = ({
  transactions,
  setEditingTransaction,
  setDeletingTransaction,
  rate,
  user,
}: TransactionsDesktopViewProps) => {
  const columns: ColumnDef<TransactionResponse>[] = useMemo(() => {
    return [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
          return <div>{formatDate(row.getValue("date"))}</div>;
        },
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const transaction = row.original;
          return (
            <div className="flex items-center gap-1.5">
              {transaction.type === "income" && (
                <ArrowUpCircle className="w-4 h-4 text-emerald-600" />
              )}
              {transaction.type === "expense" && (
                <ArrowDownCircle className="w-4 h-4 text-destructive" />
              )}
              {transaction.type === "transfer" && (
                <ArrowRightLeft
                  className={`w-4 h-4 ${transaction.category === "trf-transfer-in" ? "text-emerald-600" : "text-destructive"}`}
                />
              )}
              <span className="capitalize">{transaction.type}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          return <div>{formatCategory(row.getValue("category"))}</div>;
        },
      },
      {
        accessorKey: "account",
        header: "Account",
        cell: ({ row }) => {
          const transaction = row.original;
          return (
            <Badge variant="secondary">
              {transaction.account.toUpperCase()}
            </Badge>
          );
        },
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
          const transaction = row.original;
          const amount = transaction.amount;
          const formatted = convertAndFormat(
            amount,
            transaction.currency,
            user.currency,
            rate,
          );

          return (
            <div
              className={`text-right font-medium ${
                transaction.type === "income" ||
                transaction.category === "trf-transfer-in"
                  ? "text-emerald-600"
                  : "text-destructive"
              }`}
            >
              {formatted}
            </div>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const transaction = row.original;

          return (
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
          );
        },
      },
    ];
  }, []);

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 p-2 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TransactionsDesktopView;
