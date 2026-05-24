"use client";

import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple"
  | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-indigo-100 text-indigo-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  outline: "border border-slate-200 text-slate-600 bg-transparent",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    pending: { label: "Pending", variant: "warning" },
    reviewed: { label: "Reviewed", variant: "info" },
    shortlisted: { label: "Shortlisted", variant: "purple" },
    rejected: { label: "Rejected", variant: "danger" },
    hired: { label: "Hired", variant: "success" },
    active: { label: "Active", variant: "success" },
    inactive: { label: "Inactive", variant: "outline" },
    approved: { label: "Approved", variant: "success" },
    suspended: { label: "Suspended", variant: "danger" },
    success: { label: "Success", variant: "success" },
    failed: { label: "Failed", variant: "danger" },
    refunded: { label: "Refunded", variant: "warning" },
  };
  const config = map[status] ?? { label: status, variant: "default" as BadgeVariant };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
