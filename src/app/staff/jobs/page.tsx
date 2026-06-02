"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Briefcase, Search, PlusCircle, MapPin, Mail } from "lucide-react";

export default function StaffJobsPage() {
  const { data: session } = useSession();
  const name = (session?.user as any)?.name ?? "Staff";
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/staff/jobs")
      .then((r) => r.json())
      .then((d) => { setJobs(d.jobs ?? []); setLoading(false); });
  }, []);

  const filtered = jobs.filter((j) =>
    !search || j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="staff" userName={name} userRole="Staff" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="staff" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">My Jobs</h1>
              <p className="text-sm text-slate-500">{jobs.length} jobs posted by you</p>
            </div>
            <Link href="/staff/jobs/new">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="w-3.5 h-3.5" /> Post Job
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 card-shadow">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search by title or company..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400" />
              </div>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No jobs posted yet</p>
                <Link href="/staff/jobs/new" className="mt-3 inline-block">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Post your first job</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {filtered.map((j: any) => (
                  <div key={j.id} className="p-4 hover:bg-slate-50/50 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: j.company?.logoColor ?? "#4f46e5" }}>
                      {j.company?.logoText ?? j.company?.name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-800">{j.title}</span>
                        <Badge variant={j.status === "ACTIVE" ? "success" : "warning"} className="text-xs">
                          {j.status}
                        </Badge>
                        {!j.requiresResume && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <Mail className="w-3 h-3" /> No CV
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                        <span className="text-xs text-slate-400">{j.company?.name}</span>
                        {j.location && <span className="flex items-center gap-1 text-xs text-slate-400"><MapPin className="w-3 h-3" />{j.location}</span>}
                        <span className="text-xs text-slate-400">{j._count?.applications ?? 0} applicants</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
