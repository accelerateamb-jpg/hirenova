"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Users, Plus, X, Eye, EyeOff, Building2, Briefcase,
  Calendar, Ban, RotateCcw, Key, Search,
} from "lucide-react";

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Date range for performance
  const today = new Date().toISOString().split("T")[0];
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];
  const [from, setFrom] = useState(firstOfMonth);
  const [to, setTo] = useState(today);

  // Create staff modal
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", mobile: "", password: "" });
  const [showCreatePass, setShowCreatePass] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Set password modal
  const [passwordTarget, setPasswordTarget] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const fetchStaff = () => {
    setLoading(true);
    fetch(`/api/staff?from=${from}&to=${to}`)
      .then((r) => r.json())
      .then((d) => { setStaff(d.staff ?? []); setLoading(false); });
  };

  useEffect(() => { fetchStaff(); }, [from, to]);

  const filtered = staff.filter((s) =>
    !search || s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateStaff = async () => {
    setCreateError("");
    if (!createForm.name || !createForm.email || !createForm.password) {
      setCreateError("Name, email and password are required"); return;
    }
    if (createForm.password.length < 8) {
      setCreateError("Password must be at least 8 characters"); return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShowCreate(false);
      setCreateForm({ name: "", email: "", mobile: "", password: "" });
      fetchStaff();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleSetPassword = async () => {
    setPasswordError("");
    if (!newPassword || newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters"); return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/staff", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId: passwordTarget.id, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPasswordTarget(null);
      setNewPassword("");
    } catch (err: any) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleToggleBlock = async (s: any) => {
    await fetch("/api/staff", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId: s.id, isBlocked: !s.isBlocked }),
    });
    setStaff((prev) => prev.map((m) => m.id === s.id ? { ...m, isBlocked: !m.isBlocked } : m));
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="admin" userName="Admin" userRole="Super Admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="admin" />
        <main className="flex-1 p-6 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Staff Management</h1>
              <p className="text-sm text-slate-500">{staff.length} staff members</p>
            </div>
            <Button size="sm" onClick={() => setShowCreate(true)}>
              <Plus className="w-3.5 h-3.5" /> Add Staff
            </Button>
          </div>

          {/* Performance Date Range */}
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h2 className="font-semibold text-slate-900">Performance Filter</h2>
              <span className="text-xs text-slate-400 ml-1">— filter organisations & jobs added in this period</span>
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">From</label>
                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
                  className="px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">To</label>
                <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
                  className="px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div className="flex gap-2">
                {[
                  { label: "Today", f: today, t: today },
                  { label: "This Week", f: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString().split("T")[0], t: today },
                  { label: "This Month", f: firstOfMonth, t: today },
                  { label: "All Time", f: "2020-01-01", t: today },
                ].map((preset) => (
                  <button key={preset.label}
                    onClick={() => { setFrom(preset.f); setTo(preset.t); }}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${from === preset.f && to === preset.t ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Staff Table */}
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search staff by name or email..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400" />
              </div>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No staff members yet</p>
                <p className="text-sm text-slate-400 mt-1">Click "Add Staff" to create the first account</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {filtered.map((s: any) => (
                  <div key={s.id} className="p-4 hover:bg-slate-50/50 flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">
                      {s.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-800">{s.name}</span>
                        <Badge variant={s.isBlocked ? "danger" : "success"} className="text-xs">
                          {s.isBlocked ? "Blocked" : "Active"}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{s.email} {s.mobile && `· ${s.mobile}`}</p>
                      {/* Performance metrics */}
                      <div className="flex gap-4 mt-2">
                        <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-xs font-semibold text-emerald-700">{s._count?.staffCompanies ?? 0}</span>
                          <span className="text-xs text-emerald-600">orgs</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-lg">
                          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-xs font-semibold text-blue-700">{s._count?.staffJobs ?? 0}</span>
                          <span className="text-xs text-blue-600">jobs</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => { setPasswordTarget(s); setNewPassword(""); setPasswordError(""); }}
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Set Password"
                      >
                        <Key className="w-4 h-4 text-indigo-500" />
                      </button>
                      <button
                        onClick={() => handleToggleBlock(s)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                        title={s.isBlocked ? "Unblock" : "Block"}
                      >
                        {s.isBlocked
                          ? <RotateCcw className="w-4 h-4 text-emerald-500" />
                          : <Ban className="w-4 h-4 text-red-400" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Staff Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900 text-lg">Add Staff Member</h2>
              <button onClick={() => { setShowCreate(false); setCreateError(""); }}
                className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            {createError && <div className="mb-4 bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3">{createError}</div>}
            <div className="space-y-4">
              <Input label="Full Name *" placeholder="e.g. Ravi Kumar"
                value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
              <Input label="Email *" type="email" placeholder="staff@hirenova.com"
                value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} />
              <Input label="Mobile" type="tel" placeholder="+91 98765 00000"
                value={createForm.mobile} onChange={(e) => setCreateForm({ ...createForm, mobile: e.target.value })} />
              <Input label="Password *" type={showCreatePass ? "text" : "password"} placeholder="Min. 8 characters"
                value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                rightIcon={<button type="button" onClick={() => setShowCreatePass(!showCreatePass)}>
                  {showCreatePass ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                </button>} />
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" fullWidth onClick={() => { setShowCreate(false); setCreateError(""); }}>Cancel</Button>
              <Button fullWidth loading={creating} onClick={handleCreateStaff}>Create Staff</Button>
            </div>
          </div>
        </div>
      )}

      {/* Set Password Modal */}
      {passwordTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-slate-900">Set Password</h2>
                <p className="text-xs text-slate-500 mt-0.5">{passwordTarget.name} · {passwordTarget.email}</p>
              </div>
              <button onClick={() => { setPasswordTarget(null); setPasswordError(""); }}
                className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            {passwordError && <div className="mb-4 bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3">{passwordError}</div>}
            <Input label="New Password" type={showNewPass ? "text" : "password"} placeholder="Min. 8 characters"
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              rightIcon={<button type="button" onClick={() => setShowNewPass(!showNewPass)}>
                {showNewPass ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
              </button>} />
            <div className="flex gap-3 mt-6">
              <Button variant="outline" fullWidth onClick={() => { setPasswordTarget(null); setPasswordError(""); }}>Cancel</Button>
              <Button fullWidth loading={savingPassword} onClick={handleSetPassword}>Update Password</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
