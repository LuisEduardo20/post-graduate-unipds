import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getRiskColor(riskPercentage: number): string {
  if (riskPercentage < 30)
    return "bg-green-100 text-green-800 border-green-300";
  if (riskPercentage < 60)
    return "bg-yellow-100 text-yellow-800 border-yellow-300";
  if (riskPercentage < 80)
    return "bg-orange-100 text-orange-800 border-orange-300";
  return "bg-red-100 text-red-800 border-red-300";
}

export function getRiskLevel(riskPercentage: number): string {
  if (riskPercentage < 30) return "Baixo";
  if (riskPercentage < 60) return "Moderado";
  if (riskPercentage < 80) return "Elevado";
  return "Muito Elevado";
}
