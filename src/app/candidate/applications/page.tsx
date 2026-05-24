"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockApplications } from "@/data/mock";
import {
  Briefcase,
  Building2,
  Calendar,
  FileText,
  MoreVertical,
  Eye,
  Trash2,
} from "lucide-react";

const statuses = ["All", "Pending", "Reviewed", "Shortlisted", "Hired", "Rejected"];

export default function ApplicationsPage() {
  const [filter, setFilter] = useState("All");
  const myApps = mockApplications.filter((a) => a.candidateId === "1");
  const allApps = [
    ...myApps,
    { id: "10", candidateId: "1", candidateName: "Arjun Kumar", jobId: "4", jobTitle: "UI/UX Designer", company: "DesignLab Studios", appliedAt: "2026-05-15", status: "reviewed", resumeUrl: "#", coverNote: "" },
    { id: "11", candidateId: "1", candidateName: "Arjun Kumar", jobId: "2", jobTitle: "Product Manager", company: "InnoVate Solutions", appliedAt: "2026-05-10", status: "rejected", resumeUrl: "#", coverNote: "" },
  ];

  const filtered =
    filter === "All"
      ? allApps
      : allApps.filter(
          (a) => a.status.toLowerCase() === filter.toLowerCase()
        );

  const statusCounts = statuses.reduce(
    (acc, s) => {
      acc[s] =
        s === "All"
          ? allApps.length
          : allApps.filter((a) => a.status.toLowerCase() === s.toLowerCase()).length;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="candidate" userName="Arjun Kumar" userRole="Job Seeker" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="candidate" candidateName="Arjun Kumar" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">My Applications</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Track all your job applications in one place
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {[
              { label: "Total", count: allApps.length, color: "bg-slate-100 text-slate-700" },
              { label: "Pending", count: statusCounts["Pending"], color: "bg-amber-50 text-amber-700" },
              { label: "Shortlisted", count: statusCounts["Shortlisted"], color: "bg-indigo-50 text-indigo-700" },
              { label: "Hired", count: statusCounts["Hired"], color: "bg-emerald-50 text-emerald-700" },
              { label: "Rejected", count: statusCounts["Rejected"], color: "bg-red-50 text-red-600" },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl p-3 text-center ${stat.color}`}>
                <p className="text-2xl font-bold">{stat.count}</p>
                <p className="text-xs font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`flex-shrink-0 text-sm px-4 py-1.5 rounded-full font-medium transition-all ${
                  filter === s
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
                }`}
              >
                {s}
                {statusCounts[s] > 0 && (
                  <span className="ml-1.5 text-xs opacity-70">({statusCounts[s]})</span>
                )}
              </button>
            ))}
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">
                      Job Title
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 hidden sm:table-cell">
                      Company
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 hidden md:table-cell">
                      Applied On
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 hidden lg:table-cell">
                      Resume
                    </th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                          </div>
                          <span className="text-sm font-medium text-slate-900 whitespace-nowrap">
                            {app.jobTitle}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {app.company}
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(app.appliedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <button className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline">
                          <FileText className="w-3.5 h-3.5" />
                          View Resume
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-500">
                  No {filter.toLowerCase()} applications
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
