"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Briefcase, Users, CheckCircle, ArrowRight, Plus } from "lucide-react";

export default function CompanyDashboard() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const name = (session?.user as any)?.name ?? "Company";

  useEffect(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((d) => { setApplications(d.applications ?? []); setLoading(false); });
  }, []);

  const pending = applications.filter((a) => a.status === "PENDING").length;
  const shortlisted = applications.filter((a) => a.status === "SHORTLISTED").length;
  const uniqueJobs = new Set(applications.map((a) => a.jobId)).size;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="company" userName={name} userRole="HR Manager" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="company" candidateName={name} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-500">Welcome back, {name.split(" ")[0]}</p>
            </div>
            <Link href="/company/post-job">
              <Button variant="primary" size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Post a Job
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Applications" value={String(applications.length)}
              icon={<Users className="w-5 h-5" />} color="#4f46e5" />
            <StatCard label="Active Jobs" value={String(uniqueJobs)}
              icon={<Briefcase className="w-5 h-5" />} color="#2563eb" />
            <StatCard label="Shortlisted" value={String(shortlisted)}
              icon={<CheckCircle className="w-5 h-5" />} color="#10b981" />
            <StatCard label="Pending Review" value={String(pending)}
              icon={<ArrowRight className="w-5 h-5" />} color="#f59e0b" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Recent Applications</h2>
              <Link href="/company/applicants">
                <Button variant="ghost" size="sm" className="text-xs">View All <ArrowRight className="w-3.5 h-3.5" /></Button>
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-10">
                <Users className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No applications yet</p>
                <Link href="/company/post-job" className="mt-3 inline-block">
                  <Button size="sm" variant="primary">Post Your First Job</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 5).map((app: any) => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{app.candidate?.user?.name ?? "—"}</p>
                      <p className="text-xs text-slate-500">{app.job?.title}</p>
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
        </main>
      </div>
    </div>
  );
}
