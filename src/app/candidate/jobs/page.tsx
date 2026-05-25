"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatSalaryRange } from "@/lib/utils";
import {
  Search, MapPin, SlidersHorizontal, Briefcase,
  Wifi, X, CheckCircle, IndianRupee, Clock,
} from "lucide-react";

const categories = ["All", "Engineering", "Product", "Design", "Data", "Marketing"];
const locations = ["All", "Bangalore", "Mumbai", "Hyderabad", "Pune", "Chennai", "Gurgaon"];

export default function CandidateJobsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [applying, setApplying] = useState<string | null>(null);
  const name = (session?.user as any)?.name ?? "Candidate";

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location !== "All") params.set("location", location);
    if (category !== "All") params.set("category", category);
    if (remoteOnly) params.set("remote", "true");
    fetch(`/api/jobs?${params}&limit=50`)
      .then((r) => r.json())
      .then((d) => { setJobs(d.jobs ?? []); setLoading(false); });
  }, [search, location, category, remoteOnly]);

  const handleApply = async (jobId: string) => {
    setApplying(jobId);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (res.ok) setAppliedIds((prev) => new Set([...prev, jobId]));
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="candidate" userName={name} userRole="Job Seeker" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="candidate" candidateName={name} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">Browse Jobs</h1>
            <p className="text-sm text-slate-500">{jobs.length} jobs available</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-xl px-4 py-2.5">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input type="text" placeholder="Search jobs, skills, companies..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400" />
                {search && <button onClick={() => setSearch("")}><X className="w-4 h-4 text-slate-400" /></button>}
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 sm:w-44">
                <MapPin className="w-4 h-4 text-slate-400" />
                <select value={location} onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-slate-700">
                  {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <Button variant="outline" size="md" onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 whitespace-nowrap">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </Button>
            </div>
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-6">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">Category</p>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <button key={cat} onClick={() => setCategory(cat)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                          category === cat ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}>{cat}</button>
                    ))}
                  </div>
                </div>
                <div className="flex items-end">
                  <button onClick={() => setRemoteOnly(!remoteOnly)}
                    className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      remoteOnly ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}>
                    <Wifi className="w-3.5 h-3.5" /> Remote Only
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`flex-shrink-0 text-sm px-4 py-1.5 rounded-full font-medium transition-all ${
                  category === cat ? "bg-indigo-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
                }`}>{cat}</button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-white rounded-2xl border border-slate-100 animate-pulse" />)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-700">No jobs found</h3>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {jobs.map((job: any) => {
                const applied = appliedIds.has(job.id);
                return (
                  <div key={job.id} className="relative bg-white rounded-2xl border border-slate-100 card-shadow p-5 flex flex-col gap-4">
                    {applied && (
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
                        <div className="text-center">
                          <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-slate-800">Applied!</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: job.company?.logoColor ?? "#4f46e5" }}>
                          {job.company?.logoText ?? job.company?.name?.[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-sm leading-tight">{job.title}</h3>
                          <p className="text-xs text-slate-500">{job.company?.name}</p>
                        </div>
                      </div>
                      {job.isRemote && <Badge variant="success" className="text-xs flex-shrink-0">Remote</Badge>}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="w-3 h-3" /> {job.location}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-500"><Clock className="w-3 h-3" /> {job.type}</span>
                      {job.salaryMin && (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <IndianRupee className="w-3 h-3" />{formatSalaryRange(job.salaryMin, job.salaryMax)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills?.slice(0, 3).map((s: any) => (
                        <span key={s.id} className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-medium">{s.skill}</span>
                      ))}
                    </div>
                    <div className="pt-1 border-t border-slate-50">
                      <Button fullWidth size="sm" variant="primary" loading={applying === job.id}
                        onClick={() => handleApply(job.id)}>Apply Now</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
