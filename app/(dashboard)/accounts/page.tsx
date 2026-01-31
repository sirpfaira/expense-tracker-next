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
import { Loader2, Plus } from "lucide-react";
import { AccountForm } from "@/components/accounts/account-form";
import { AccountsList } from "@/components/accounts/accounts-list";
import { useAccounts, useCreateAccount } from "@/hooks/use-accounts";
import { AccountFormValues } from "@/lib/models/account";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import LoadingIndicator from "@/components/layout/loading-indicator";
import { useRates } from "@/hooks/use-rates";

export default function AccountsPage() {
  const { user } = useAuth();
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: rate } = useRates();
  const createMutation = useCreateAccount();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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

  return (
    <>
      {user && accounts ? (
        <div className="flex flex-col space-y-4 p-2 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Accounts</h1>
              <p className="text-muted-foreground text-sm">
                View and manage all your accounts
              </p>
            </div>
            {user.role === "admin" && (
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="size-4" />
                    <span className="hidden md:inline-block">Add Account</span>
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
            )}
          </div>
          {accountsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <AccountsList
              accounts={accounts || []}
              currency={user.currency}
              rate={rate}
              user={user}
            />
          )}
        </div>
      ) : (
        <LoadingIndicator />
      )}
    </>
  );
}
