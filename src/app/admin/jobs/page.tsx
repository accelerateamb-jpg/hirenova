"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/Badge";
import { Search, Briefcase, MapPin, AlertTriangle, CheckCircle } from "lucide-react";
import { timeAgo } from "@/lib/utils";

export default function AdminJobsPage() {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs?limit=100")
      .then((r) => r.json())
      .then((d) => { setJobs(d.jobs ?? []); setLoading(false); });
  }, []);

  const filtered = jobs.filter((j) =>
    !search ||
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFlag = async (jobId: string, isFlagged: boolean) => {
    await fetch(`/api/jobs/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFlagged: !isFlagged }),
    });
    setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, isFlagged: !isFlagged } : j));
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="admin" userName="Admin" userRole="Super Admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="admin" candidateName="Admin" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">Jobs</h1>
            <p className="text-sm text-slate-500">{jobs.length} active job listings</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 card-shadow">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search jobs or companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No jobs posted yet</p>
                <p className="text-sm text-slate-400 mt-1">Jobs will appear here once companies post them</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs text-slate-400 p-4 font-medium">Job</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium hidden md:table-cell">Company</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium hidden lg:table-cell">Location</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium hidden lg:table-cell">Posted</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium">Status</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((j: any) => (
                      <tr key={j.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <p className="text-sm font-medium text-slate-800">{j.title}</p>
                          <p className="text-xs text-slate-400">{j.type} · {j.experience}</p>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className="text-xs text-slate-600">{j.company?.name ?? "—"}</span>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="w-3 h-3" /> {j.location ?? "—"}
                          </span>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <span className="text-xs text-slate-400">{timeAgo(j.createdAt)}</span>
                        </td>
                        <td className="p-4">
                          <Badge variant={j.isFlagged ? "danger" : "success"} className="text-xs">
                            {j.isFlagged ? "Flagged" : "Active"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleFlag(j.id, j.isFlagged)}
                            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
                              j.isFlagged
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                            }`}
                          >
                            {j.isFlagged
                              ? <><CheckCircle className="w-3.5 h-3.5" /> Unflag</>
                              : <><AlertTriangle className="w-3.5 h-3.5" /> Flag</>
                            }
                          </button>
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
