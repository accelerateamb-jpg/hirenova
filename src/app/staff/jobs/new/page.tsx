"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import {
  Briefcase, MapPin, DollarSign, Plus, X,
  CheckCircle, Wifi, Users, Calendar, Mail, FileText,
} from "lucide-react";

const skillSuggestions = [
  "React", "Node.js", "Python", "AWS", "TypeScript", "PostgreSQL",
  "Docker", "Figma", "Product Management", "SQL", "Java", "Flutter",
];

export default function StaffPostJobPage() {
  return (
    <Suspense>
      <StaffPostJobForm />
    </Suspense>
  );
}

function StaffPostJobForm() {
  const { data: session } = useSession();
  const staffName = (session?.user as any)?.name ?? "Staff";
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCompanyId = searchParams.get("companyId") ?? "";

  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [remote, setRemote] = useState(false);
  const [requiresResume, setRequiresResume] = useState(true);

  const [form, setForm] = useState({
    companyId: preselectedCompanyId,
    title: "", type: "Full-time", experience: "1-3 years",
    description: "", location: "", salaryMin: "", salaryMax: "",
    category: "", contactEmail: "", deadline: "",
  });
  const set = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  useEffect(() => {
    fetch("/api/staff/companies")
      .then((r) => r.json())
      .then((d) => setCompanies(d.companies ?? []));
  }, []);

  const addSkill = (s: string) => {
    if (s.trim() && !skills.includes(s.trim())) { setSkills([...skills, s.trim()]); setNewSkill(""); }
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.companyId) { setError("Please select an organisation"); return; }
    if (!form.title || !form.description) { setError("Job title and description are required"); return; }
    if (!requiresResume && !form.contactEmail) { setError("Contact email is required when CV is not needed"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/staff/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, isRemote: remote, requiresResume, skills }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/staff/jobs");
    } catch (err: any) {
      setError(err.message ?? "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="staff" userName={staffName} userRole="Staff" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="staff" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-slate-900">Post a Job</h1>
              <p className="text-sm text-slate-500 mt-0.5">Post a job on behalf of a client organisation</p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-6 space-y-6">

              {/* Select Organisation */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Organisation *</label>
                {companies.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-800">
                    No organisations found. <a href="/staff/organisations/new" className="font-semibold underline">Add one first →</a>
                  </div>
                ) : (
                  <select value={form.companyId} onChange={(e) => set("companyId", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all">
                    <option value="">Select organisation</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="border-t border-slate-100" />

              {/* Job Details */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" /> Job Details
                </h3>
                <div className="space-y-4">
                  <Input label="Job Title *" placeholder="e.g. Senior Frontend Developer"
                    leftIcon={<Briefcase className="w-4 h-4" />}
                    value={form.title} onChange={(e) => set("title", e.target.value)} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1.5 block">Job Type</label>
                      <select value={form.type} onChange={(e) => set("type", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all">
                        <option>Full-time</option><option>Part-time</option>
                        <option>Contract</option><option>Internship</option><option>Freelance</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1.5 block">Experience</label>
                      <select value={form.experience} onChange={(e) => set("experience", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all">
                        <option>0–1 years (Fresher)</option><option>1–3 years</option>
                        <option>3–5 years</option><option>5–8 years</option><option>8+ years</option>
                      </select>
                    </div>
                  </div>
                  <Textarea label="Job Description *" rows={4}
                    placeholder="Responsibilities, requirements, and what makes this role exciting..."
                    value={form.description} onChange={(e) => set("description", e.target.value)} />
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* Location & Salary */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" /> Location & Compensation
                </h3>
                <div className="space-y-4">
                  <button onClick={() => setRemote(!remote)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium text-sm transition-all ${remote ? "bg-emerald-50 border-emerald-400 text-emerald-700" : "bg-white border-slate-200 text-slate-600"}`}>
                    <Wifi className="w-4 h-4" /> Remote Work
                    {remote && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                  </button>
                  <Input label="Office Location" placeholder="e.g. Bangalore, Karnataka"
                    leftIcon={<MapPin className="w-4 h-4" />}
                    value={form.location} onChange={(e) => set("location", e.target.value)}
                    readOnly={remote} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Min Salary (₹/yr)" type="number" placeholder="1200000"
                      leftIcon={<DollarSign className="w-4 h-4" />}
                      value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} />
                    <Input label="Max Salary (₹/yr)" type="number" placeholder="2000000"
                      leftIcon={<DollarSign className="w-4 h-4" />}
                      value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* Skills */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" /> Required Skills
                </h3>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skills.map((s) => (
                      <div key={s} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                        {s} <button onClick={() => setSkills(skills.filter((sk) => sk !== s))}><X className="w-3 h-3 hover:text-red-500" /></button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mb-2">
                  <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill(newSkill)}
                    placeholder="Type a skill and press Enter"
                    className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400" />
                  <Button variant="secondary" size="sm" onClick={() => addSkill(newSkill)}>
                    <Plus className="w-3.5 h-3.5" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skillSuggestions.map((s) => (
                    <button key={s} onClick={() => addSkill(s)} disabled={skills.includes(s)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${skills.includes(s) ? "opacity-40 cursor-not-allowed bg-blue-50 border-blue-200 text-blue-500" : "border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"}`}>
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* Application Settings */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" /> Application Settings
                </h3>
                <div className="space-y-4">
                  {/* No CV toggle */}
                  <div className={`rounded-xl border p-4 transition-all ${!requiresResume ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${!requiresResume ? "bg-amber-100" : "bg-slate-200"}`}>
                          <FileText className={`w-4 h-4 ${!requiresResume ? "text-amber-600" : "text-slate-400"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">CV / Resume not required</p>
                          <p className="text-xs text-slate-500 mt-0.5">Candidates apply via email instead of uploading a CV</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setRequiresResume(!requiresResume)}
                        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${!requiresResume ? "bg-amber-500" : "bg-slate-300"}`}>
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${!requiresResume ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                    {!requiresResume && (
                      <div className="mt-4 pt-4 border-t border-amber-200">
                        <Input label="Application Contact Email *" type="email" placeholder="hr@company.com"
                          leftIcon={<Mail className="w-4 h-4" />}
                          value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)}
                          hint="Candidates will see this and contact you directly" />
                      </div>
                    )}
                  </div>
                  <Input label="Application Deadline" type="date"
                    leftIcon={<Calendar className="w-4 h-4" />}
                    value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
                  {requiresResume && (
                    <Input label="Contact Email" type="email" placeholder="hr@company.com"
                      leftIcon={<Mail className="w-4 h-4" />}
                      value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" onClick={() => router.push("/staff/jobs")}>Cancel</Button>
                <Button loading={loading} onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 px-8">
                  <CheckCircle className="w-4 h-4" /> Publish Job
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
