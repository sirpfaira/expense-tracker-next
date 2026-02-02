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
import { WishForm } from "./wish-form";
import { WishResponse, WishFormValues } from "@/lib/models/wish";
import { useUpdateWish, useDeleteWish } from "@/hooks/use-wishes";
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

interface WishesListProps {
  wishes: WishResponse[];
  rate: RateResponse | undefined;
  user: UserResponse;
}

export function WishList({ wishes, rate, user }: WishesListProps) {
  const [editingWish, setEditingWish] = useState<WishResponse | null>(null);
  const [deletingWish, setDeletingWish] = useState<WishResponse | null>(null);

  const updateMutation = useUpdateWish();
  const deleteMutation = useDeleteWish();

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

  if (wishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <ArrowDownCircle className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No wishes yet</p>
        <p className="text-sm text-muted-foreground">
          Add your first wish to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wishes.map((wish) => (
          <WishCard
            key={wish.id}
            wish={wish}
            rate={rate}
            user={user}
            setEditingWish={setEditingWish}
            setDeletingWish={setDeletingWish}
          />
        ))}
        {wishes.length === 0 && (
          <div className="col-span-full text-center p-8 text-muted-foreground border border-dashed rounded-lg">
            No wishes found. Create one to get started.
          </div>
        )}
      </div>
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
    </>
  );
}

interface WishCardProps {
  wish: WishResponse;
  rate: RateResponse | undefined;
  user: UserResponse;
  setEditingWish: Dispatch<SetStateAction<WishResponse | null>>;
  setDeletingWish: Dispatch<SetStateAction<WishResponse | null>>;
}

const iconMap = {
  bank: CreditCard,
  cash: Banknote,
  savings: PiggyBank,
};

export function WishCard({
  wish,
  rate,
  user,
  setEditingWish,
  setDeletingWish,
}: WishCardProps) {
  //   const Icon = iconMap[wish.type] || CreditCard;

  return (
    <div className="flex flex-col w-full max-w-md space-y-1 p-4 md:p-6 bg-card rounded-xl border shadow-sm ">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* <div className="p-3 bg-primary/10 rounded-full text-primary">
            <Icon className="size-6" />
          </div> */}
          <div className="flex flex-col">
            <p className="text-lg font-medium">{wish.description}</p>
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
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setEditingWish(wish)}>
                  <PencilIcon />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ShareIcon />
                  Share
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeletingWish(wish)}
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
        <span className="text-sm px-1">{`${wish.currency.toUpperCase()}`}</span>
        <div className="text-right mx-3">
          <p className={`font-medium text-lg text-emerald-600`}>
            {convertAndFormat(wish.amount, wish.currency, user.currency, rate)}
          </p>
        </div>
      </div>
    </div>
  );
}
