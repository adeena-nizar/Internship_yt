import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertRelativeDate(relativeDate: string): Date {
  const now = new Date();
  const parts = relativeDate.split(" ");
  const value = parseInt(parts[0], 10);
  const unit = parts[1];

  if (unit.startsWith("day")) {
    now.setDate(now.getDate() - value);
  } else if (unit.startsWith("week")) {
    now.setDate(now.getDate() - value * 7);
  } else if (unit.startsWith("month")) {
    now.setMonth(now.getMonth() - value);
  } else if (unit.startsWith("year")) {
    now.setFullYear(now.getFullYear() - value);
  } else if (unit.startsWith("hour")) {
    now.setHours(now.getHours() - value);
  }

  return now;
}