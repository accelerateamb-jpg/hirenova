"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Briefcase, Building2, Mail, Phone, Lock, MapPin, FileText, ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CompanyRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/company/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-blue-700 to-indigo-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2" />
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
            Start Hiring
            <br />
            in Minutes
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed mb-8">
            Post your first job for free and access a pool of 12,000+ verified candidates ready to join your team.
          </p>
          <div className="space-y-3">
            {[
              "Free job postings for 30 days",
              "Advanced candidate filtering",
              "Applicant tracking system",
              "Direct resume downloads",
              "Interview scheduling tools",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-blue-100">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-blue-300/60 text-xs">© 2026 HireNova.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 lg:hidden">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">HireNova</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Register your company</h1>
            <p className="text-sm text-slate-500 mt-1">
              Start hiring the best talent today
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Company Name"
              placeholder="TechCorp India Pvt Ltd"
              leftIcon={<Building2 className="w-4 h-4" />}
            />
            <Input
              label="HR Contact Name"
              placeholder="Priya Sharma"
              leftIcon={<FileText className="w-4 h-4" />}
            />
            <Input
              label="Official Email"
              type="email"
              placeholder="hr@yourcompany.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />
            <Input
              label="Mobile Number"
              type="tel"
              placeholder="+91 98765 43210"
              leftIcon={<Phone className="w-4 h-4" />}
            />
            <Input
              label="Office Address"
              placeholder="123 Tech Park, Bangalore"
              leftIcon={<MapPin className="w-4 h-4" />}
            />
            <Textarea
              label="Company Description"
              placeholder="Tell candidates about your company culture, mission, and what makes you a great place to work..."
              rows={3}
            />
            <Input
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder="Create a strong password"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
              By registering, you agree to our Terms of Service and Privacy Policy. Company accounts are subject to approval.
            </div>
            <Button
              fullWidth
              size="lg"
              loading={loading}
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Company Account <ArrowRight className="w-4 h-4" />
            </Button>
            <p className="text-center text-sm text-slate-500">
              Already registered?{" "}
              <Link href="/company/login" className="text-blue-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
