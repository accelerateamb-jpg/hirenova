"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { StatCard } from "@/components/ui/Card";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JobCard } from "@/components/ui/JobCard";
import { mockJobs, mockApplications, mockCandidates } from "@/data/mock";
import { formatSalaryRange } from "@/lib/utils";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  Eye,
  Bookmark,
  TrendingUp,
  Bell,
  ArrowRight,
  Zap,
  CheckCircle,
  Clock,
  MapPin,
} from "lucide-react";

const candidate = mockCandidates[0];
const myApplications = mockApplications.filter((a) => a.candidateId === "1");

export default function CandidateDashboard() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="candidate" userName="Arjun Kumar" userRole="Job Seeker" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="candidate" candidateName="Arjun Kumar" />

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Welcome */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Good morning, Arjun 👋
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                You have 3 new job recommendations today
              </p>
            </div>
            <Link href="/candidate/jobs">
              <Button size="sm">
                <Zap className="w-3.5 h-3.5" /> Browse Jobs
              </Button>
            </Link>
          </div>

          {/* Profile Completion Banner */}
          {candidate.profileCompletion < 100 && (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Profile {candidate.profileCompletion}% complete
                  </p>
                  <p className="text-xs text-slate-500">
                    Complete your profile to get 3x more views
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${candidate.profileCompletion}%` }}
                  />
                </div>
                <Link href="/candidate/profile">
                  <Button size="sm" variant="outline">
                    Complete
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Applications"
              value={candidate.appliedJobs}
              change={8.3}
              icon={<FileText className="w-5 h-5" />}
              color="#4f46e5"
            />
            <StatCard
              label="Profile Views"
              value={candidate.profileViews}
              change={12.1}
              icon={<Eye className="w-5 h-5" />}
              color="#2563eb"
            />
            <StatCard
              label="Saved Jobs"
              value={candidate.savedJobs}
              icon={<Bookmark className="w-5 h-5" />}
              color="#7c3aed"
            />
            <StatCard
              label="Shortlisted"
              value={myApplications.filter((a) => a.status === "shortlisted").length}
              icon={<CheckCircle className="w-5 h-5" />}
              color="#10b981"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Applications */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900">My Applications</h2>
                  <Link href="/candidate/applications">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View All <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {myApplications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {app.jobTitle}
                          </p>
                          <p className="text-xs text-slate-500">{app.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">
                          {new Date(app.appliedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                        <StatusBadge status={app.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Jobs */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900">Recommended for You</h2>
                  <Link href="/candidate/jobs">
                    <Button variant="ghost" size="sm" className="text-xs">
                      Browse All <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockJobs.slice(0, 2).map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-5">
              {/* Profile Summary */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <h3 className="font-semibold text-slate-900 mb-4">Your Profile</h3>
                <div className="text-center pb-4 border-b border-slate-50">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-white">
                      {candidate.name[0]}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900">{candidate.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{candidate.currentRole}</p>
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-slate-400">
                    <MapPin className="w-3 h-3" /> {candidate.location}
                  </div>
                </div>
                <div className="pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Experience</span>
                    <span className="font-medium text-slate-800">{candidate.experience} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Expected CTC</span>
                    <span className="font-medium text-slate-800">
                      {formatSalaryRange(candidate.salary, candidate.salary * 1.3)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Top Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills.map((s) => (
                        <Badge key={s} variant="default" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Link href="/candidate/profile">
                  <Button variant="outline" fullWidth size="sm" className="mt-4">
                    Edit Profile
                  </Button>
                </Link>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                  <Badge variant="danger" className="text-xs">2 new</Badge>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
                      text: "You've been shortlisted for Senior Frontend Developer",
                      time: "2h ago",
                    },
                    {
                      icon: <Bell className="w-4 h-4 text-indigo-500" />,
                      text: "5 new jobs matching your skills posted today",
                      time: "5h ago",
                    },
                    {
                      icon: <Clock className="w-4 h-4 text-amber-500" />,
                      text: "Complete your profile to unlock more matches",
                      time: "1d ago",
                    },
                  ].map((notif, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">{notif.icon}</div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-700 leading-snug">{notif.text}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
