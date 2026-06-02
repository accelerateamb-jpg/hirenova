"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Building2, User, Mail, Phone, MapPin, Globe, CheckCircle } from "lucide-react";

export default function AddOrganisationPage() {
  const { data: session } = useSession();
  const name = (session?.user as any)?.name ?? "Staff";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    companyName: "", hrName: "", hrEmail: "", hrMobile: "",
    industry: "", size: "", location: "", address: "",
    description: "", website: "", logoText: "",
  });
  const set = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    setError("");
    if (!form.companyName || !form.hrEmail) {
      setError("Company name and HR email are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/staff/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/staff/organisations");
    } catch (err: any) {
      setError(err.message ?? "Failed to add organisation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="staff" userName={name} userRole="Staff" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="staff" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-slate-900">Add Organisation</h1>
              <p className="text-sm text-slate-500 mt-0.5">Register a new client company on HireNova</p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-6 space-y-6">

              {/* Company Info */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" /> Company Information
                </h3>
                <div className="space-y-4">
                  <Input label="Company Name *" placeholder="e.g. TechCorp India Pvt Ltd"
                    leftIcon={<Building2 className="w-4 h-4" />}
                    value={form.companyName} onChange={(e) => set("companyName", e.target.value)} />
                  <Input label="Logo Text (2–3 letters)" placeholder="e.g. TC"
                    value={form.logoText} onChange={(e) => set("logoText", e.target.value.slice(0, 3).toUpperCase())}
                    hint="Short abbreviation shown as company logo" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1.5 block">Industry</label>
                      <select value={form.industry} onChange={(e) => set("industry", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all">
                        <option value="">Select industry</option>
                        <option>Information Technology</option>
                        <option>Finance & Banking</option>
                        <option>Healthcare</option>
                        <option>E-commerce</option>
                        <option>Manufacturing</option>
                        <option>Education</option>
                        <option>Consulting</option>
                        <option>Media & Entertainment</option>
                        <option>Real Estate</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1.5 block">Company Size</label>
                      <select value={form.size} onChange={(e) => set("size", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all">
                        <option value="">Select size</option>
                        <option>1–10</option>
                        <option>11–50</option>
                        <option>51–200</option>
                        <option>201–500</option>
                        <option>501–1000</option>
                        <option>1000+</option>
                      </select>
                    </div>
                  </div>
                  <Input label="Location" placeholder="e.g. Bangalore, Karnataka"
                    leftIcon={<MapPin className="w-4 h-4" />}
                    value={form.location} onChange={(e) => set("location", e.target.value)} />
                  <Input label="Address" placeholder="Full office address"
                    leftIcon={<MapPin className="w-4 h-4" />}
                    value={form.address} onChange={(e) => set("address", e.target.value)} />
                  <Input label="Website" placeholder="https://company.com"
                    leftIcon={<Globe className="w-4 h-4" />}
                    value={form.website} onChange={(e) => set("website", e.target.value)} />
                  <Textarea label="Company Description" rows={3}
                    placeholder="Brief description of the company, what they do, culture..."
                    value={form.description} onChange={(e) => set("description", e.target.value)} />
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* HR Contact */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" /> HR Contact
                </h3>
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-800">
                    A company login will be created using the HR email. Default password: <strong>Welcome@HireNova1</strong> — share with the client or change from Admin panel.
                  </div>
                  <Input label="HR Name" placeholder="e.g. Priya Mehta"
                    leftIcon={<User className="w-4 h-4" />}
                    value={form.hrName} onChange={(e) => set("hrName", e.target.value)} />
                  <Input label="HR Email *" type="email" placeholder="hr@company.com"
                    leftIcon={<Mail className="w-4 h-4" />}
                    value={form.hrEmail} onChange={(e) => set("hrEmail", e.target.value)} />
                  <Input label="HR Mobile" type="tel" placeholder="+91 98765 43210"
                    leftIcon={<Phone className="w-4 h-4" />}
                    value={form.hrMobile} onChange={(e) => set("hrMobile", e.target.value)} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" onClick={() => router.push("/staff/organisations")}>Cancel</Button>
                <Button loading={loading} onClick={handleSubmit}
                  className="bg-emerald-600 hover:bg-emerald-700 px-8">
                  <CheckCircle className="w-4 h-4" /> Add Organisation
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
