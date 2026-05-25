"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Search,
  FileText,
  Briefcase,
  Users,
  Building2,
  CreditCard,
  Settings,
  LogOut,
  PlusCircle,
  BarChart3,
  ShieldCheck,
  Bell,
} from "lucide-react";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const candidateLinks: SidebarItem[] = [
  { label: "Dashboard", href: "/candidate/dashboard", icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
  { label: "My Profile", href: "/candidate/profile", icon: <User className="w-4.5 h-4.5" /> },
  { label: "Browse Jobs", href: "/candidate/jobs", icon: <Search className="w-4.5 h-4.5" /> },
  { label: "Applications", href: "/candidate/applications", icon: <FileText className="w-4.5 h-4.5" /> },
  { label: "Saved Jobs", href: "/candidate/saved", icon: <Briefcase className="w-4.5 h-4.5" /> },
  { label: "Notifications", href: "/candidate/notifications", icon: <Bell className="w-4.5 h-4.5" /> },
];

const companyLinks: SidebarItem[] = [
  { label: "Dashboard", href: "/company/dashboard", icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
  { label: "Post a Job", href: "/company/post-job", icon: <PlusCircle className="w-4.5 h-4.5" /> },
  { label: "Active Jobs", href: "/company/jobs", icon: <Briefcase className="w-4.5 h-4.5" /> },
  { label: "Applicants", href: "/company/applicants", icon: <Users className="w-4.5 h-4.5" /> },
  { label: "Analytics", href: "/company/analytics", icon: <BarChart3 className="w-4.5 h-4.5" /> },
  { label: "Settings", href: "/company/settings", icon: <Settings className="w-4.5 h-4.5" /> },
];

const adminLinks: SidebarItem[] = [
  { label: "Overview", href: "/admin/dashboard", icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
  { label: "Candidates", href: "/admin/candidates", icon: <Users className="w-4.5 h-4.5" /> },
  { label: "Companies", href: "/admin/companies", icon: <Building2 className="w-4.5 h-4.5" /> },
  { label: "Jobs", href: "/admin/jobs", icon: <Briefcase className="w-4.5 h-4.5" /> },
  { label: "Payments", href: "/admin/payments", icon: <CreditCard className="w-4.5 h-4.5" /> },
  { label: "Moderation", href: "/admin/moderation", icon: <ShieldCheck className="w-4.5 h-4.5" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="w-4.5 h-4.5" /> },
];

interface SidebarProps {
  variant: "candidate" | "company" | "admin";
  userName?: string;
  userRole?: string;
}

export default function Sidebar({ variant, userName, userRole }: SidebarProps) {
  const pathname = usePathname();

  const links =
    variant === "candidate"
      ? candidateLinks
      : variant === "company"
      ? companyLinks
      : adminLinks;

  const avatarColor =
    variant === "candidate"
      ? "bg-indigo-600"
      : variant === "company"
      ? "bg-blue-600"
      : "bg-slate-800";

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-100 flex flex-col sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">
            Hire<span className="text-indigo-600">Nova</span>
          </span>
        </Link>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm",
              avatarColor
            )}
          >
            {userName?.[0] ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {userName ?? "User"}
            </p>
            <p className="text-xs text-slate-500 capitalize">
              {userRole ?? variant}
            </p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-0.5">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== `/${variant}/dashboard` && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  "sidebar-link",
                  isActive
                    ? "bg-indigo-50 text-indigo-600 active"
                    : "text-slate-600"
                )}
              >
                <span className={isActive ? "text-indigo-600" : "text-slate-400"}>
                  {link.icon}
                </span>
                <span className="flex-1">{link.label}</span>
                {link.badge && (
                  <span className="w-5 h-5 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-100">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4.5 h-4.5" />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
