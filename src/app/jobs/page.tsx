"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockJobs } from "@/data/mock";
import { formatSalaryRange } from "@/lib/utils";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Briefcase,
  Wifi,
  X,
  Building2,
  Clock,
  IndianRupee,
  ArrowRight,
} from "lucide-react";

const categories = ["All", "Engineering", "Product", "Design", "Data", "Marketing"];
const locations = ["All", "Bangalore", "Mumbai", "Hyderabad", "Pune", "Chennai", "Gurgaon"];

export default function PublicJobsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [remoteOnly, setRemoteOnly] = useState(false);
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="landing" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Browse Jobs</h1>
          <p className="text-slate-500 mt-1">
            {filtered.length} opportunities available across India
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
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
              {(category !== "All" || remoteOnly) && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-6">
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
              <div className="flex items-end">
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
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md hover:border-indigo-100 transition-all"
              >
                {/* Company + badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: (job as any).companyColor || (job as any).logoColor || "#4f46e5" }}
                    >
                      {(job as any).companyLogo || (job as any).logoText || job.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm leading-tight">{job.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{job.company}</p>
                    </div>
                  </div>
                  {job.isRemote && (
                    <Badge variant="success" className="text-xs flex-shrink-0">Remote</Badge>
                  )}
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3 h-3" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Briefcase className="w-3 h-3" /> {job.experience}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" /> {job.type}
                  </span>
                  {((job as any).salaryMin || (job as any).salary?.min) && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                      <IndianRupee className="w-3 h-3" /> {formatSalaryRange(
                        (job as any).salaryMin ?? (job as any).salary?.min,
                        (job as any).salaryMax ?? (job as any).salary?.max
                      )}
                    </span>
                  )}
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 4 && (
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">
                      +{job.skills.length - 4}
                    </span>
                  )}
                </div>

                {/* Apply CTA */}
                <div className="pt-1 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{job.applicants} applicants</span>
                  <Link href="/candidate/register">
                    <Button size="sm" variant="primary" className="flex items-center gap-1.5">
                      Apply Now <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-700">No jobs found</h3>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search terms</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => { setSearch(""); setCategory("All"); setLocation("All"); setRemoteOnly(false); }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Bottom CTA for non-logged-in users */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">Ready to apply?</h2>
          <p className="text-indigo-100 text-sm mb-6">
            Create your profile once and apply to hundreds of jobs. One-time ₹100 registration.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/candidate/register">
              <Button variant="secondary" size="md">Create Account</Button>
            </Link>
            <Link href="/candidate/login">
              <button className="text-sm font-medium text-white underline underline-offset-2 hover:text-indigo-100">
                Already have an account?
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
