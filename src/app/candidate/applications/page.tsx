"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Briefcase, MapPin, Clock } from "lucide-react";
import { timeAgo } from "@/lib/utils";

const tabs = ["All", "PENDING", "REVIEWED", "SHORTLISTED", "REJECTED"];

export default function CandidateApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<any[]>([]);
  const [tab, setTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const name = (session?.user as any)?.name ?? "Candidate";

  useEffect(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((d) => { setApplications(d.applications ?? []); setLoading(false); });
  }, []);

  const filtered = applications.filter((a) => tab === "All" || a.status === tab);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="candidate" userName={name} userRole="Job Seeker" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="candidate" candidateName={name} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">My Applications</h1>
            <p className="text-sm text-slate-500">{applications.length} total applications</p>
          </div>

          <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-shrink-0 text-sm px-4 py-1.5 rounded-full font-medium transition-all ${
                  tab === t ? "bg-indigo-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
                }`}>
                {t}
                {t !== "All" && (
                  <span className="ml-1.5 text-xs opacity-70">
                    {applications.filter(a => a.status === t).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-2xl border border-slate-100 animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <Briefcase className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No applications found</p>
              <Link href="/jobs" className="mt-4 inline-block">
                <Button variant="primary" size="sm">Browse Jobs</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((app: any) => (
                <div key={app.id} className="bg-white rounded-2xl border border-slate-100 card-shadow p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: app.job?.company?.logoColor ?? "#4f46e5" }}
                    >
                      {app.job?.company?.logoText ?? app.job?.company?.name?.[0] ?? "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{app.job?.title}</p>
                      <p className="text-sm text-slate-500">{app.job?.company?.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <MapPin className="w-3 h-3" /> {app.job?.location ?? "—"}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-3 h-3" /> {timeAgo(app.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={app.status === "SHORTLISTED" || app.status === "HIRED" ? "success" : app.status === "REJECTED" ? "danger" : "default"}
                    className="flex-shrink-0"
                  >
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
