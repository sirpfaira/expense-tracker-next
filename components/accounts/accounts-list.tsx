"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  EllipsisVertical,
  PencilIcon,
  ShareIcon,
  TrashIcon,
} from "lucide-react";
import { ArrowDownCircle, CreditCard, Banknote, PiggyBank } from "lucide-react";
import { AccountForm } from "./account-form";
import { AccountResponse, AccountFormValues } from "@/lib/models/account";
import { useUpdateAccount, useDeleteAccount } from "@/hooks/use-accounts";
import { toast } from "sonner";
import { convertAndFormat } from "@/lib/utils";
import { RateResponse } from "@/lib/models/summary";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserResponse } from "@/lib/models/user";

interface AccountsListProps {
  accounts: AccountResponse[];
  rate: RateResponse | undefined;
  user: UserResponse;
}

export function AccountsList({ accounts, rate, user }: AccountsListProps) {
  const [editingAccount, setEditingAccount] = useState<AccountResponse | null>(
    null,
  );
  const [deletingAccount, setDeletingAccount] =
    useState<AccountResponse | null>(null);

  const updateMutation = useUpdateAccount();
  const deleteMutation = useDeleteAccount();

  const handleUpdate = async (data: AccountFormValues) => {
    if (!editingAccount) return;

    try {
      await updateMutation.mutateAsync({
        id: editingAccount.id,
        ...data,
      });
      toast.success("Account updated successfully");
      setEditingAccount(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update account",
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingAccount) return;

    try {
      await deleteMutation.mutateAsync(deletingAccount.id);
      toast.success("Account deleted successfully");
      setDeletingAccount(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete account",
      );
    }
  };

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <ArrowDownCircle className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No accounts yet</p>
        <p className="text-sm text-muted-foreground">
          Add your first account to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <AccountCard
            key={account.name}
            account={account}
            rate={rate}
            user={user}
            setEditingAccount={setEditingAccount}
            setDeletingAccount={setDeletingAccount}
          />
        ))}
        {accounts.length === 0 && (
          <div className="col-span-full text-center p-8 text-muted-foreground border border-dashed rounded-lg">
            No accounts found. Create one to get started.
          </div>
        )}
      </div>
      {/* Edit Dialog */}
      <Dialog
        open={!!editingAccount}
        onOpenChange={(open) => !open && setEditingAccount(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Update the account details below.
            </DialogDescription>
          </DialogHeader>
          <AccountForm
            account={editingAccount}
            onSubmit={handleUpdate}
            onCancel={() => setEditingAccount(null)}
            isLoading={updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingAccount}
        onOpenChange={(open) => !open && setDeletingAccount(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this account? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface AccountCardProps {
  account: AccountResponse;
  rate: RateResponse | undefined;
  user: UserResponse;
  setEditingAccount: Dispatch<SetStateAction<AccountResponse | null>>;
  setDeletingAccount: Dispatch<SetStateAction<AccountResponse | null>>;
}

const iconMap = {
  bank: CreditCard,
  cash: Banknote,
  savings: PiggyBank,
};

export function AccountCard({
  account,
  rate,
  user,
  setEditingAccount,
  setDeletingAccount,
}: AccountCardProps) {
  const Icon = iconMap[account.type] || CreditCard;

  return (
    <div className="flex flex-col w-full max-w-md space-y-1 p-4 md:p-6 bg-card rounded-xl border shadow-sm ">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full text-primary">
            <Icon className="size-6" />
          </div>
          <div className="flex flex-col">
            <p className="text-lg font-medium">{account.name}</p>
            <span className="text-sm text-muted-foreground ">
              {account.showInReports ? "Included" : "Not included"} in balance
            </span>
          </div>
        </div>
        {user.role === "admin" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <EllipsisVertical />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setEditingAccount(account)}>
                <PencilIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeletingAccount(account)}
                >
                  <TrashIcon />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm px-1">{`${account.shortCode.toUpperCase()} • ${account.currency.toUpperCase()} • ${account.type.toUpperCase()}`}</span>
        <div className="text-right mx-3">
          <p
            className={`font-medium text-lg ${
              account.balance > 0 ? "text-emerald-600" : "text-destructive"
            }`}
          >
            {convertAndFormat(
              account.balance,
              account.currency,
              user.currency,
              rate,
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
