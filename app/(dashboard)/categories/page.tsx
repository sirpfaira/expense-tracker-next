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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  CategoryResponse,
  CategoryType,
  ICON_OPTIONS,
  COLOR_OPTIONS,
} from "@/lib/models/category";
import {
  Tags,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Utensils,
  Car,
  Film,
  Zap,
  HeartPulse,
  ShoppingBag,
  GraduationCap,
  Plane,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  PlusCircle,
  MinusCircle,
  Home,
  Phone,
  Wifi,
  Music,
  Gamepad2,
  Dumbbell,
  Coffee,
  Beer,
  Pizza,
  Shirt,
  Scissors,
  Palette,
  Book,
  Newspaper,
  PiggyBank,
  Type as type,
  LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  utensils: Utensils,
  car: Car,
  film: Film,
  zap: Zap,
  "heart-pulse": HeartPulse,
  "shopping-bag": ShoppingBag,
  "graduation-cap": GraduationCap,
  plane: Plane,
  briefcase: Briefcase,
  laptop: Laptop,
  "trending-up": TrendingUp,
  gift: Gift,
  "plus-circle": PlusCircle,
  "minus-circle": MinusCircle,
  home: Home,
  phone: Phone,
  wifi: Wifi,
  music: Music,
  "gamepad-2": Gamepad2,
  dumbbell: Dumbbell,
  coffee: Coffee,
  beer: Beer,
  pizza: Pizza,
  shirt: Shirt,
  scissors: Scissors,
  palette: Palette,
  book: Book,
  newspaper: Newspaper,
  "piggy-bank": PiggyBank,
};

function CategoryIcon({
  icon,
  color,
  size = 20,
}: {
  icon: string;
  color: string;
  size?: number;
}) {
  const IconComponent = ICON_MAP[icon] || Tags;
  return <IconComponent size={size} style={{ color }} />;
}

interface CategoryFormData {
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
}

export default function CategoriesPage() {
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

  const CategoryForm = ({
    onSubmit,
    submitLabel,
    isLoading: isSubmitting,
  }: {
    onSubmit: () => void;
    submitLabel: string;
    isLoading: boolean;
  }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Category name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(v) =>
            setFormData({ ...formData, type: v as CategoryType })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="income">Income</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Icon</Label>
        <div className="grid grid-cols-6 gap-2 p-3 border rounded-md max-h-48 overflow-y-auto">
          {ICON_OPTIONS.map((icon) => (
            <button
              type="button"
              key={icon}
              onClick={() => setFormData({ ...formData, icon })}
              className={`p-2 rounded-md hover:bg-accent transition-colors ${
                formData.icon === icon ? "bg-accent ring-2 ring-primary" : ""
              }`}
            >
              <CategoryIcon icon={icon} color={formData.color} size={20} />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="grid grid-cols-9 gap-2">
          {COLOR_OPTIONS.map((color) => (
            <button
              type="button"
              key={color}
              onClick={() => setFormData({ ...formData, color })}
              className={`size-8 rounded-full transition-transform hover:scale-110 ${
                formData.color === color
                  ? "ring-2 ring-offset-2 ring-primary"
                  : ""
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/50">
        <div
          className="size-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${formData.color}20` }}
        >
          <CategoryIcon icon={formData.icon} color={formData.color} size={24} />
        </div>
        <div>
          <p className="font-medium">{formData.name || "Category Name"}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {formData.type}
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </Button>
      </DialogFooter>
    </div>
  );

  const CategoryCard = ({ category }: { category: CategoryResponse }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3">
        <div
          className="size-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <CategoryIcon icon={category.icon} color={category.color} size={20} />
        </div>
        <div>
          <p className="font-medium text-foreground">{category.name}</p>
          {category.isDefault && (
            <Badge variant="secondary" className="text-xs">
              Default
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => openEditDialog(category)}
        >
          <Pencil className="size-4" />
        </Button>
        {!category.isDefault && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeletingCategory(category)}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground">
            Manage your transaction categories
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="size-4" />
          Add Category
        </Button>
      </div>

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
                    <CategoryCard key={category.id} category={category} />
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
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
            onSubmit={handleCreate}
            submitLabel="Create Category"
            isLoading={createCategory.isPending}
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
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
            isLoading={updateCategory.isPending}
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
