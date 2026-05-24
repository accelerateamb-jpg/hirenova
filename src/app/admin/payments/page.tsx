"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockPayments, adminStats } from "@/data/mock";
import {
  Search,
  Download,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Filter,
  Calendar,
  IndianRupee,
} from "lucide-react";

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = mockPayments.filter((p) => {
    const matchStatus = filter === "All" || p.status === filter.toLowerCase();
    const matchSearch =
      !search ||
      p.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const successCount = mockPayments.filter((p) => p.status === "success").length;
  const failedCount = mockPayments.filter((p) => p.status === "failed").length;
  const refundedCount = mockPayments.filter((p) => p.status === "refunded").length;
  const totalRevenue = mockPayments.filter((p) => p.status === "success").length * 100;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="admin" userName="Admin" userRole="Super Admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="admin" candidateName="Admin" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Payments</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Track all registration payments and transactions
              </p>
            </div>
            <Button size="sm" variant="outline">
              <Download className="w-3.5 h-3.5" /> Export
            </Button>
          </div>

          {/* Revenue Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee className="w-4 h-4 text-indigo-200" />
                <span className="text-xs text-indigo-200">Total Revenue</span>
              </div>
              <p className="text-2xl font-bold">₹{adminStats.revenueGenerated.toLocaleString()}</p>
              <p className="text-xs text-indigo-300 mt-1">All time</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-emerald-600">Successful</span>
              </div>
              <p className="text-2xl font-bold text-emerald-700">{successCount}</p>
              <p className="text-xs text-emerald-500 mt-1">₹{successCount * 100} collected</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-xs text-red-600">Failed</span>
              </div>
              <p className="text-2xl font-bold text-red-700">{failedCount}</p>
              <p className="text-xs text-red-500 mt-1">Needs attention</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-amber-600">Refunded</span>
              </div>
              <p className="text-2xl font-bold text-amber-700">{refundedCount}</p>
              <p className="text-xs text-amber-500 mt-1">₹{refundedCount * 100} refunded</p>
            </div>
          </div>

          {/* Filter Tabs + Search */}
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-xl px-4 py-2.5">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or transaction ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                />
              </div>
              <div className="flex gap-2">
                {["All", "Success", "Failed", "Refunded"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`text-sm px-3 py-2 rounded-xl font-medium transition-all ${
                      filter === s
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    {[
                      "Transaction ID",
                      "Candidate",
                      "Email",
                      "Amount",
                      "Method",
                      "Date",
                      "Status",
                      "Receipt",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-xs font-semibold text-slate-500 px-5 py-3 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <code className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                          {payment.id}
                        </code>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-600">
                            {payment.candidateName[0]}
                          </div>
                          <span className="text-sm font-medium text-slate-900">
                            {payment.candidateName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-500">{payment.email}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-slate-900">
                          ₹{payment.amount}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs text-slate-600">{payment.method}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(payment.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="px-5 py-4">
                        <button className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                          <Download className="w-3 h-3" /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No payments found</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
