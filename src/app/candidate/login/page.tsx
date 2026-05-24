"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Briefcase, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CandidateLoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/candidate/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 hero-gradient flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/80 to-blue-900/80" />
        <div className="relative">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">HireNova</span>
          </Link>
        </div>
        <div className="relative">
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome Back!
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed">
            Continue your job search journey. Thousands of new opportunities are waiting for you.
          </p>
          <div className="mt-8 bg-white/10 border border-white/20 rounded-2xl p-5">
            <p className="text-sm text-white italic leading-relaxed">
              &ldquo;HireNova helped me get 5 interview calls in just 3 days. Landed my dream job at TechCorp!&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 bg-indigo-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                AK
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Arjun Kumar</p>
                <p className="text-xs text-indigo-300">Frontend Dev @ TechCorp</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <p className="text-indigo-300/60 text-xs">
            © 2026 HireNova. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">HireNova</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Sign in to your account</h1>
            <p className="text-sm text-slate-500 mt-1">
              Access your dashboard, jobs, and applications
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="arjun@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <div className="flex justify-end">
              <button className="text-xs text-indigo-600 hover:underline">
                Forgot password?
              </button>
            </div>
            <Button fullWidth size="lg" loading={loading} onClick={handleLogin}>
              Sign In <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/candidate/register" className="text-indigo-600 font-medium hover:underline">
                Create one for ₹100
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-slate-500">
              Are you a company?{" "}
              <Link href="/company/login" className="text-blue-600 font-medium hover:underline">
                Company Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
