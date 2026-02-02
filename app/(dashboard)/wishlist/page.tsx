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
import { WishForm } from "@/components/wishes/wish-form";
import { WishList } from "@/components/wishes/wish-list";
import { useWishes, useCreateWish } from "@/hooks/use-wishes";
import { WishFormValues } from "@/lib/models/wish";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import LoadingIndicator from "@/components/layout/loading-indicator";
import { useRates } from "@/hooks/use-rates";

export default function WishesPage() {
  const { user } = useAuth();
  const { data: wishes, isLoading: wishesLoading } = useWishes();
  const { data: rate } = useRates();
  const createMutation = useCreateWish();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreate = async (data: WishFormValues) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Wish created successfully");
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create wish",
      );
    }
  };

  return (
    <>
      {user && wishes ? (
        <div className="flex flex-col space-y-4 p-2 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Wishes</h1>
              <p className="text-muted-foreground text-sm">
                View and manage all your wishes
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
                    <span className="hidden md:inline-block">Add Wish</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Wish</DialogTitle>
                    <DialogDescription>
                      Enter the details for your new wish.
                    </DialogDescription>
                  </DialogHeader>
                  <WishForm
                    onSubmit={handleCreate}
                    onCancel={() => setIsCreateDialogOpen(false)}
                    isLoading={createMutation.isPending}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
          {wishesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <WishList
              wishes={wishes || []}
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
