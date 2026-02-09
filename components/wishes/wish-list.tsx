"use client";

import { Dispatch, SetStateAction, useMemo, useState } from "react";
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
import { Pencil, ShoppingCart, Trash2 } from "lucide-react";
import { ArrowDownCircle } from "lucide-react";
import { WishForm } from "./wish-form";
import { WishResponse, WishFormValues } from "@/lib/models/wish";
import { useUpdateWish, useDeleteWish } from "@/hooks/use-wishes";
import { toast } from "sonner";
import {
  convertAmount,
  convertAndFormat,
  formatCurrency,
  formatDate,
} from "@/lib/utils";
import { RateResponse } from "@/lib/models/summary";
import { Button } from "@/components/ui/button";
import { UserResponse } from "@/lib/models/user";
import { Progress } from "@/components/ui/progress";
import { AccountResponse } from "@/lib/models/account";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WishesListProps {
  wishes: WishResponse[];
  accounts: AccountResponse[];
  rate: RateResponse | undefined;
  user: UserResponse;
}

type AllocatedWish = WishResponse & {
  allocation: number;
};

export function WishList({ wishes, accounts, rate, user }: WishesListProps) {
  const [editingWish, setEditingWish] = useState<WishResponse | null>(null);
  const [deletingWish, setDeletingWish] = useState<WishResponse | null>(null);
  const updateMutation = useUpdateWish();
  const deleteMutation = useDeleteWish();

  const allocatedWishes = useMemo(() => {
    const totalSavings = accounts
      .filter((t) => t.type === "savings")
      .reduce(
        (sum, b) =>
          sum + convertAmount(b.balance, b.currency, user.currency, rate),
        0,
      );
    let savings = totalSavings || 0;
    return [...wishes]
      .filter((t) => t.fulfilled === false)
      .sort((a, b) => b.priority - a.priority)
      .map((project) => {
        const allocation = Math.min(
          convertAmount(project.amount, project.currency, user.currency, rate),
          savings,
        );
        savings -= allocation;

        return {
          ...project,
          allocation,
        };
      });
  }, [wishes, accounts]);

  const fulfilledWishes = useMemo(() => {
    return wishes
      .filter((t) => t.fulfilled === true)
      .map((project) => ({
        ...project,
        allocation: project.amount,
      }));
  }, [wishes]);

  const handleUpdate = async (data: WishFormValues) => {
    if (!editingWish) return;

    try {
      await updateMutation.mutateAsync({
        id: editingWish.id,
        ...data,
      });
      toast.success("Wish updated successfully");
      setEditingWish(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update wish",
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingWish) return;

    try {
      await deleteMutation.mutateAsync(deletingWish.id);
      toast.success("Wish deleted successfully");
      setDeletingWish(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete wish",
      );
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {wishes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <ArrowDownCircle className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No wishes yet</p>
          <p className="text-sm text-muted-foreground">
            Add your first wish to get started
          </p>
        </div>
      ) : (
        <Tabs defaultValue="pending" className="">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allocatedWishes
                .sort((a, b) => b.priority - a.priority)
                .map((wish) => (
                  <WishCard
                    key={wish.id}
                    wish={wish}
                    rate={rate}
                    user={user}
                    setEditingWish={setEditingWish}
                    setDeletingWish={setDeletingWish}
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="fulfilled">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {fulfilledWishes
                .sort((a, b) => b.priority - a.priority)
                .map((wish) => (
                  <WishCard
                    key={wish.id}
                    wish={wish}
                    rate={rate}
                    user={user}
                    setEditingWish={setEditingWish}
                    setDeletingWish={setDeletingWish}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
      {/* Edit Dialog */}
      <Dialog
        open={!!editingWish}
        onOpenChange={(open) => !open && setEditingWish(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Wish</DialogTitle>
            <DialogDescription>
              Update the wish details below.
            </DialogDescription>
          </DialogHeader>
          <WishForm
            wish={editingWish}
            onSubmit={handleUpdate}
            onCancel={() => setEditingWish(null)}
            isLoading={updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingWish}
        onOpenChange={(open) => !open && setDeletingWish(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Wish</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this wish? This action cannot be
              undone.
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
    </div>
  );
}

interface WishCardProps {
  wish: AllocatedWish;
  rate: RateResponse | undefined;
  user: UserResponse;
  setEditingWish: Dispatch<SetStateAction<WishResponse | null>>;
  setDeletingWish: Dispatch<SetStateAction<WishResponse | null>>;
}

export function WishCard({
  wish,
  rate,
  user,
  setEditingWish,
  setDeletingWish,
}: WishCardProps) {
  const progress = Math.min((wish.allocation / wish.amount) * 100, 100);

  return (
    <div className="p-6 bg-card rounded-xl border shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full text-primary">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{wish.description}</h3>
            <p className="text-sm text-muted-foreground">
              Target: {formatDate(wish.date, "FULL")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user.role === "admin" && (
            <div className="flex">
              <Button
                onClick={() => setEditingWish(wish)}
                variant={"ghost"}
                size={"icon"}
                aria-label="Edit savings goal"
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>

              <Button
                onClick={() => setDeletingWish(wish)}
                variant={"ghost"}
                size={"icon"}
                className="hover:bg-destructive/10 group"
                aria-label="Delete savings goal"
              >
                <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-destructive" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progress.toFixed(0)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm font-medium">
          <span>{formatCurrency(wish.allocation, user.currency)}</span>
          <span className="text-muted-foreground">
            of{" "}
            {convertAndFormat(wish.amount, wish.currency, user.currency, rate)}
          </span>
        </div>
      </div>
    </div>
  );
}
