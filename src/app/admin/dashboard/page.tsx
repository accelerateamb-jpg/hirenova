"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  Users, Building2, Briefcase, CreditCard,
  ArrowRight, ShieldCheck, CheckCircle, Clock,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/candidates").then((r) => r.json()),
    ]).then(([s, c]) => {
      setStats(s);
      setCandidates((c.candidates ?? []).slice(0, 5));
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="admin" userName="Admin" userRole="Super Admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="admin" candidateName="Admin" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Platform Overview</h1>
              <p className="text-sm text-slate-500 mt-0.5">HireNova Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-emerald-700">System Operational</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Candidates" value={loading ? "—" : (stats?.totalCandidates ?? 0).toLocaleString()}
              icon={<Users className="w-5 h-5" />} color="#4f46e5" />
            <StatCard label="Companies" value={loading ? "—" : (stats?.totalCompanies ?? 0).toLocaleString()}
              icon={<Building2 className="w-5 h-5" />} color="#2563eb" />
            <StatCard label="Active Jobs" value={loading ? "—" : (stats?.totalJobs ?? 0).toLocaleString()}
              icon={<Briefcase className="w-5 h-5" />} color="#7c3aed" />
            <StatCard label="Revenue Generated"
              value={loading ? "—" : `₹${((stats?.revenueGenerated ?? 0) / 100).toFixed(0) === "0" ? "0" : ((stats?.revenueGenerated ?? 0)).toLocaleString()}`}
              icon={<CreditCard className="w-5 h-5" />} color="#10b981" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Registrations */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900">Recent Registrations</h2>
                  <Link href="/admin/candidates">
                    <Button variant="ghost" size="sm" className="text-xs">View All <ArrowRight className="w-3.5 h-3.5" /></Button>
                  </Link>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />)}
                  </div>
                ) : candidates.length === 0 ? (
                  <div className="text-center py-10">
                    <Users className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">No candidates registered yet</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-50">
                        <th className="text-left text-xs text-slate-400 pb-2 font-medium">Name</th>
                        <th className="text-left text-xs text-slate-400 pb-2 font-medium hidden sm:table-cell">Email</th>
                        <th className="text-left text-xs text-slate-400 pb-2 font-medium">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {candidates.map((c: any) => (
                        <tr key={c.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-600">
                                {c.user?.name?.[0] ?? "?"}
                              </div>
                              <span className="text-sm font-medium text-slate-800">{c.user?.name ?? "—"}</span>
                            </div>
                          </td>
                          <td className="py-2.5 hidden sm:table-cell">
                            <span className="text-xs text-slate-500">{c.user?.email}</span>
                          </td>
                          <td className="py-2.5">
                            <Badge variant={c.paymentStatus === "paid" ? "success" : "warning"} className="text-xs">
                              {c.paymentStatus === "paid" ? "Paid" : "Pending"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                  <p className="text-xs text-slate-500 mb-1">Today&apos;s Registrations</p>
                  <p className="text-3xl font-bold text-slate-900">{loading ? "—" : stats?.dailyRegistrations ?? 0}</p>
                  <p className="text-xs text-slate-400 mt-1">new sign-ups today</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                  <p className="text-xs text-slate-500 mb-1">Total Applications</p>
                  <p className="text-3xl font-bold text-slate-900">{loading ? "—" : stats?.totalApplications ?? 0}</p>
                  <p className="text-xs text-slate-400 mt-1">across all jobs</p>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5">
              {/* System Status */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <h3 className="font-semibold text-slate-900 mb-4">System Status</h3>
                <div className="space-y-3">
                  {[
                    { label: "API Server", uptime: "99.9%" },
                    { label: "Database", uptime: "99.7%" },
                    { label: "Email Service", uptime: "99.5%" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-sm text-slate-700">{s.label}</span>
                      </div>
                      <span className="text-xs text-emerald-600 font-medium">{s.uptime}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <h3 className="font-semibold text-slate-900 mb-3">Quick Links</h3>
                <div className="space-y-2">
                  {[
                    { icon: <Building2 className="w-4 h-4 text-blue-500" />, text: "Review pending companies", link: "/admin/companies", bg: "bg-blue-50" },
                    { icon: <Users className="w-4 h-4 text-indigo-500" />, text: "Manage candidates", link: "/admin/candidates", bg: "bg-indigo-50" },
                    { icon: <CreditCard className="w-4 h-4 text-emerald-500" />, text: "View payments", link: "/admin/payments", bg: "bg-emerald-50" },
                    { icon: <Briefcase className="w-4 h-4 text-violet-500" />, text: "Moderate jobs", link: "/admin/jobs", bg: "bg-violet-50" },
                  ].map((item, i) => (
                    <Link key={i} href={item.link}>
                      <div className={`flex items-center gap-3 p-2.5 rounded-xl ${item.bg} hover:opacity-80 transition-opacity cursor-pointer`}>
                        {item.icon}
                        <span className="text-xs text-slate-700">{item.text}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 ml-auto" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
