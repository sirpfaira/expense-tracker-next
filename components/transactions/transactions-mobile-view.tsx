"use client";

import { Dispatch, SetStateAction } from "react";
import { TransactionResponse } from "@/lib/models/transaction";
import { formatCategory, convertAndFormat, formatDate } from "@/lib/utils";
import { UserResponse } from "@/lib/models/user";
import { RateResponse } from "@/lib/models/summary";
import { Virtuoso } from "react-virtuoso";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
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
import { CategoryResponse } from "@/lib/models/category";

type TransactionsMobileViewProps = {
  transactions: TransactionResponse[];
  categories: CategoryResponse[];
  rate: RateResponse;
  user: UserResponse;
  setDeletingTransaction: Dispatch<SetStateAction<TransactionResponse | null>>;
};

const TransactionsMobileView = ({
  transactions,
  categories,
  setDeletingTransaction,
  rate,
  user,
}: TransactionsMobileViewProps) => {
  return (
    <div className="flex flex-col h-[75vh]">
      <div className="flex flex-col h-full">
        <Virtuoso
          style={{ height: "100%" }}
          data={transactions}
          itemContent={(_, transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              categories={categories}
              rate={rate}
              user={user}
              setDeletingTransaction={setDeletingTransaction}
            />
          )}
        />
      </div>
    </div>
  );
};

export default TransactionsMobileView;

type TransactionCardProps = {
  transaction: TransactionResponse;
  categories: CategoryResponse[];
  rate: RateResponse;
  user: UserResponse;
  setDeletingTransaction: Dispatch<SetStateAction<TransactionResponse | null>>;
};

function TransactionCard({
  transaction,
  categories,
  rate,
  user,
  setDeletingTransaction,
}: TransactionCardProps) {
  const category = categories.find((cat) => cat.uid === transaction.category);
  const catIconString = category?.icon || "circle-dollar-sign";
  const color = category?.color || "#3b82f6";
  const IconComponent = ICON_MAP[catIconString];
  return (
    <Drawer>
      <DrawerTrigger className="w-full">
        <div className="flex items-center justify-between py-2 w-full pr-3">
          <div className="flex items-center gap-3 max-w-[70%]">
            <div className="flex flex-col items-start w-full">
              <p className="text-sm font-medium">
                {formatCategory(transaction.category)}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                <span> {formatDate(transaction.date, "SHORT")}</span>
                <span> - </span>
                <span className="capitalize">{transaction.description}</span>
              </p>
            </div>
          </div>
          <span
            className={`font-medium text-sm ${
              transaction.type === "income" ||
              transaction.category === "trf-transfer-in"
                ? "text-green-600"
                : "text-destructive"
            }`}
          >
            {convertAndFormat(
              transaction.amount,
              transaction.currency,
              user.currency,
              rate,
            )}
          </span>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex flex-col px-2 items-start w-full">
            <DrawerTitle>Transaction Details</DrawerTitle>
            <DrawerDescription>
              <p>
                <span>Added by {transaction.username}</span>
                <span> on {formatDate(transaction.date, "FULL")}</span>
              </p>
            </DrawerDescription>
          </div>
        </DrawerHeader>
        <div className="flex items-center justify-between py-2 px-5">
          <div className="flex items-center gap-3 max-w-[70%]">
            <div
              className="size-12 px-2 rounded-md flex items-center justify-center"
              style={{ backgroundColor: `${color}20` }}
            >
              <IconComponent className="size-8" style={{ color }} />
            </div>
            <div className="w-full">
              <p className="text-sm font-medium">
                <span className="capitalize text-sm font-medium">
                  {transaction.description}
                </span>
              </p>
              <div className="flex items-center gap-2 text-muted-foreground truncate">
                <span className="text-xs">
                  {transaction.account.toUpperCase()}
                </span>
                <span>•</span>
                <span className="text-sm">
                  {formatCategory(transaction.category)}
                </span>
              </div>
            </div>
          </div>
          <span
            className={`font-medium text-sm ${
              transaction.type === "income" ||
              transaction.category === "trf-transfer-in"
                ? "text-green-600"
                : "text-destructive"
            }`}
          >
            {convertAndFormat(
              transaction.amount,
              transaction.currency,
              user.currency,
              rate,
            )}
          </span>
        </div>
        <DrawerFooter>
          {user.username === transaction.username && (
            <DrawerClose>
              <span
                className="flex items-center w-full justify-center bg-destructive text-primary-foreground rounded-md p-1.5"
                onClick={() => setDeletingTransaction(transaction)}
              >
                Delete
              </span>
            </DrawerClose>
          )}
          <DrawerClose>
            <span className="flex items-center w-full justify-center bg-primary text-primary-foreground rounded-md p-1.5">
              Close
            </span>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

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
