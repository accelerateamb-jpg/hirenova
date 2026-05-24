"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Briefcase, Eye, EyeOff, Mail, Lock, ArrowRight, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CompanyLoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/company/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-blue-700 to-indigo-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">HireNova</span>
          </Link>
        </div>
        <div className="relative">
          <Building2 className="w-12 h-12 text-blue-300 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Hire Top Talent
            <br />
            Effortlessly
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            Access thousands of verified candidates. Post jobs, shortlist applicants, and manage your entire hiring pipeline in one place.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { value: "843+", label: "Companies" },
              { value: "12K+", label: "Candidates" },
              { value: "2.4K+", label: "Active Jobs" },
              { value: "98%", label: "Hire Rate" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-blue-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-blue-300/60 text-xs">
          © 2026 HireNova. All rights reserved.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">HireNova</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mb-4">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Company Portal</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Sign in to your company</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your jobs and applicants
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Company Email"
              type="email"
              placeholder="hr@yourcompany.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />
            <Input
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            <Button
              fullWidth
              size="lg"
              loading={loading}
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center space-y-3">
            <p className="text-sm text-slate-500">
              New to HireNova?{" "}
              <Link href="/company/register" className="text-blue-600 font-medium hover:underline">
                Register your company
              </Link>
            </p>
            <p className="text-sm text-slate-500">
              Looking for a job?{" "}
              <Link href="/candidate/login" className="text-indigo-600 font-medium hover:underline">
                Candidate Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
