"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockApplications, mockCandidates } from "@/data/mock";
import {
  Search,
  Download,
  Eye,
  ChevronDown,
  Users,
  Filter,
  Calendar,
  MapPin,
  Briefcase,
  Star,
} from "lucide-react";

const statuses = ["All", "Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"];

export default function ApplicantsPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const enriched = mockApplications.map((app) => {
    const candidate = mockCandidates.find((c) => c.id === app.candidateId);
    return { ...app, candidate };
  });

  const filtered = enriched.filter((app) => {
    const matchStatus = filter === "All" || app.status.toLowerCase() === filter.toLowerCase();
    const matchSearch =
      !search ||
      app.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    // Demo: status changes are ephemeral
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="company" userName="Priya Sharma" userRole="TechCorp India" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="company" candidateName="Priya Sharma" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Applicants</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {filtered.length} applicants across your job postings
              </p>
            </div>
            <Button size="sm" variant="outline">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
            {statuses.map((s) => {
              const count =
                s === "All"
                  ? enriched.length
                  : enriched.filter((a) => a.status.toLowerCase() === s.toLowerCase()).length;
              return (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`rounded-xl p-3 text-center transition-all border ${
                    filter === s
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white border-slate-100 hover:border-indigo-300 text-slate-700"
                  }`}
                >
                  <p className="text-xl font-bold">{count}</p>
                  <p className="text-xs font-medium mt-0.5 opacity-80">{s}</p>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-4 mb-4">
            <div className="flex gap-3">
              <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-xl px-4 py-2.5">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or job title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                />
              </div>
              <Button variant="outline" size="md">
                <Filter className="w-4 h-4" /> Filter
              </Button>
            </div>
          </div>

          {/* Applicants Table */}
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">
                      Candidate
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 hidden md:table-cell">
                      Applied For
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 hidden lg:table-cell">
                      Skills
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3 hidden sm:table-cell">
                      Experience
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-indigo-600">
                              {app.candidateName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {app.candidateName}
                            </p>
                            {app.candidate && (
                              <div className="flex items-center gap-1 text-xs text-slate-400">
                                <MapPin className="w-3 h-3" />
                                {app.candidate.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[160px]">{app.jobTitle}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(app.appliedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {app.candidate?.skills.slice(0, 2).map((s) => (
                            <Badge key={s} variant="default" className="text-xs">
                              {s}
                            </Badge>
                          ))}
                          {(app.candidate?.skills.length ?? 0) > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{(app.candidate?.skills.length ?? 0) - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="text-sm text-slate-700">
                          {app.candidate?.experience ?? 0} yr{app.candidate?.experience !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="relative group inline-block">
                          <button className="flex items-center gap-1">
                            <StatusBadge status={app.status} />
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                          </button>
                          <div className="absolute left-0 top-full mt-1 bg-white border border-slate-100 rounded-xl shadow-lg z-10 min-w-[140px] hidden group-hover:block">
                            {["reviewed", "shortlisted", "rejected", "hired"].map((s) => (
                              <button
                                key={s}
                                className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 capitalize first:rounded-t-xl last:rounded-b-xl"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-500 transition-colors">
                            <Star className="w-3.5 h-3.5" />
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
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-500">No applicants found</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
