"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { mockTestimonials } from "@/data/mock";
import {
  Search,
  MapPin,
  ChevronRight,
  Users,
  Briefcase,
  Building2,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react";

const stats = [
  { value: "12,847+", label: "Active Candidates", icon: <Users className="w-5 h-5" /> },
  { value: "843+", label: "Top Companies", icon: <Building2 className="w-5 h-5" /> },
  { value: "2,394+", label: "Open Positions", icon: <Briefcase className="w-5 h-5" /> },
  { value: "98%", label: "Placement Rate", icon: <TrendingUp className="w-5 h-5" /> },
];

const howItWorksSteps = [
  {
    step: "01",
    title: "Create Your Profile",
    description:
      "Sign up, complete your profile with skills, experience, and upload your resume. Get discovered by top companies.",
    icon: <Users className="w-6 h-6" />,
    color: "#4f46e5",
  },
  {
    step: "02",
    title: "Discover Opportunities",
    description:
      "Browse thousands of curated jobs. Use smart filters to find roles that match your exact skills and preferences.",
    icon: <Search className="w-6 h-6" />,
    color: "#2563eb",
  },
  {
    step: "03",
    title: "Apply Instantly",
    description:
      "One-click applications with your saved profile. Track your application status in real-time from your dashboard.",
    icon: <Zap className="w-6 h-6" />,
    color: "#10b981",
  },
  {
    step: "04",
    title: "Get Hired",
    description:
      "Connect with hiring managers, ace your interviews with AI-powered insights, and land your dream job.",
    icon: <CheckCircle className="w-6 h-6" />,
    color: "#7c3aed",
  },
];

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/jobs?limit=6").then((r) => r.json()).then((d) => setFeaturedJobs(d.jobs ?? []));
    fetch("/api/companies").then((r) => r.json()).then((d) => setCompanies(d.companies ?? []));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="landing" />

      {/* Hero Section */}
      <section className="hero-gradient min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/3 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span className="text-xs font-medium text-indigo-200">
              India&apos;s Fastest Growing Job Platform
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Connecting Talent
            <br />
            <span className="bg-gradient-to-r from-indigo-300 via-blue-300 to-emerald-300 bg-clip-text text-transparent">
              With Opportunity
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Find jobs faster. Hire smarter. Manage recruitment effortlessly.
            <br className="hidden sm:block" />
            Join 12,000+ candidates and 800+ companies on HireNova.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-3 flex-1 px-4 py-2">
                <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, skills, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-sm text-slate-700 placeholder:text-slate-400 outline-none bg-transparent"
                />
              </div>
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 border-l border-slate-100">
                <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="City or Remote"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-40 text-sm text-slate-700 placeholder:text-slate-400 outline-none bg-transparent"
                />
              </div>
              <Link href="/jobs">
                <Button size="lg" className="w-full sm:w-auto px-8 rounded-xl">
                  Search Jobs
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["React Developer", "Product Manager", "UI Designer", "Data Science", "DevOps"].map(
                (term) => (
                  <button
                    key={term}
                    className="text-xs text-slate-300 hover:text-white border border-white/15 hover:border-white/30 rounded-full px-3 py-1 transition-all cursor-pointer"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/candidate/register">
              <Button size="lg" className="bg-indigo-500 hover:bg-indigo-400 px-8">
                Find Jobs <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/company/register">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8"
              >
                Post Jobs — It&apos;s Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2 text-indigo-600">
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <Badge variant="default" className="mb-3">
                Featured Opportunities
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Latest Job Openings
              </h2>
              <p className="text-slate-500 mt-2">
                Hand-picked roles from India&apos;s top companies
              </p>
            </div>
            <Link href="/jobs">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                View All Jobs <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.length === 0 ? (
              <div className="col-span-3 text-center py-16 text-slate-400">
                <Briefcase className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                <p>No jobs posted yet. Check back soon.</p>
              </div>
            ) : featuredJobs.map((job: any) => (
              <Link href="/jobs" key={job.id} className="bg-white rounded-2xl border border-slate-100 card-shadow card-shadow-hover p-5 flex flex-col gap-3 hover:border-indigo-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: job.company?.logoColor ?? "#4f46e5" }}>
                    {job.company?.logoText ?? job.company?.name?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{job.title}</p>
                    <p className="text-xs text-slate-500">{job.company?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                  {job.isRemote && <Badge variant="success" className="text-xs">Remote</Badge>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills?.slice(0, 3).map((s: any) => (
                    <span key={s.id} className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-medium">{s.skill}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/jobs">
              <Button size="lg">
                Explore All Jobs <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="success" className="mb-3">
              Trusted Partners
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Top Companies Hiring Now
            </h2>
            <p className="text-slate-500 mt-2 max-w-xl mx-auto">
              Join thousands of candidates hired by these industry leaders
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {companies.length === 0 ? (
              <div className="col-span-6 text-center py-10 text-slate-400">
                <Building2 className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                <p>No companies listed yet.</p>
              </div>
            ) : companies.map((company: any) => (
              <div key={company.id}
                className="group bg-white rounded-2xl border border-slate-100 card-shadow card-shadow-hover p-5 flex flex-col items-center gap-3 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: company.logoColor ?? "#4f46e5" }}>
                  {company.logoText ?? company.name?.[0]}
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-800 leading-snug">{company.name}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">
                    {company._count?.jobs ?? 0} open roles
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-indigo-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge className="mb-3 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Simple Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              How HireNova Works
            </h2>
            <p className="text-slate-400 mt-2">
              From sign-up to your next job in 4 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((step, index) => (
              <div key={step.step} className="relative">
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px border-t-2 border-dashed border-slate-700 z-0" />
                )}
                <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-300">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: step.color + "33", border: `1px solid ${step.color}44` }}
                  >
                    <span style={{ color: step.color }}>{step.icon}</span>
                  </div>
                  <span className="text-4xl font-black text-white/10 absolute top-4 right-5">
                    {step.step}
                  </span>
                  <h3 className="text-base font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="purple" className="mb-3">
              Success Stories
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              What Our Users Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockTestimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-100 card-shadow p-6 flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-auto pt-3 border-t border-slate-50">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl overflow-hidden p-10 sm:p-14 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/4" />
            <div className="relative">
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                <Shield className="w-3 h-3 mr-1" /> Verified Platform
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Career?
              </h2>
              <p className="text-indigo-100 max-w-xl mx-auto mb-8 leading-relaxed">
                Join over 12,000 candidates who have already found their dream jobs. Create your profile today for just ₹100.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/candidate/register">
                  <Button
                    size="lg"
                    className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg px-8"
                  >
                    Start for ₹100 <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/company/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white/10 px-8"
                  >
                    Post Jobs Free
                  </Button>
                </Link>
              </div>
              <p className="text-indigo-200/70 text-xs mt-6">
                ✓ One-time fee &nbsp;·&nbsp; ✓ Lifetime access &nbsp;·&nbsp; ✓ Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
