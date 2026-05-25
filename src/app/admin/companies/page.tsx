"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Search, CheckCircle, Ban, Building2 } from "lucide-react";

export default function AdminCompaniesPage() {
  const [search, setSearch] = useState("");
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then((d) => { setCompanies(d.companies ?? []); setLoading(false); });
  }, []);

  const filtered = companies.filter((c) =>
    !search ||
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.industry?.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = async (companyId: string, status: string) => {
    await fetch("/api/companies", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId, status }),
    });
    setCompanies((prev) => prev.map((c) => c.id === companyId ? { ...c, status } : c));
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="admin" userName="Admin" userRole="Super Admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="admin" candidateName="Admin" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">Companies</h1>
            <p className="text-sm text-slate-500">{companies.length} registered companies</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 card-shadow">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Building2 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No companies yet</p>
                <p className="text-sm text-slate-400 mt-1">Companies will appear here once they register</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs text-slate-400 p-4 font-medium">Company</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium hidden md:table-cell">Industry</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium hidden lg:table-cell">HR Email</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium">Status</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((c: any) => (
                      <tr key={c.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ backgroundColor: c.logoColor ?? "#4f46e5" }}
                            >
                              {c.logoText ?? c.name?.[0]}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                              <p className="text-xs text-slate-400">{c.hrName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className="text-xs text-slate-500">{c.industry ?? "—"}</span>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <span className="text-xs text-slate-500">{c.user?.email}</span>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={c.status === "APPROVED" ? "success" : c.status === "PENDING" ? "warning" : "danger"}
                            className="text-xs"
                          >
                            {c.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            {c.status !== "APPROVED" && (
                              <button onClick={() => updateStatus(c.id, "APPROVED")}
                                className="flex items-center gap-1 text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">
                                <CheckCircle className="w-3.5 h-3.5" /> Approve
                              </button>
                            )}
                            {c.status !== "SUSPENDED" && (
                              <button onClick={() => updateStatus(c.id, "SUSPENDED")}
                                className="flex items-center gap-1 text-xs px-2 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                <Ban className="w-3.5 h-3.5" /> Suspend
                              </button>
                            )}
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
