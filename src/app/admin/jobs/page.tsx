"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockJobs } from "@/data/mock";
import { formatSalaryRange, timeAgo } from "@/lib/utils";
import {
  Search,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Briefcase,
  MapPin,
  Users,
  Filter,
} from "lucide-react";

export default function AdminJobsPage() {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState(
    mockJobs.map((j) => ({
      ...j,
      modStatus: "approved" as "approved" | "flagged" | "rejected",
    }))
  );

  const filtered = jobs.filter(
    (j) =>
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleFlag = (id: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, modStatus: j.modStatus === "flagged" ? "approved" : "flagged" }
          : j
      )
    );
  };

  const handleReject = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, modStatus: "rejected" } : j))
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="admin" userName="Admin" userRole="Super Admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="admin" candidateName="Admin" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Job Moderation</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Review and moderate all job postings
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total Jobs", value: jobs.length, color: "bg-slate-50 text-slate-700" },
              { label: "Approved", value: jobs.filter((j) => j.modStatus === "approved").length, color: "bg-emerald-50 text-emerald-700" },
              { label: "Flagged", value: jobs.filter((j) => j.modStatus === "flagged").length, color: "bg-amber-50 text-amber-700" },
              { label: "Rejected", value: jobs.filter((j) => j.modStatus === "rejected").length, color: "bg-red-50 text-red-700" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl p-4 border border-slate-100 ${s.color}`}>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-4 mb-4 flex gap-3">
            <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs or companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>
            <Button variant="outline" size="md">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>

          {/* Jobs Table */}
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    {["Job", "Company", "Location", "Salary", "Applicants", "Posted", "Status", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left text-xs font-semibold text-slate-500 px-5 py-3 whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((job) => (
                    <tr
                      key={job.id}
                      className={`hover:bg-slate-50/50 transition-colors ${
                        job.modStatus === "rejected" ? "opacity-50" : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: job.companyColor }}
                          >
                            {job.companyLogo}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{job.title}</p>
                            <p className="text-xs text-slate-400">{job.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">{job.company}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.location.split(",")[0]}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-700 font-medium">
                          {formatSalaryRange(job.salary.min, job.salary.max)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-600 flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" /> {job.applicants}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-400">{timeAgo(job.postedAt)}</span>
                      </td>
                      <td className="px-5 py-4">
                        {job.modStatus === "approved" && <Badge variant="success" className="text-xs">Approved</Badge>}
                        {job.modStatus === "flagged" && <Badge variant="warning" className="text-xs">Flagged</Badge>}
                        {job.modStatus === "rejected" && <Badge variant="danger" className="text-xs">Rejected</Badge>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleFlag(job.id)}
                            className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-500 transition-colors"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleReject(job.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
