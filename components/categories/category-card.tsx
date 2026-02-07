"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryResponse } from "@/lib/models/category";
import {
  Tags,
  Pencil,
  Trash2,
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

type CategoryCardProps = {
  category: CategoryResponse;
  openEditDialog: (category: CategoryResponse) => void;
  setDeletingCategory: (category: CategoryResponse | null) => void;
  role: string;
};

const CategoryCard = ({
  category,
  openEditDialog,
  setDeletingCategory,
  role,
}: CategoryCardProps) => (
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
    {role === "admin" && (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => openEditDialog(category)}
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeletingCategory(category)}
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
    )}
  </div>
);

export default CategoryCard;

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
