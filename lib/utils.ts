import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AccountCurrency } from "./models/account";
import { RateResponse } from "./models/summary";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number, currency: AccountCurrency) => {
  if (currency === "zar") {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(amount);
  } else {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }
};

export const convertAmount = (
  amount: number,
  amountCurrency: AccountCurrency,
  userCurrency: AccountCurrency,
  rate: RateResponse | undefined,
) => {
  let converted = amount;

  if (rate) {
    if (amountCurrency === "zar" && userCurrency === "usd") {
      converted = amount * (1 / rate.value);
    }
    if (amountCurrency === "usd" && userCurrency === "zar") {
      converted = amount * rate.value;
    }
  }
  return converted;
};

export const convertAndFormat = (
  amount: number,
  amountCurrency: AccountCurrency,
  userCurrency: AccountCurrency,
  rate: RateResponse | undefined,
) => {
  const converted = convertAmount(amount, amountCurrency, userCurrency, rate);
  return formatCurrency(converted, userCurrency);
};

export const formatDate = (
  dateString: string,
  option: "FULL" | "MEDIUM" | "SHORT" = "FULL",
) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "2-digit", // "numeric" | "2-digit" | "long" | "short" | "narrow"
    day: "2-digit", // "numeric" | "2-digit"
  };

  if (option === "MEDIUM") {
    options.year = "2-digit";
  }
  if (option === "FULL") {
    options.year = "numeric"; // "numeric" | "2-digit"
    // options.weekday = "short"; // "long" | "short" | "narrow"
    // options.hour = "numeric"; // "numeric" | "2-digit"
    // options.minute = "numeric"; // "numeric" | "2-digit"
    // options.second = "numeric"; // "numeric" | "2-digit"
    // options.hour12 = true;
  }

  return date.toLocaleDateString("en-GB", options);
};

export const formatCategory = (uid: string) => {
  return uid
    .replace(/^[a-z]{3}-/, "") // Removes any 3-letter prefix + hyphen (id-, bn-, etc.)
    .split("-") // Splits "two-pears" into ["two", "pears"]
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
