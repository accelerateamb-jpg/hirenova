"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Search, Trash2, Ban, Users, RotateCcw } from "lucide-react";

export default function AdminCandidatesPage() {
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/candidates")
      .then((r) => r.json())
      .then((d) => { setCandidates(d.candidates ?? []); setLoading(false); });
  }, []);

  const filtered = candidates.filter((c) =>
    !search ||
    c.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleBlock = async (id: string, blocked: boolean) => {
    await fetch("/api/candidates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId: id, isBlocked: !blocked }),
    });
    setCandidates((prev) =>
      prev.map((c) => c.id === id ? { ...c, user: { ...c.user, isBlocked: !blocked } } : c)
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="admin" userName="Admin" userRole="Super Admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="admin" candidateName="Admin" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Candidates</h1>
              <p className="text-sm text-slate-500">{candidates.length} registered candidates</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 card-shadow">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No candidates yet</p>
                <p className="text-sm text-slate-400 mt-1">Candidates will appear here once they register</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs text-slate-400 p-4 font-medium">Name</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium hidden md:table-cell">Email</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium hidden lg:table-cell">Location</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium">Payment</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium">Status</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((c: any) => (
                      <tr key={c.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-600">
                              {c.user?.name?.[0] ?? "?"}
                            </div>
                            <span className="text-sm font-medium text-slate-800">{c.user?.name ?? "—"}</span>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className="text-xs text-slate-500">{c.user?.email}</span>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <span className="text-xs text-slate-500">{c.location ?? "—"}</span>
                        </td>
                        <td className="p-4">
                          <Badge variant={c.paymentStatus === "paid" ? "success" : "warning"} className="text-xs">
                            {c.paymentStatus === "paid" ? "Paid" : "Pending"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant={c.user?.isBlocked ? "danger" : "success"} className="text-xs">
                            {c.user?.isBlocked ? "Blocked" : "Active"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleBlock(c.id, c.user?.isBlocked)}
                              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                              title={c.user?.isBlocked ? "Unblock" : "Block"}
                            >
                              {c.user?.isBlocked
                                ? <RotateCcw className="w-4 h-4 text-emerald-500" />
                                : <Ban className="w-4 h-4 text-red-400" />}
                            </button>
                          </div>
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
