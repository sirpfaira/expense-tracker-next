import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDate = (
  dateString: string,
  option: "FULL" | "SHORT" = "FULL",
) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "2-digit", // "numeric" | "2-digit" | "long" | "short" | "narrow"
    day: "2-digit", // "numeric" | "2-digit"
  };
  if (option === "FULL") {
    options.year = "2-digit"; // "numeric" | "2-digit"
    // options.weekday = "short"; // "long" | "short" | "narrow"
    // options.hour = "numeric"; // "numeric" | "2-digit"
    // options.minute = "numeric"; // "numeric" | "2-digit"
    // options.second = "numeric"; // "numeric" | "2-digit"
    // options.hour12 = true;
  }

  return date.toLocaleDateString("en-GB", options);
};
