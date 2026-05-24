"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { StatCard } from "@/components/ui/Card";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockJobs, mockApplications, mockCompanies } from "@/data/mock";
import Link from "next/link";
import {
  Briefcase,
  Users,
  PlusCircle,
  ArrowRight,
  Eye,
  TrendingUp,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
} from "lucide-react";
import { formatSalaryRange, timeAgo } from "@/lib/utils";

const company = mockCompanies[0];
const companyJobs = mockJobs.slice(0, 4);
const recentApps = mockApplications.slice(0, 5);

export default function CompanyDashboard() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="company" userName={company.hrName} userRole={company.name} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="company" candidateName={company.hrName} />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Welcome back, {company.hrName.split(" ")[0]} 👋
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {company.name} · {company.openJobs} active jobs
              </p>
            </div>
            <Link href="/company/post-job">
              <Button size="sm">
                <PlusCircle className="w-3.5 h-3.5" /> Post New Job
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Active Jobs"
              value={company.openJobs}
              change={15.2}
              icon={<Briefcase className="w-5 h-5" />}
              color="#2563eb"
            />
            <StatCard
              label="Total Applicants"
              value={318}
              change={22.4}
              icon={<Users className="w-5 h-5" />}
              color="#4f46e5"
            />
            <StatCard
              label="New This Week"
              value={47}
              change={8.7}
              icon={<TrendingUp className="w-5 h-5" />}
              color="#10b981"
            />
            <StatCard
              label="Hired"
              value={12}
              change={5.1}
              icon={<CheckCircle className="w-5 h-5" />}
              color="#7c3aed"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Job Performance */}
            <div className="lg:col-span-2 space-y-5">
              {/* Active Jobs */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900">Active Job Postings</h2>
                  <Link href="/company/jobs">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View All <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {companyJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: job.companyColor }}>
                        {job.companyLogo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {job.title}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {job.location}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Users className="w-3 h-3" /> {job.applicants} applicants
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="success" className="text-xs">Active</Badge>
                        <Link href="/company/applicants">
                          <Button variant="ghost" size="sm" className="text-xs">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applicant Pipeline */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900">Applicant Pipeline</h2>
                  <Link href="/company/applicants">
                    <Button variant="ghost" size="sm" className="text-xs">
                      Manage <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { label: "Applied", count: 318, color: "bg-slate-500" },
                    { label: "Reviewed", count: 187, color: "bg-blue-500" },
                    { label: "Shortlisted", count: 64, color: "bg-indigo-500" },
                    { label: "Rejected", count: 42, color: "bg-red-500" },
                    { label: "Hired", count: 12, color: "bg-emerald-500" },
                  ].map((stage) => (
                    <div key={stage.label} className="text-center">
                      <div className="relative bg-slate-100 rounded-xl overflow-hidden h-24 mb-2">
                        <div
                          className={`absolute bottom-0 left-0 right-0 ${stage.color} rounded-xl transition-all`}
                          style={{ height: `${(stage.count / 318) * 100}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-white drop-shadow">
                            {stage.count}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">{stage.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5">
              {/* Recent Applications */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">Recent Applications</h3>
                  <Badge variant="danger" className="text-xs">8 new</Badge>
                </div>
                <div className="space-y-3">
                  {recentApps.map((app) => (
                    <div key={app.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-indigo-600">
                          {app.candidateName[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">
                          {app.candidateName}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{app.jobTitle}</p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  ))}
                </div>
                <Link href="/company/applicants">
                  <Button variant="outline" fullWidth size="sm" className="mt-4 text-xs">
                    View All Applicants
                  </Button>
                </Link>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <h3 className="font-semibold text-slate-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { label: "Post New Job", icon: <PlusCircle className="w-4 h-4" />, href: "/company/post-job", color: "text-blue-600 bg-blue-50" },
                    { label: "View Applicants", icon: <Users className="w-4 h-4" />, href: "/company/applicants", color: "text-indigo-600 bg-indigo-50" },
                    { label: "Analytics", icon: <BarChart3 className="w-4 h-4" />, href: "/company/analytics", color: "text-emerald-600 bg-emerald-50" },
                  ].map((action) => (
                    <Link key={action.label} href={action.href}>
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.color}`}>
                          {action.icon}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{action.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 ml-auto" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm mb-3"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  {company.logo}
                </div>
                <p className="font-semibold">{company.name}</p>
                <p className="text-blue-200 text-xs mt-0.5">{company.industry}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-white/20 text-white text-xs border-0">
                    <CheckCircle className="w-3 h-3 mr-1" /> Verified
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
