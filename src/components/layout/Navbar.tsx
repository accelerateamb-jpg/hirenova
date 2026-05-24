"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Briefcase,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
} from "lucide-react";

interface NavbarProps {
  variant?: "landing" | "candidate" | "company" | "admin";
  candidateName?: string;
}

export default function Navbar({
  variant = "landing",
  candidateName,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b",
        variant === "landing"
          ? "bg-white/80 backdrop-blur-xl border-white/20 shadow-sm"
          : "bg-white border-slate-100 shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-indigo-200 group-hover:shadow-md transition-shadow">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Hire<span className="text-indigo-600">Nova</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {variant === "landing" && (
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/candidate/jobs"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
              >
                Find Jobs
              </Link>
              <Link
                href="/company/login"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
              >
                For Companies
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                  Resources <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </nav>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {variant === "landing" && (
              <>
                <Link href="/candidate/login">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    Sign In
                  </Button>
                </Link>
                <Link href="/candidate/register">
                  <Button size="sm" className="hidden sm:flex">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {(variant === "candidate" || variant === "company" || variant === "admin") && (
              <div className="flex items-center gap-3">
                <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
                </button>
                <div className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {candidateName?.[0] ?? "U"}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900 leading-none">
                      {candidateName ?? "User"}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">{variant}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && variant === "landing" && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-2">
          <Link
            href="/candidate/jobs"
            className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
          >
            Find Jobs
          </Link>
          <Link
            href="/company/login"
            className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
          >
            For Companies
          </Link>
          <div className="flex gap-2 pt-2">
            <Link href="/candidate/login" className="flex-1">
              <Button variant="outline" size="sm" fullWidth>
                Sign In
              </Button>
            </Link>
            <Link href="/candidate/register" className="flex-1">
              <Button size="sm" fullWidth>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
