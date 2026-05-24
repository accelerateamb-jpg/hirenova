"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Briefcase,
  Eye,
  EyeOff,
  CheckCircle,
  Shield,
  Smartphone,
  Mail,
  User,
  Lock,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, label: "Account" },
  { id: 2, label: "Verify" },
  { id: 3, label: "Payment" },
];

export default function CandidateRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [otp, setOtp] = useState("");

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/candidate/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 hero-gradient flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/80 to-blue-900/80" />
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
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Your Dream Job
            <br />
            Is One Click Away
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed mb-8">
            Join 12,000+ candidates who landed their perfect role using HireNova. Create your profile and start applying instantly.
          </p>
          <div className="space-y-3">
            {[
              "One-time ₹100 registration fee",
              "Lifetime access to all job listings",
              "AI-powered job matching",
              "Direct recruiter connections",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-indigo-100">{feature}</span>
              </div>
            ))}
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
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">HireNova</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {step === 1 && "Create your account"}
              {step === 2 && "Verify your identity"}
              {step === 3 && "Complete registration"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {step === 1 && "Start your journey to your dream job"}
              {step === 2 && "We've sent a code to your mobile & email"}
              {step === 3 && "One-time registration fee of ₹100"}
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step > s.id
                        ? "bg-emerald-500 text-white"
                        : step === s.id
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {step > s.id ? <CheckCircle className="w-4 h-4" /> : s.id}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      step >= s.id ? "text-slate-700" : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-1 ${
                      step > s.id ? "bg-emerald-400" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Account */}
          {step === 1 && (
            <div className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Arjun Kumar"
                leftIcon={<User className="w-4 h-4" />}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="arjun@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                label="Mobile Number"
                type="tel"
                placeholder="+91 98765 43210"
                leftIcon={<Smartphone className="w-4 h-4" />}
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />
              <Input
                label="Password"
                type={showPass ? "text" : "password"}
                placeholder="Min. 8 characters"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button onClick={() => setShowPass(!showPass)}>
                    {showPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <Button fullWidth size="lg" onClick={handleNext} className="mt-2">
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/candidate/login" className="text-indigo-600 font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          )}

          {/* Step 2: OTP Verify */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-indigo-50 rounded-2xl p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-indigo-900">Verification Required</p>
                  <p className="text-xs text-indigo-600 mt-0.5">
                    Enter the OTP sent to +91 98765 43210 and {form.email || "your email"}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Enter 6-digit OTP
                </label>
                <div className="flex gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-full aspect-square text-center text-lg font-bold border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Didn&apos;t receive?{" "}
                <button className="text-indigo-600 font-medium hover:underline">
                  Resend OTP
                </button>
                {" "}(valid for 10 mins)
              </p>
              <Button fullWidth size="lg" onClick={handleNext}>
                Verify & Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Registration Fee</span>
                  <span className="font-semibold text-slate-900">₹100.00</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Lifetime platform access</span>
                  <Badge variant="success">One-time</Badge>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between">
                  <span className="text-sm font-semibold text-slate-900">Total</span>
                  <span className="text-sm font-bold text-indigo-600">₹100.00</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {["Razorpay", "PhonePe", "Stripe"].map((method) => (
                  <button
                    key={method}
                    className="border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                  >
                    {method}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <Input
                  label="Card Number"
                  placeholder="4242 4242 4242 4242"
                  leftIcon={<CreditCard className="w-4 h-4" />}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="MM / YY" label="Expiry" />
                  <Input placeholder="CVV" label="CVV" type="password" />
                </div>
              </div>

              <Button fullWidth size="lg" loading={loading} onClick={handlePayment}>
                Pay ₹100 & Activate Account
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <Shield className="w-3.5 h-3.5" />
                <span>256-bit SSL encryption. Your payment is secure.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
