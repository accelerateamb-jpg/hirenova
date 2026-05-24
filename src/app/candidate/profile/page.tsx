"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { mockCandidates } from "@/data/mock";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Plus,
  X,
  Upload,
  CheckCircle,
  Edit3,
  TrendingUp,
  Star,
} from "lucide-react";

const candidate = mockCandidates[0];

const profileSections = [
  { id: "personal", label: "Personal Info", completion: 100 },
  { id: "education", label: "Education", completion: 100 },
  { id: "experience", label: "Experience", completion: 80 },
  { id: "skills", label: "Skills", completion: 90 },
  { id: "resume", label: "Resume", completion: 100 },
];

export default function CandidateProfilePage() {
  const [skills, setSkills] = useState([...candidate.skills, "GraphQL", "Redux"]);
  const [newSkill, setNewSkill] = useState("");
  const [editSection, setEditSection] = useState<string | null>(null);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="candidate" userName="Arjun Kumar" userRole="Job Seeker" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="candidate" candidateName="Arjun Kumar" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Keep your profile updated to attract more recruiters
              </p>
            </div>
            <Button size="sm">
              <CheckCircle className="w-3.5 h-3.5" /> Save Changes
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left: Completion Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Profile Strength */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <div className="text-center mb-4">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                      <circle
                        cx="40" cy="40" r="34" fill="none"
                        stroke="#4f46e5" strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 34 * candidate.profileCompletion / 100} ${2 * Math.PI * 34}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-indigo-600">
                        {candidate.profileCompletion}%
                      </span>
                    </div>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">Profile Strength</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {candidate.profileCompletion >= 90 ? "Excellent!" : "Add more details"}
                  </p>
                </div>
                <div className="space-y-2">
                  {profileSections.map((section) => (
                    <div key={section.id} className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          section.completion === 100
                            ? "bg-emerald-500"
                            : "bg-amber-400"
                        }`}
                      >
                        {section.completion === 100 ? (
                          <CheckCircle className="w-3 h-3 text-white" />
                        ) : (
                          <TrendingUp className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-xs text-slate-600 flex-1">{section.label}</span>
                      <span className="text-xs text-slate-400">{section.completion}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile Views */}
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-semibold">Profile Views</span>
                </div>
                <p className="text-3xl font-bold">{candidate.profileViews}</p>
                <p className="text-indigo-200 text-xs mt-1">+24 this week</p>
              </div>
            </div>

            {/* Right: Profile Sections */}
            <div className="lg:col-span-3 space-y-5">
              {/* Personal Info */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-semibold text-slate-900">Personal Information</h3>
                  </div>
                  <button
                    onClick={() => setEditSection(editSection === "personal" ? null : "personal")}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                    {candidate.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{candidate.name}</p>
                    <p className="text-sm text-slate-500">{candidate.currentRole}</p>
                    <button className="text-xs text-indigo-600 hover:underline mt-0.5">
                      Change photo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" defaultValue={candidate.name} leftIcon={<User className="w-4 h-4" />} />
                  <Input label="Email" defaultValue={candidate.email} leftIcon={<Mail className="w-4 h-4" />} />
                  <Input label="Mobile" defaultValue={candidate.mobile} leftIcon={<Phone className="w-4 h-4" />} />
                  <Input label="Current Location" defaultValue={candidate.location} leftIcon={<MapPin className="w-4 h-4" />} />
                  <div className="sm:col-span-2">
                    <Textarea
                      label="Professional Summary"
                      defaultValue={candidate.summary}
                      rows={3}
                      placeholder="Tell recruiters about yourself..."
                    />
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-semibold text-slate-900">Education</h3>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Plus className="w-3.5 h-3.5" /> Add
                  </Button>
                </div>
                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{candidate.qualification}</p>
                        <p className="text-sm text-slate-600">IIT Bangalore</p>
                        <p className="text-xs text-slate-400 mt-1">2018 – 2022 · CGPA 8.4/10</p>
                      </div>
                    </div>
                    <button className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-semibold text-slate-900">Work Experience</h3>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Plus className="w-3.5 h-3.5" /> Add
                  </Button>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      role: "Senior Frontend Developer",
                      company: "StartupXYZ",
                      duration: "Jan 2023 – Present · 1 yr 5 mos",
                      desc: "Led frontend development for core product features. Improved performance by 40%.",
                    },
                    {
                      role: "Frontend Developer",
                      company: "TechFirm Pvt Ltd",
                      duration: "Jul 2022 – Dec 2022 · 6 mos",
                      desc: "Built responsive UI components using React and TypeScript.",
                    },
                  ].map((exp, i) => (
                    <div key={i} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{exp.role}</p>
                            <p className="text-sm text-slate-600">{exp.company}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{exp.duration}</p>
                            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                              {exp.desc}
                            </p>
                          </div>
                        </div>
                        <button className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-semibold text-slate-900">Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    placeholder="Add a skill (e.g. Python)"
                    className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                  <Button size="sm" onClick={addSkill}>
                    <Plus className="w-3.5 h-3.5" /> Add
                  </Button>
                </div>
              </div>

              {/* Resume Upload */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-semibold text-slate-900">Resume</h3>
                </div>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                  <Upload className="w-8 h-8 text-slate-300 group-hover:text-indigo-400 mx-auto mb-3 transition-colors" />
                  <p className="text-sm font-medium text-slate-700">
                    Drag & drop your resume here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX up to 5MB</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Browse Files
                  </Button>
                </div>
                <div className="mt-3 flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm text-emerald-700">Resume_Arjun_Kumar_2026.pdf uploaded</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
