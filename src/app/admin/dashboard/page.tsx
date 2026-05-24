"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { StatCard } from "@/components/ui/Card";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { adminStats, mockCandidates, mockCompanies, mockPayments, mockApplications } from "@/data/mock";
import Link from "next/link";
import {
  Users,
  Building2,
  Briefcase,
  CreditCard,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react";

export default function AdminDashboard() {
  const revenueMax = Math.max(...adminStats.revenueByMonth.map((r) => r.revenue));
  const regMax = Math.max(...adminStats.registrationsByDay.map((r) => r.count));

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="admin" userName="Admin" userRole="Super Admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="admin" candidateName="Admin" />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Platform Overview</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                HireNova Admin Dashboard · Last updated: just now
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-emerald-700">System Operational</span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total Candidates"
              value={adminStats.totalCandidates.toLocaleString()}
              change={adminStats.weeklyGrowth.candidates}
              icon={<Users className="w-5 h-5" />}
              color="#4f46e5"
            />
            <StatCard
              label="Companies"
              value={adminStats.totalCompanies.toLocaleString()}
              change={adminStats.weeklyGrowth.companies}
              icon={<Building2 className="w-5 h-5" />}
              color="#2563eb"
            />
            <StatCard
              label="Total Jobs"
              value={adminStats.totalJobs.toLocaleString()}
              change={adminStats.weeklyGrowth.jobs}
              icon={<Briefcase className="w-5 h-5" />}
              color="#7c3aed"
            />
            <StatCard
              label="Revenue Generated"
              value={`₹${(adminStats.revenueGenerated / 100000).toFixed(1)}L`}
              change={adminStats.weeklyGrowth.revenue}
              icon={<CreditCard className="w-5 h-5" />}
              color="#10b981"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left + Middle */}
            <div className="lg:col-span-2 space-y-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-semibold text-slate-900">Revenue Trend</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Monthly registration revenue (₹)</p>
                  </div>
                  <Badge variant="success" className="text-xs">+11.8% this week</Badge>
                </div>
                <div className="flex items-end gap-3 h-36">
                  {adminStats.revenueByMonth.map((month) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-slate-500">
                        ₹{(month.revenue / 1000).toFixed(0)}K
                      </span>
                      <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden" style={{ height: "80px" }}>
                        <div
                          className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all"
                          style={{ height: `${(month.revenue / revenueMax) * 80}px` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-600">{month.month}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Total Revenue (2026)</p>
                    <p className="text-lg font-bold text-slate-900">
                      ₹{(adminStats.revenueGenerated / 100000).toFixed(2)}L
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">This Month</p>
                    <p className="text-lg font-bold text-emerald-600">₹1.57L</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Avg Daily</p>
                    <p className="text-lg font-bold text-slate-900">₹5,230</p>
                  </div>
                </div>
              </div>

              {/* Daily Registrations */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-semibold text-slate-900">Daily Registrations</h2>
                    <p className="text-xs text-slate-500 mt-0.5">New candidate sign-ups this week</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">{adminStats.dailyRegistrations}</p>
                    <p className="text-xs text-slate-400">today</p>
                  </div>
                </div>
                <div className="flex items-end gap-2 h-20">
                  {adminStats.registrationsByDay.map((day) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden" style={{ height: "60px" }}>
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg"
                          style={{ height: `${(day.count / regMax) * 60}px` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Candidates */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900">Recent Registrations</h2>
                  <Link href="/admin/candidates">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View All <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-50">
                        <th className="text-left text-xs text-slate-400 pb-2 font-medium">Name</th>
                        <th className="text-left text-xs text-slate-400 pb-2 font-medium hidden sm:table-cell">Location</th>
                        <th className="text-left text-xs text-slate-400 pb-2 font-medium hidden md:table-cell">Skills</th>
                        <th className="text-left text-xs text-slate-400 pb-2 font-medium">Payment</th>
                        <th className="text-left text-xs text-slate-400 pb-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {mockCandidates.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-600">
                                {c.name[0]}
                              </div>
                              <span className="text-sm font-medium text-slate-800">{c.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 hidden sm:table-cell">
                            <span className="text-xs text-slate-500">{c.location}</span>
                          </td>
                          <td className="py-2.5 hidden md:table-cell">
                            <div className="flex gap-1">
                              {c.skills.slice(0, 2).map((s) => (
                                <Badge key={s} variant="default" className="text-xs">{s}</Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-2.5">
                            <Badge variant="success" className="text-xs">₹100 ✓</Badge>
                          </td>
                          <td className="py-2.5">
                            <StatusBadge status={c.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                    { label: "API Server", status: "operational", uptime: "99.9%" },
                    { label: "Database", status: "operational", uptime: "99.7%" },
                    { label: "Payment Gateway", status: "operational", uptime: "98.2%" },
                    { label: "Email Service", status: "operational", uptime: "99.5%" },
                    { label: "CDN", status: "operational", uptime: "100%" },
                  ].map((service) => (
                    <div key={service.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-sm text-slate-700">{service.label}</span>
                      </div>
                      <span className="text-xs text-emerald-600 font-medium">{service.uptime}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Actions */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">Pending Actions</h3>
                  <Badge variant="warning">4</Badge>
                </div>
                <div className="space-y-2">
                  {[
                    { icon: <Building2 className="w-4 h-4 text-blue-500" />, text: "1 company awaiting approval", link: "/admin/companies", bg: "bg-blue-50" },
                    { icon: <AlertTriangle className="w-4 h-4 text-amber-500" />, text: "2 flagged job posts", link: "/admin/jobs", bg: "bg-amber-50" },
                    { icon: <CreditCard className="w-4 h-4 text-red-500" />, text: "1 failed payment pending", link: "/admin/payments", bg: "bg-red-50" },
                    { icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />, text: "3 KYC verifications", link: "/admin/moderation", bg: "bg-indigo-50" },
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

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <h3 className="font-semibold text-slate-900 mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />, text: "Vikram Singh registered", time: "2m ago" },
                    { icon: <Building2 className="w-3.5 h-3.5 text-blue-500" />, text: "ScaleTech posted new job", time: "8m ago" },
                    { icon: <CreditCard className="w-3.5 h-3.5 text-emerald-500" />, text: "Payment received: ₹100", time: "15m ago" },
                    { icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />, text: "Spam job flagged for review", time: "1h ago" },
                    { icon: <Activity className="w-3.5 h-3.5 text-indigo-500" />, text: "127 new registrations today", time: "3h ago" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="mt-0.5">{item.icon}</div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-700">{item.text}</p>
                        <p className="text-xs text-slate-400">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform Health */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-indigo-300" />
                  <h3 className="font-semibold">Platform Health</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Payment Success Rate", value: 98.2, color: "bg-emerald-400" },
                    { label: "Profile Completion", value: 72, color: "bg-blue-400" },
                    { label: "Application Rate", value: 85, color: "bg-indigo-400" },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{metric.label}</span>
                        <span className="text-white font-medium">{metric.value}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${metric.color} rounded-full`}
                          style={{ width: `${metric.value}%` }}
                        />
                      </div>
                    </div>
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
