"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Building2, Briefcase, PlusCircle, ArrowRight } from "lucide-react";

export default function StaffDashboard() {
  const { data: session } = useSession();
  const name = (session?.user as any)?.name ?? "Staff";
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/staff/companies").then((r) => r.json()),
      fetch("/api/staff/jobs").then((r) => r.json()),
    ]).then(([c, j]) => {
      setCompanies(c.companies ?? []);
      setJobs(j.jobs ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="staff" userName={name} userRole="Staff" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="staff" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">Welcome, {name.split(" ")[0]}</h1>
            <p className="text-sm text-slate-500 mt-0.5">Your activity overview</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{loading ? "—" : companies.length}</p>
              <p className="text-sm text-slate-500 mt-0.5">Organisations Added</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{loading ? "—" : jobs.length}</p>
              <p className="text-sm text-slate-500 mt-0.5">Jobs Posted</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Link href="/staff/organisations/new"
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl p-5 flex items-center gap-4 transition-colors">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Add Organisation</p>
                <p className="text-sm text-emerald-100">Register a new client company</p>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Link>
            <Link href="/staff/jobs/new"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-5 flex items-center gap-4 transition-colors">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Post a Job</p>
                <p className="text-sm text-blue-100">Create a job listing for a client</p>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Link>
          </div>

          {/* Recent Organisations */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Recent Organisations</h2>
              <Link href="/staff/organisations" className="text-xs text-indigo-600 hover:underline">View all</Link>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />)}</div>
            ) : companies.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No organisations yet. <Link href="/staff/organisations/new" className="text-indigo-600 hover:underline">Add one →</Link></p>
            ) : (
              <div className="space-y-2">
                {companies.slice(0, 5).map((c: any) => (
                  <div key={c.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: c.logoColor ?? "#4f46e5" }}>
                      {c.logoText ?? c.name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{c.name}</p>
                      <p className="text-xs text-slate-400">{c._count?.jobs ?? 0} jobs · {c.industry ?? "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Jobs */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Recent Jobs</h2>
              <Link href="/staff/jobs" className="text-xs text-indigo-600 hover:underline">View all</Link>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />)}</div>
            ) : jobs.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No jobs posted yet. <Link href="/staff/jobs/new" className="text-indigo-600 hover:underline">Post one →</Link></p>
            ) : (
              <div className="space-y-2">
                {jobs.slice(0, 5).map((j: any) => (
                  <div key={j.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: j.company?.logoColor ?? "#4f46e5" }}>
                      {j.company?.logoText ?? j.company?.name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{j.title}</p>
                      <p className="text-xs text-slate-400">{j.company?.name} · {j._count?.applications ?? 0} applicants</p>
                    </div>
                    {!j.requiresResume && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">No CV</span>
                    )}
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
