import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(cents?: number, currency = "USD") {
  if (typeof cents !== "number") return "Price unavailable";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(cents / 100);
}

export function formatDateTime(value?: string) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function inventoryLabel(status: string) {
  if (status === "in_stock") return "In Stock";
  if (status === "limited_stock") return "Limited Stock";
  return "Out of Stock";
}
