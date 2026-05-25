"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Briefcase, Eye, EyeOff, CheckCircle, Shield,
  Smartphone, Mail, User, Lock, CreditCard, ArrowRight,
  Upload, FileText, X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

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
  const [error, setError] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      setError("Only PDF and Word documents allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5 MB");
      return;
    }
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

  const handleSendOtp = async () => {
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!cvFile) {
      setError("Please upload your resume before continuing");
      return;
    }
    if (cvUploading) {
      setError("Please wait for your resume to finish uploading");
      return;
    }
    if (!resumeUrl) {
      setError("Resume upload failed. Please try again");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, type: "CANDIDATE" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otpValues];
    updated[index] = value.slice(-1);
    setOtpValues(updated);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtpValues(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otpValues.join("");
    if (code.length < 6) { setError("Enter all 6 digits"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code, type: "CANDIDATE" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Create account after OTP verified
      const regRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, resumeUrl }),
      });
      const regData = await regRes.json();
      if (!regRes.ok) throw new Error(regData.error);

      // Auto-signin so session is available immediately
      await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setOtpValues(["", "", "", "", "", ""]);
    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, type: "CANDIDATE" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
            Your Dream Job<br />Is One Click Away
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed mb-8">
            Join 12,000+ candidates who landed their perfect role using HireNova.
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
          <p className="text-indigo-300/60 text-xs">© 2026 HireNova. All rights reserved.</p>
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
            <h1 className="text-2xl font-bold text-slate-900">
              {step === 1 && "Create your account"}
              {step === 2 && "Verify your email"}
              {step === 3 && "Complete registration"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {step === 1 && "Start your journey to your dream job"}
              {step === 2 && `We sent a 6-digit code to ${form.email}`}
              {step === 3 && "One-time registration fee of ₹100"}
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step > s.id ? "bg-emerald-500 text-white" : step === s.id ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-400"
                  }`}>
                    {step > s.id ? <CheckCircle className="w-4 h-4" /> : s.id}
                  </div>
                  <span className={`text-xs font-medium ${step >= s.id ? "text-slate-700" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-1 ${step > s.id ? "bg-emerald-400" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Step 1: Account */}
          {step === 1 && (
            <div className="space-y-4">
              <Input label="Full Name" placeholder="Arjun Kumar" leftIcon={<User className="w-4 h-4" />}
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Email Address" type="email" placeholder="arjun@example.com" leftIcon={<Mail className="w-4 h-4" />}
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input label="Mobile Number" type="tel" placeholder="+91 98765 43210" leftIcon={<Smartphone className="w-4 h-4" />}
                value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
              <Input label="Password" type={showPass ? "text" : "password"} placeholder="Min. 8 characters"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={<button onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

              {/* CV Upload */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Resume / CV <span className="text-red-500">*</span>
                </label>
                {cvFile ? (
                  <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5">
                    <FileText className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span className="text-xs text-indigo-700 flex-1 truncate">{cvFile.name}</span>
                    {cvUploading ? (
                      <span className="text-xs text-indigo-400">Uploading…</span>
                    ) : (
                      <button onClick={() => { setCvFile(null); setResumeUrl(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        className="text-indigo-400 hover:text-indigo-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-slate-500 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                  >
                    <Upload className="w-4 h-4 text-slate-400" />
                    <span>Upload PDF or Word doc (max 5 MB)</span>
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

              <Button fullWidth size="lg" loading={loading || cvUploading} onClick={handleSendOtp} className="mt-2">
                Send OTP <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/candidate/login" className="text-indigo-600 font-medium hover:underline">Sign in</Link>
              </p>
            </div>
          )}

          {/* Step 2: OTP Verify */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-indigo-50 rounded-2xl p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-indigo-900">Check your inbox</p>
                  <p className="text-xs text-indigo-600 mt-0.5">
                    A verification code was sent to <strong>{form.email}</strong>
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Enter 6-digit OTP</label>
                <div className="flex gap-2" onPaste={handleOtpPaste}>
                  {otpValues.map((val, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-full aspect-square text-center text-lg font-bold border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Didn&apos;t receive?{" "}
                <button onClick={handleResendOtp} disabled={loading} className="text-indigo-600 font-medium hover:underline disabled:opacity-50">
                  Resend OTP
                </button>
                {" "}(valid for 10 mins)
              </p>
              <Button fullWidth size="lg" loading={loading} onClick={handleVerifyOtp}>
                Verify & Continue <ArrowRight className="w-4 h-4" />
              </Button>
              <button onClick={() => { setStep(1); setError(""); setOtpValues(["","","","","",""]); }}
                className="w-full text-xs text-slate-400 hover:text-slate-600 text-center">
                ← Back to edit email
              </button>
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
                  <button key={method} className="border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all">
                    {method}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                <Input label="Card Number" placeholder="4242 4242 4242 4242" leftIcon={<CreditCard className="w-4 h-4" />} />
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
