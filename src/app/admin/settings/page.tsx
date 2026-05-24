"use client";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
export default function Page() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="admin" userName="User" userRole="admin" />
      <div className="flex-1 flex flex-col"><Navbar variant="admin" candidateName="User" />
      <main className="flex-1 p-6"><h1 className="text-xl font-bold text-slate-900">Settings</h1><p className="text-slate-500 mt-1">Coming soon...</p></main></div>
    </div>
  );
}
