"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Briefcase, CheckCircle, Clock, ArrowRight, Search } from "lucide-react";

export default function CandidateDashboard() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const name = (session?.user as any)?.name ?? "Candidate";

  useEffect(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((d) => { setApplications(d.applications ?? []); setLoading(false); });
  }, []);

  const pending = applications.filter((a) => a.status === "PENDING").length;
  const shortlisted = applications.filter((a) => a.status === "SHORTLISTED").length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="candidate" userName={name} userRole="Job Seeker" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="candidate" candidateName={name} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">Welcome back, {name.split(" ")[0]}</h1>
            <p className="text-sm text-slate-500 mt-0.5">Here&apos;s your job search overview</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Applications" value={String(applications.length)}
              icon={<Briefcase className="w-5 h-5" />} color="#4f46e5" />
            <StatCard label="Shortlisted" value={String(shortlisted)}
              icon={<CheckCircle className="w-5 h-5" />} color="#10b981" />
            <StatCard label="Pending" value={String(pending)}
              icon={<Clock className="w-5 h-5" />} color="#f59e0b" />
            <StatCard label="Response Rate"
              value={applications.length > 0 ? `${Math.round((shortlisted / applications.length) * 100)}%` : "0%"}
              icon={<ArrowRight className="w-5 h-5" />} color="#2563eb" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900">Recent Applications</h2>
                  <Link href="/candidate/applications">
                    <Button variant="ghost" size="sm" className="text-xs">View All <ArrowRight className="w-3.5 h-3.5" /></Button>
                  </Link>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-10">
                    <Briefcase className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">No applications yet</p>
                    <Link href="/jobs" className="mt-3 inline-block">
                      <Button size="sm" variant="primary">Browse Jobs</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications.slice(0, 5).map((app: any) => (
                      <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: app.job?.company?.logoColor ?? "#4f46e5" }}
                          >
                            {app.job?.company?.logoText ?? app.job?.company?.name?.[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{app.job?.title}</p>
                            <p className="text-xs text-slate-500">{app.job?.company?.name}</p>
                          </div>
                        </div>
                        <Badge
                          variant={app.status === "SHORTLISTED" ? "success" : app.status === "REJECTED" ? "danger" : "default"}
                          className="text-xs"
                        >
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { label: "Browse Jobs", href: "/jobs", icon: <Search className="w-4 h-4 text-indigo-500" /> },
                    { label: "Update Profile", href: "/candidate/profile", icon: <CheckCircle className="w-4 h-4 text-emerald-500" /> },
                    { label: "My Applications", href: "/candidate/applications", icon: <Briefcase className="w-4 h-4 text-blue-500" /> },
                  ].map((item) => (
                    <Link key={item.label} href={item.href}>
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                        {item.icon}
                        <span className="text-sm text-slate-700">{item.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                      </div>
                    </Link>
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
