"use client";

import { useState } from "react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/use-categories";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CategoryFormData, CategoryResponse } from "@/lib/models/category";
import { Tags, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import LoadingIndicator from "@/components/layout/loading-indicator";
import CategoryCard from "@/components/categories/category-card";
import CategoryForm from "@/components/categories/category-form";

export default function CategoriesPage() {
  const { user } = useAuth();
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponse | null>(null);
  const [deletingCategory, setDeletingCategory] =
    useState<CategoryResponse | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    type: "expense",
    icon: "shopping-bag",
    color: "#3b82f6",
  });

  const expenseCategories =
    categories?.filter((c) => c.type === "expense") || [];
  const incomeCategories = categories?.filter((c) => c.type === "income") || [];

  const resetForm = () => {
    setFormData({
      name: "",
      type: "expense",
      icon: "shopping-bag",
      color: "#3b82f6",
    });
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      await createCategory.mutateAsync(formData);
      toast.success("Category created successfully");
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create category",
      );
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory || !formData.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      await updateCategory.mutateAsync({
        id: editingCategory.id,
        ...formData,
      });
      toast.success("Category updated successfully");
      setEditingCategory(null);
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update category",
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;

    try {
      await deleteCategory.mutateAsync(deletingCategory.id);
      toast.success("Category deleted successfully");
      setDeletingCategory(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category",
      );
    }
  };

  const openEditDialog = (category: CategoryResponse) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground">
            Manage your transaction categories
          </p>
        </div>
        {user && user.role === "admin" && (
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="size-4" />
            Add Category
          </Button>
        )}
      </div>
      {user && categories ? (
        <Tabs defaultValue="expense">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="expense">
              Expenses ({expenseCategories.length})
            </TabsTrigger>
            <TabsTrigger value="income">
              Income ({incomeCategories.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="expense" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tags className="size-5" />
                  Expense Categories
                </CardTitle>
                <CardDescription>
                  Categories for tracking your spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                {expenseCategories.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No expense categories yet
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {expenseCategories.map((category) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        openEditDialog={openEditDialog}
                        setDeletingCategory={setDeletingCategory}
                        role={user.role}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="income" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tags className="size-5" />
                  Income Categories
                </CardTitle>
                <CardDescription>
                  Categories for tracking your earnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {incomeCategories.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No income categories yet
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {incomeCategories.map((category) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        openEditDialog={openEditDialog}
                        setDeletingCategory={setDeletingCategory}
                        role={user.role}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <LoadingIndicator />
      )}
      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>
              Add a new category to organize your transactions
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreate}
            submitLabel="Create Category"
            isSubmitting={createCategory.isPending}
          />
        </DialogContent>
      </Dialog>
      {/* Edit Dialog */}
      <Dialog
        open={!!editingCategory}
        onOpenChange={() => setEditingCategory(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category details</DialogDescription>
          </DialogHeader>
          <CategoryForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdate}
            submitLabel="Update Category"
            isSubmitting={createCategory.isPending}
          />
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={() => setDeletingCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingCategory?.name}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteCategory.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
