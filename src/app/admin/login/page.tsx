"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Briefcase, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/admin/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-900/50">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-slate-400 text-sm mt-1">Restricted to authorized administrators</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
          <Input
            label=""
            type="email"
            placeholder="admin@hirenova.com"
            leftIcon={<Mail className="w-4 h-4" />}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-indigo-500"
          />
          <Input
            label=""
            type={showPass ? "text" : "password"}
            placeholder="Enter admin password"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
          <Button fullWidth size="lg" loading={loading} onClick={handleLogin}>
            Access Dashboard <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Not an admin?{" "}
          <Link href="/" className="text-indigo-400 hover:underline">
            Go to Homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
