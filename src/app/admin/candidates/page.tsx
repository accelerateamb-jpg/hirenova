"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/Badge";
import { Search, Ban, Users, RotateCcw, FileText, ChevronDown, ChevronUp, MapPin, Briefcase, GraduationCap, DollarSign } from "lucide-react";

export default function AdminCandidatesPage() {
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/candidates")
      .then((r) => r.json())
      .then((d) => { setCandidates(d.candidates ?? []); setLoading(false); });
  }, []);

  const filtered = candidates.filter((c) =>
    !search ||
    c.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleBlock = async (id: string, blocked: boolean) => {
    await fetch("/api/candidates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId: id, isBlocked: !blocked }),
    });
    setCandidates((prev) =>
      prev.map((c) => c.id === id ? { ...c, user: { ...c.user, isBlocked: !blocked } } : c)
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="admin" userName="Admin" userRole="Super Admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="admin" candidateName="Admin" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Candidates</h1>
              <p className="text-sm text-slate-500">{candidates.length} registered candidates</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 card-shadow">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No candidates yet</p>
                <p className="text-sm text-slate-400 mt-1">Candidates will appear here once they register</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {filtered.map((c: any) => (
                  <div key={c.id}>
                    {/* Main row */}
                    <div className="flex items-center gap-3 p-4 hover:bg-slate-50/50">
                      <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center text-sm font-bold text-indigo-600 flex-shrink-0">
                        {c.user?.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-slate-800">{c.user?.name ?? "—"}</span>
                          <Badge variant={c.paymentStatus === "paid" ? "success" : "warning"} className="text-xs">
                            {c.paymentStatus === "paid" ? "Paid" : "Pending"}
                          </Badge>
                          <Badge variant={c.user?.isBlocked ? "danger" : "success"} className="text-xs">
                            {c.user?.isBlocked ? "Blocked" : "Active"}
                          </Badge>
                          {c.resumeUrl && (
                            <Badge variant="info" className="text-xs">CV uploaded</Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{c.user?.email}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {c.resumeUrl && (
                          <a
                            href={c.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Download CV"
                          >
                            <FileText className="w-4 h-4 text-indigo-500" />
                          </a>
                        )}
                        <button
                          onClick={() => handleBlock(c.id, c.user?.isBlocked)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                          title={c.user?.isBlocked ? "Unblock" : "Block"}
                        >
                          {c.user?.isBlocked
                            ? <RotateCcw className="w-4 h-4 text-emerald-500" />
                            : <Ban className="w-4 h-4 text-red-400" />}
                        </button>
                        <button
                          onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View details"
                        >
                          {expanded === c.id
                            ? <ChevronUp className="w-4 h-4 text-slate-400" />
                            : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded detail panel */}
                    {expanded === c.id && (
                      <div className="px-4 pb-4 bg-slate-50/60 border-t border-slate-100">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                          <DetailTile icon={<MapPin className="w-3.5 h-3.5" />} label="Location" value={c.location} />
                          <DetailTile icon={<Briefcase className="w-3.5 h-3.5" />} label="Current Role" value={c.currentRole} />
                          <DetailTile icon={<Briefcase className="w-3.5 h-3.5" />} label="Experience" value={c.experience ? `${c.experience} yr${c.experience !== 1 ? "s" : ""}` : null} />
                          <DetailTile icon={<GraduationCap className="w-3.5 h-3.5" />} label="Qualification" value={c.qualification} />
                          <DetailTile icon={<DollarSign className="w-3.5 h-3.5" />} label="Expected Salary" value={c.expectedSalary ? `₹${c.expectedSalary.toLocaleString("en-IN")}` : null} />
                          <DetailTile icon={<Users className="w-3.5 h-3.5" />} label="Mobile" value={c.user?.mobile} />
                          <DetailTile icon={<Briefcase className="w-3.5 h-3.5" />} label="Profile" value={`${c.profileCompletion ?? 0}% complete`} />
                          <DetailTile
                            icon={<FileText className="w-3.5 h-3.5" />}
                            label="Resume"
                            value={c.resumeUrl ? "Available" : "Not uploaded"}
                            link={c.resumeUrl}
                          />
                        </div>
                        {c.skills?.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-slate-400 mb-1.5 font-medium">Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                              {c.skills.map((s: any) => (
                                <span key={s.id} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                                  {s.skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {c.summary && (
                          <div className="mt-3">
                            <p className="text-xs text-slate-400 mb-1 font-medium">Summary</p>
                            <p className="text-xs text-slate-600 leading-relaxed">{c.summary}</p>
                          </div>
                        )}
                      </div>
                    )}
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

function DetailTile({ icon, label, value, link }: { icon: React.ReactNode; label: string; value?: string | null; link?: string | null }) {
  return (
    <div className="bg-white rounded-xl p-3 border border-slate-100">
      <div className="flex items-center gap-1.5 text-slate-400 mb-1">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer"
          className="text-xs font-semibold text-indigo-600 hover:underline">
          {value}
        </a>
      ) : (
        <p className="text-xs font-semibold text-slate-700">{value ?? "—"}</p>
      )}
    </div>
  );
}
