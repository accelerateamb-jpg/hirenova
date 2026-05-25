"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/Badge";
import { Search, CreditCard, IndianRupee } from "lucide-react";

const filters = ["All", "SUCCESS", "PENDING", "FAILED", "REFUNDED"];

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments")
      .then((r) => r.json())
      .then((d) => { setPayments(d.payments ?? []); setStats(d.stats); setLoading(false); });
  }, []);

  const filtered = payments.filter((p) => {
    const matchStatus = filter === "All" || p.status === filter;
    const matchSearch =
      !search ||
      p.candidate?.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="admin" userName="Admin" userRole="Super Admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="admin" candidateName="Admin" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">Payments</h1>
            <p className="text-sm text-slate-500">{payments.length} total transactions</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Revenue", value: `₹${(stats?.revenue ?? 0).toLocaleString()}`, color: "text-emerald-600" },
              { label: "Successful", value: stats?.success ?? 0, color: "text-emerald-600" },
              { label: "Failed", value: stats?.failed ?? 0, color: "text-red-500" },
              { label: "Refunded", value: stats?.refunded ?? 0, color: "text-amber-500" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 card-shadow p-4">
                <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{loading ? "—" : s.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 card-shadow">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 flex-1">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or transaction ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                />
              </div>
              <div className="flex gap-1">
                {filters.map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      filter === f ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <CreditCard className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No payments yet</p>
                <p className="text-sm text-slate-400 mt-1">Payment records will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs text-slate-400 p-4 font-medium">Candidate</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium hidden md:table-cell">Transaction ID</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium">Amount</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium">Method</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium">Status</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium hidden lg:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {p.candidate?.user?.name ?? "—"}
                            </p>
                            <p className="text-xs text-slate-400">{p.candidate?.user?.email}</p>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className="text-xs font-mono text-slate-500">{p.transactionId ?? "—"}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-semibold text-slate-900 flex items-center gap-0.5">
                            <IndianRupee className="w-3 h-3" />{p.amount}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-xs text-slate-500">{p.method ?? "—"}</span>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={p.status === "SUCCESS" ? "success" : p.status === "PENDING" ? "warning" : "danger"}
                            className="text-xs"
                          >
                            {p.status}
                          </Badge>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <span className="text-xs text-slate-400">
                            {new Date(p.createdAt).toLocaleDateString("en-IN")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
