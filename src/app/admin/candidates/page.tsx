"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockCandidates } from "@/data/mock";
import { formatSalaryRange } from "@/lib/utils";
import {
  Search,
  Eye,
  Trash2,
  Ban,
  Download,
  Filter,
  Users,
  MapPin,
  Star,
  RotateCcw,
} from "lucide-react";

export default function AdminCandidatesPage() {
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState(mockCandidates);

  const filtered = candidates.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleBlock = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === "active" ? "blocked" : "active" } : c
      )
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
              <h1 className="text-xl font-bold text-slate-900">Candidates</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {candidates.length.toLocaleString()} registered candidates
              </p>
            </div>
            <Button size="sm" variant="outline">
              <Download className="w-3.5 h-3.5" /> Export
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total", value: "12,847", color: "bg-indigo-50 text-indigo-700" },
              { label: "Active", value: "11,493", color: "bg-emerald-50 text-emerald-700" },
              { label: "Blocked", value: "243", color: "bg-red-50 text-red-700" },
              { label: "Today", value: "127", color: "bg-blue-50 text-blue-700" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
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
                placeholder="Search by name, email, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>
            <Button variant="outline" size="md">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    {["Candidate", "Contact", "Skills", "Profile", "Payment", "Status", "Actions"].map(
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
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <span className="text-xs font-bold text-indigo-600">{c.name[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{c.name}</p>
                            <p className="text-xs text-slate-400">{c.currentRole}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-slate-600">{c.email}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {c.location}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {c.skills.slice(0, 2).map((s) => (
                            <Badge key={s} variant="default" className="text-xs">{s}</Badge>
                          ))}
                          {c.skills.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{c.skills.length - 2}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5">
                            <div
                              className="bg-indigo-600 h-1.5 rounded-full"
                              style={{ width: `${c.profileCompletion}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500">{c.profileCompletion}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="success" className="text-xs">₹100 Paid</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleBlock(c.id)}
                            className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-500 transition-colors"
                          >
                            {c.status === "active" ? (
                              <Ban className="w-3.5 h-3.5" />
                            ) : (
                              <RotateCcw className="w-3.5 h-3.5" />
                            )}
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
          </div>
        </main>
      </div>
    </div>
  );
}
