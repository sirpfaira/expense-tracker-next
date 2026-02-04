"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Plus } from "lucide-react";
import { AccountForm } from "@/components/accounts/account-form";
import { AccountsList } from "@/components/accounts/accounts-list";
import {
  useAccounts,
  useCreateAccount,
  useTransferAccount,
} from "@/hooks/use-accounts";
import { AccountFormValues, TransferInput } from "@/lib/models/account";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import LoadingIndicator from "@/components/layout/loading-indicator";
import { useRates } from "@/hooks/use-rates";
import { AccountTransferForm } from "@/components/accounts/account-transfer-form";

export default function AccountsPage() {
  const { user } = useAuth();
  const { data: accounts } = useAccounts();
  const { data: rate } = useRates();
  const createMutation = useCreateAccount();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const transferMutation = useTransferAccount();

  const handleCreate = async (data: AccountFormValues) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Account created successfully");
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create account",
      );
    }
  };

  const handleTransfer = async (data: TransferInput) => {
    try {
      await transferMutation.mutateAsync(data);
      toast.success("Transfer created successfully");
      setIsTransferDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create transfer",
      );
    }
  };

  return (
    <>
      {user && accounts && rate ? (
        <div className="flex flex-col space-y-4 p-2 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Accounts</h1>
              <p className="text-muted-foreground text-sm">
                View and manage all your accounts
              </p>
            </div>
            {user.role === "admin" && (
              <div className="flex space-x-4">
                <Dialog
                  open={isTransferDialogOpen}
                  onOpenChange={setIsTransferDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <ArrowRightLeft className="size-4" />
                      <span className="hidden md:inline-block">Transfer</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Transfer</DialogTitle>
                      <DialogDescription>
                        Transfer from one account to another
                      </DialogDescription>
                    </DialogHeader>
                    <AccountTransferForm
                      accounts={accounts}
                      onSubmit={handleTransfer}
                      onCancel={() => setIsTransferDialogOpen(false)}
                      isLoading={transferMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={isCreateDialogOpen}
                  onOpenChange={setIsCreateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="size-4" />
                      <span className="hidden md:inline-block">
                        Add Account
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Account</DialogTitle>
                      <DialogDescription>
                        Enter the details for your new account.
                      </DialogDescription>
                    </DialogHeader>
                    <AccountForm
                      onSubmit={handleCreate}
                      onCancel={() => setIsCreateDialogOpen(false)}
                      isLoading={createMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
          <AccountsList accounts={accounts} rate={rate} user={user} />
        </div>
      ) : (
        <LoadingIndicator />
      )}
    </>
  );
}
