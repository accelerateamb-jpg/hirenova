"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import {
  Briefcase, Building2, Mail, Phone, Lock, MapPin,
  FileText, ArrowRight, Eye, EyeOff, CheckCircle, Shield,
} from "lucide-react";

const steps = [
  { id: 1, label: "Details" },
  { id: 2, label: "Verify" },
  { id: 3, label: "Done" },
];

export default function CompanyRegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [form, setForm] = useState({
    name: "", hrName: "", email: "", mobile: "", address: "", description: "", password: "",
  });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSendOtp = async () => {
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Company name, email and password are required");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, type: "COMPANY" }),
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

  const handleVerifyAndCreate = async () => {
    const code = otpValues.join("");
    if (code.length < 6) { setError("Enter all 6 digits"); return; }
    setError("");
    setLoading(true);
    try {
      // Verify OTP
      const verifyRes = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code, type: "COMPANY" }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error);

      // Create company account
      const regRes = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const regData = await regRes.json();
      if (!regRes.ok) throw new Error(regData.error);

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
        body: JSON.stringify({ email: form.email, type: "COMPANY" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel */}
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
          <h2 className="text-3xl font-bold text-white mb-4">Start Hiring<br />in Minutes</h2>
          <p className="text-blue-200 text-sm leading-relaxed mb-8">
            Post your first job for free and access a pool of 12,000+ verified candidates.
          </p>
          <div className="space-y-3">
            {["Free job postings for 30 days", "Advanced candidate filtering", "Applicant tracking system", "Direct resume downloads"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-blue-100">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-blue-300/60 text-xs">© 2026 HireNova.</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 lg:hidden">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">HireNova</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {step === 1 && "Register your company"}
              {step === 2 && "Verify your email"}
              {step === 3 && "Registration submitted"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {step === 1 && "Start hiring the best talent today"}
              {step === 2 && `We sent a 6-digit code to ${form.email}`}
              {step === 3 && "Your account is under review"}
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step > s.id ? "bg-emerald-500 text-white" : step === s.id ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"
                  }`}>
                    {step > s.id ? <CheckCircle className="w-4 h-4" /> : s.id}
                  </div>
                  <span className={`text-xs font-medium ${step >= s.id ? "text-slate-700" : "text-slate-400"}`}>{s.label}</span>
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

          {/* Step 1: Company Details */}
          {step === 1 && (
            <div className="space-y-4">
              <Input label="Company Name" placeholder="TechCorp India Pvt Ltd" leftIcon={<Building2 className="w-4 h-4" />}
                value={form.name} onChange={(e) => update("name", e.target.value)} />
              <Input label="HR Contact Name" placeholder="Priya Sharma" leftIcon={<FileText className="w-4 h-4" />}
                value={form.hrName} onChange={(e) => update("hrName", e.target.value)} />
              <Input label="Official Email" type="email" placeholder="hr@yourcompany.com" leftIcon={<Mail className="w-4 h-4" />}
                value={form.email} onChange={(e) => update("email", e.target.value)} />
              <Input label="Mobile Number" type="tel" placeholder="+91 98765 43210" leftIcon={<Phone className="w-4 h-4" />}
                value={form.mobile} onChange={(e) => update("mobile", e.target.value)} />
              <Input label="Office Address" placeholder="123 Tech Park, Bangalore" leftIcon={<MapPin className="w-4 h-4" />}
                value={form.address} onChange={(e) => update("address", e.target.value)} />
              <Textarea label="Company Description" placeholder="Tell candidates about your culture and mission..."
                rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />
              <Input label="Password" type={showPass ? "text" : "password"} placeholder="Create a strong password"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={<button onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
                value={form.password} onChange={(e) => update("password", e.target.value)} />
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
                Company accounts are subject to admin approval before you can post jobs.
              </div>
              <Button fullWidth size="lg" loading={loading} onClick={handleSendOtp} className="bg-blue-600 hover:bg-blue-700">
                Send Verification OTP <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-center text-sm text-slate-500">
                Already registered?{" "}
                <Link href="/company/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
              </p>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-2xl p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Check your inbox</p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    Code sent to <strong>{form.email}</strong>
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
                      className="w-full aspect-square text-center text-lg font-bold border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Didn&apos;t receive?{" "}
                <button onClick={handleResendOtp} disabled={loading} className="text-blue-600 font-medium hover:underline disabled:opacity-50">
                  Resend OTP
                </button>
                {" "}(valid for 10 mins)
              </p>
              <Button fullWidth size="lg" loading={loading} onClick={handleVerifyAndCreate} className="bg-blue-600 hover:bg-blue-700">
                Verify & Create Account <ArrowRight className="w-4 h-4" />
              </Button>
              <button onClick={() => { setStep(1); setError(""); setOtpValues(["","","","","",""]); }}
                className="w-full text-xs text-slate-400 hover:text-slate-600 text-center">
                ← Back to edit details
              </button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Account Created!</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Your company account is pending admin approval. You'll be able to post jobs once approved.
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-left">
                <p className="text-xs font-semibold text-amber-800 mb-1">What happens next?</p>
                <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
                  <li>Admin reviews your company details</li>
                  <li>Approval usually takes 24–48 hours</li>
                  <li>You'll receive an email once approved</li>
                </ul>
              </div>
              <Link href="/company/login">
                <Button fullWidth size="lg" className="bg-blue-600 hover:bg-blue-700 mt-2">
                  Go to Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
