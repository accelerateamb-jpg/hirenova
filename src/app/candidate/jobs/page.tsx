"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { JobCard } from "@/components/ui/JobCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { mockJobs } from "@/data/mock";
import { formatSalaryRange } from "@/lib/utils";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Briefcase,
  Wifi,
  Clock,
  Users,
  X,
  CheckCircle,
} from "lucide-react";

const categories = ["All", "Engineering", "Product", "Design", "Data", "Marketing"];
const locations = ["All", "Bangalore", "Mumbai", "Hyderabad", "Pune", "Chennai", "Gurgaon"];
const experienceLevels = ["Any", "0–1 years", "1–3 years", "3–5 years", "5+ years"];

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [experience, setExperience] = useState("Any");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const filtered = mockJobs.filter((job) => {
    const matchSearch =
      !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === "All" || job.category === category;
    const matchLoc = location === "All" || job.location.includes(location);
    const matchRemote = !remoteOnly || job.isRemote;
    return matchSearch && matchCat && matchLoc && matchRemote;
  });

  const handleApply = (jobId: string) => {
    setAppliedJobs((prev) => new Set([...prev, jobId]));
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="candidate" userName="Arjun Kumar" userRole="Job Seeker" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="candidate" candidateName="Arjun Kumar" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">Browse Jobs</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {filtered.length} jobs found matching your profile
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-xl px-4 py-2.5">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search jobs, skills, companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                />
                {search && (
                  <button onClick={() => setSearch("")}>
                    <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 sm:w-48">
                <MapPin className="w-4 h-4 text-slate-400" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-slate-700"
                >
                  {locations.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {(category !== "All" || experience !== "Any" || remoteOnly) && (
                  <Badge variant="danger" className="text-xs px-1.5 py-0">!</Badge>
                )}
              </Button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">Category</p>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                          category === cat
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">Experience</p>
                  <div className="flex flex-wrap gap-1.5">
                    {experienceLevels.map((exp) => (
                      <button
                        key={exp}
                        onClick={() => setExperience(exp)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                          experience === exp
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">Work Mode</p>
                  <button
                    onClick={() => setRemoteOnly(!remoteOnly)}
                    className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      remoteOnly
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Wifi className="w-3.5 h-3.5" /> Remote Only
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 text-sm px-4 py-1.5 rounded-full font-medium transition-all ${
                  category === cat
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Jobs Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((job) => (
                <div key={job.id} className="relative">
                  {appliedJobs.has(job.id) && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
                      <div className="text-center">
                        <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-800">Applied!</p>
                        <p className="text-xs text-slate-500">Application submitted</p>
                      </div>
                    </div>
                  )}
                  <JobCard job={job} onApply={handleApply} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-700">No jobs found</h3>
              <p className="text-sm text-slate-500 mt-1">
                Try adjusting your filters or search terms
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setLocation("All");
                  setExperience("Any");
                  setRemoteOnly(false);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
