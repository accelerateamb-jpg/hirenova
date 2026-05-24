"use client";

import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  children,
  className,
  hover = false,
  glass = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-100 bg-white",
        "card-shadow",
        hover && "card-shadow-hover transition-all duration-300 cursor-pointer",
        glass && "glass",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: string;
  description?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon,
  color = "#4f46e5",
  description,
}: StatCardProps) {
  return (
    <Card hover className="flex items-start gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        {change !== undefined && (
          <p
            className={cn(
              "text-xs font-medium mt-1",
              change >= 0 ? "text-emerald-600" : "text-red-500"
            )}
          >
            {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% this week
          </p>
        )}
        {description && (
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        )}
      </div>
    </Card>
  );
}
