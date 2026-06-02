"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Briefcase, Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Email and password are required"); return; }
    setError(""); setLoading(true);
    try {
      const res = await signIn("credentials", { redirect: false, email, password });
      if (res?.error) throw new Error("Invalid email or password");
      router.push("/staff/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-emerald-600 to-teal-800 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/80 to-teal-900/80" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="relative">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">HireNova</span>
          </Link>
        </div>
        <div className="relative">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 leading-tight">Staff Portal</h2>
          <p className="text-emerald-200 text-sm leading-relaxed">
            Add organisations, post jobs on behalf of clients, and track your work — all in one place.
          </p>
        </div>
        <p className="relative text-emerald-300/60 text-xs">© 2026 HireNova. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">HireNova Staff</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Staff Login</h1>
            <p className="text-sm text-slate-500 mt-1">Sign in with your staff credentials</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          <div className="space-y-4">
            <Input label="Email Address" type="email" placeholder="staff@hirenova.com"
              leftIcon={<Mail className="w-4 h-4" />}
              value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Password" type={showPass ? "text" : "password"} placeholder="Your password"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={<button type="button" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
              value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            <Button fullWidth size="lg" loading={loading} onClick={handleLogin}
              className="bg-emerald-600 hover:bg-emerald-700">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
