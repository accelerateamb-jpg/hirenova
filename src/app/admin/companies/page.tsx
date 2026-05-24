"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockCompanies } from "@/data/mock";
import {
  Search,
  Eye,
  CheckCircle,
  Ban,
  Building2,
  MapPin,
  Briefcase,
  Download,
  Filter,
} from "lucide-react";

export default function AdminCompaniesPage() {
  const [search, setSearch] = useState("");
  const [companies, setCompanies] = useState(mockCompanies);

  const filtered = companies.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = (id: string) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "approved", verified: true } : c))
    );
  };

  const handleSuspend = (id: string) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "suspended" ? "approved" : "suspended" }
          : c
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
              <h1 className="text-xl font-bold text-slate-900">Companies</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {companies.length} registered companies
              </p>
            </div>
            <Button size="sm" variant="outline">
              <Download className="w-3.5 h-3.5" /> Export
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total", value: companies.length, color: "bg-blue-50 text-blue-700" },
              { label: "Approved", value: companies.filter((c) => c.status === "approved").length, color: "bg-emerald-50 text-emerald-700" },
              { label: "Pending", value: companies.filter((c) => c.status === "pending").length, color: "bg-amber-50 text-amber-700" },
              { label: "Verified", value: companies.filter((c) => c.verified).length, color: "bg-indigo-50 text-indigo-700" },
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
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>
            <Button variant="outline" size="md">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-2xl border border-slate-100 card-shadow p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: company.color }}
                    >
                      {company.logo}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{company.name}</p>
                      <p className="text-xs text-slate-500">{company.industry}</p>
                    </div>
                  </div>
                  <StatusBadge status={company.status} />
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5" /> {company.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Building2 className="w-3.5 h-3.5" /> {company.size} employees
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Briefcase className="w-3.5 h-3.5" /> {company.openJobs} open positions
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {company.verified ? (
                    <Badge variant="success" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" /> Verified
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="text-xs">Unverified</Badge>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <Eye className="w-3 h-3" /> View
                  </Button>
                  {company.status === "pending" ? (
                    <Button
                      size="sm"
                      className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleApprove(company.id)}
                    >
                      <CheckCircle className="w-3 h-3" /> Approve
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="danger"
                      className="flex-1 text-xs"
                      onClick={() => handleSuspend(company.id)}
                    >
                      <Ban className="w-3 h-3" />
                      {company.status === "suspended" ? "Unsuspend" : "Suspend"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
