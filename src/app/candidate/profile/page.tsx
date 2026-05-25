"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import {
  User, Mail, Phone, MapPin, GraduationCap, Briefcase,
  Plus, X, Upload, CheckCircle, TrendingUp, Star,
  FileText, ExternalLink, Save,
} from "lucide-react";

export default function CandidateProfilePage() {
  const { data: session } = useSession();
  const name = (session?.user as any)?.name ?? "";

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    location: "", currentRole: "", qualification: "",
    experience: "", expectedSalary: "", summary: "",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => {
        setProfile(d);
        const c = d?.candidate;
        if (c) {
          setForm({
            location: c.location ?? "",
            currentRole: c.currentRole ?? "",
            qualification: c.qualification ?? "",
            experience: c.experience ? String(c.experience) : "",
            expectedSalary: c.expectedSalary ? String(c.expectedSalary) : "",
            summary: c.summary ?? "",
          });
          setSkills((c.skills ?? []).map((s: any) => s.skill));
          setResumeUrl(c.resumeUrl ?? null);
        }
        setLoading(false);
      });
  }, []);

  const handleCvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) { setError("Only PDF and Word documents allowed"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("File must be under 5 MB"); return; }
    setError("");
    setCvFile(file);
    setCvUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResumeUrl(data.url);
    } catch (err: any) {
      setError(err.message ?? "CV upload failed");
      setCvFile(null);
    } finally {
      setCvUploading(false);
    }
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) { setSkills([...skills, s]); setNewSkill(""); }
  };

  const removeSkill = (skill: string) => setSkills(skills.filter((s) => s !== skill));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/candidates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, skills, resumeUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProfile((prev: any) => ({ ...prev, candidate: data }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const completion = profile?.candidate?.profileCompletion ?? 0;
  const circumference = 2 * Math.PI * 34;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="candidate" userName={name} userRole="Job Seeker" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="candidate" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
              <p className="text-sm text-slate-500 mt-0.5">Keep your profile updated to attract more recruiters</p>
            </div>
            <Button size="sm" loading={saving} onClick={handleSave}>
              <Save className="w-3.5 h-3.5" /> {saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-40 bg-white rounded-2xl border border-slate-100 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left: Profile strength */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                  <div className="text-center mb-4">
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                        <circle
                          cx="40" cy="40" r="34" fill="none"
                          stroke="#4f46e5" strokeWidth="8"
                          strokeDasharray={`${circumference * completion / 100} ${circumference}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-indigo-600">{completion}%</span>
                      </div>
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">Profile Strength</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {completion >= 90 ? "Excellent!" : completion >= 60 ? "Looking good" : "Add more details"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Basic Info", done: !!name },
                      { label: "Location", done: !!form.location },
                      { label: "Current Role", done: !!form.currentRole },
                      { label: "Qualification", done: !!form.qualification },
                      { label: "Summary", done: !!form.summary },
                      { label: "Skills", done: skills.length > 0 },
                      { label: "Resume", done: !!resumeUrl },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? "bg-emerald-500" : "bg-slate-200"}`}>
                          {s.done
                            ? <CheckCircle className="w-3 h-3 text-white" />
                            : <TrendingUp className="w-3 h-3 text-slate-400" />}
                        </div>
                        <span className="text-xs text-slate-600">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-5 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm font-semibold">Profile Views</span>
                  </div>
                  <p className="text-3xl font-bold">{profile?.candidate?.profileViews ?? 0}</p>
                  <p className="text-indigo-200 text-xs mt-1">All time</p>
                </div>
              </div>

              {/* Right: Edit sections */}
              <div className="lg:col-span-3 space-y-5">
                {/* Personal Info */}
                <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <User className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-semibold text-slate-900">Personal Information</h3>
                  </div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                      {name[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{name}</p>
                      <p className="text-sm text-slate-500">{form.currentRole || "Add your current role"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Full Name" value={profile?.name ?? name} readOnly leftIcon={<User className="w-4 h-4" />} hint="Set during registration" />
                    <Input label="Email Address" value={profile?.email ?? ""} readOnly leftIcon={<Mail className="w-4 h-4" />} hint="Set during registration" />
                    <Input label="Mobile Number" value={profile?.mobile ?? ""} readOnly leftIcon={<Phone className="w-4 h-4" />} hint="Set during registration" />
                    <Input label="Current Location" placeholder="e.g. Bangalore, India"
                      leftIcon={<MapPin className="w-4 h-4" />}
                      value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                    <div className="sm:col-span-2">
                      <Textarea label="Professional Summary" rows={3}
                        placeholder="Tell recruiters about yourself, your strengths and career goals..."
                        value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Career Details */}
                <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-semibold text-slate-900">Career Details</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Current Role / Title" placeholder="e.g. Software Engineer"
                      leftIcon={<Briefcase className="w-4 h-4" />}
                      value={form.currentRole} onChange={(e) => setForm({ ...form, currentRole: e.target.value })} />
                    <Input label="Years of Experience" type="number" placeholder="e.g. 3"
                      leftIcon={<TrendingUp className="w-4 h-4" />}
                      value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
                    <Input label="Highest Qualification" placeholder="e.g. B.Tech Computer Science"
                      leftIcon={<GraduationCap className="w-4 h-4" />}
                      value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
                    <Input label="Expected Salary (₹/year)" type="number" placeholder="e.g. 1200000"
                      leftIcon={<Star className="w-4 h-4" />}
                      value={form.expectedSalary} onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })} />
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-semibold text-slate-900">Skills</h3>
                  </div>
                  {skills.length === 0 ? (
                    <p className="text-sm text-slate-400 mb-4">No skills added yet. Add your technical and professional skills.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {skills.map((skill) => (
                        <div key={skill} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSkill()}
                      placeholder="Add a skill (e.g. React, Python)"
                      className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    />
                    <Button size="sm" onClick={addSkill}>
                      <Plus className="w-3.5 h-3.5" /> Add
                    </Button>
                  </div>
                </div>

                {/* Resume */}
                <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-semibold text-slate-900">Resume / CV</h3>
                  </div>

                  {resumeUrl ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-sm text-emerald-700 flex-1">Resume uploaded</span>
                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-indigo-600 hover:underline font-medium">
                          <ExternalLink className="w-3.5 h-3.5" /> View
                        </a>
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-slate-500 hover:text-indigo-600 transition-colors"
                      >
                        Replace resume
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-2 text-slate-400 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-500 transition-all"
                    >
                      {cvUploading ? (
                        <span className="text-sm">Uploading…</span>
                      ) : (
                        <>
                          <FileText className="w-7 h-7" />
                          <span className="text-sm font-medium">Upload your resume</span>
                          <span className="text-xs">PDF or Word, max 5 MB</span>
                        </>
                      )}
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleCvChange}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
