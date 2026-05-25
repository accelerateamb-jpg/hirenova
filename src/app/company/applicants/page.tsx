"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/Badge";
import { Users, Search } from "lucide-react";
import { timeAgo } from "@/lib/utils";

const statuses = ["PENDING", "REVIEWED", "SHORTLISTED", "REJECTED", "HIRED"];

export default function CompanyApplicantsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const name = (session?.user as any)?.name ?? "Company";

  useEffect(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((d) => { setApplications(d.applications ?? []); setLoading(false); });
  }, []);

  const updateStatus = async (applicationId: string, status: string) => {
    await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, status }),
    });
    setApplications((prev) =>
      prev.map((a) => a.id === applicationId ? { ...a, status } : a)
    );
  };

  const filtered = applications.filter((a) =>
    !search ||
    a.candidate?.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.job?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="company" userName={name} userRole="HR Manager" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="company" candidateName={name} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">Applicants</h1>
            <p className="text-sm text-slate-500">{applications.length} total applications</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 card-shadow">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search applicants or jobs..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400" />
              </div>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No applicants yet</p>
                <p className="text-sm text-slate-400 mt-1">Post a job to start receiving applications</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs text-slate-400 p-4 font-medium">Candidate</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium hidden md:table-cell">Applied For</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium hidden lg:table-cell">Date</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium">Status</th>
                      <th className="text-left text-xs text-slate-400 p-4 font-medium">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((app: any) => (
                      <tr key={app.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-600">
                              {app.candidate?.user?.name?.[0] ?? "?"}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800">{app.candidate?.user?.name ?? "—"}</p>
                              <p className="text-xs text-slate-400">{app.candidate?.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className="text-sm text-slate-600">{app.job?.title}</span>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <span className="text-xs text-slate-400">{timeAgo(app.createdAt)}</span>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={app.status === "SHORTLISTED" || app.status === "HIRED" ? "success" : app.status === "REJECTED" ? "danger" : "default"}
                            className="text-xs"
                          >
                            {app.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <select
                            value={app.status}
                            onChange={(e) => updateStatus(app.id, e.target.value)}
                            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 outline-none focus:border-indigo-400"
                          >
                            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
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
