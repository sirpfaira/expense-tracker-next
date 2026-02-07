"use client";

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
import { DialogFooter } from "@/components/ui/dialog";
import {
  CategoryType,
  ICON_OPTIONS,
  COLOR_OPTIONS,
  CategoryFormData,
} from "@/lib/models/category";
import {
  Tags,
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
  LucideIcon,
  ShoppingBasket,
  BriefcaseBusiness,
  Sofa,
  Church,
  CircleDollarSign,
} from "lucide-react";

type CategoryFormProps = {
  formData: CategoryFormData;
  setFormData: React.Dispatch<React.SetStateAction<CategoryFormData>>;
  onSubmit: () => void;
  submitLabel: string;
  isSubmitting: boolean;
};

const CategoryForm = ({
  formData,
  setFormData,
  onSubmit,
  submitLabel,
  isSubmitting,
}: CategoryFormProps) => (
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

export default CategoryForm;

const ICON_MAP: Record<string, LucideIcon> = {
  utensils: Utensils,
  car: Car,
  film: Film,
  zap: Zap,
  "heart-pulse": HeartPulse,
  "shopping-bag": ShoppingBag,
  "shopping-basket": ShoppingBasket,
  "graduation-cap": GraduationCap,
  plane: Plane,
  briefcase: Briefcase,
  "briefcase-business": BriefcaseBusiness,
  laptop: Laptop,
  "trending-up": TrendingUp,
  gift: Gift,
  "plus-circle": PlusCircle,
  "minus-circle": MinusCircle,
  home: Home,
  church: Church,
  sofa: Sofa,
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
  "circle-dollar-sign": CircleDollarSign,
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
