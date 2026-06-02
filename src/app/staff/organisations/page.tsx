"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Building2, Search, PlusCircle, Globe, MapPin, Users } from "lucide-react";

export default function StaffOrganisationsPage() {
  const { data: session } = useSession();
  const name = (session?.user as any)?.name ?? "Staff";
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/staff/companies")
      .then((r) => r.json())
      .then((d) => { setCompanies(d.companies ?? []); setLoading(false); });
  }, []);

  const filtered = companies.filter((c) =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.industry?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar variant="staff" userName={name} userRole="Staff" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar variant="staff" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">My Organisations</h1>
              <p className="text-sm text-slate-500">{companies.length} organisations added by you</p>
            </div>
            <Link href="/staff/organisations/new">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <PlusCircle className="w-3.5 h-3.5" /> Add Organisation
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 card-shadow">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search by name or industry..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400" />
              </div>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Building2 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No organisations yet</p>
                <Link href="/staff/organisations/new" className="mt-3 inline-block">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Add your first organisation</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {filtered.map((c: any) => (
                  <div key={c.id} className="p-4 hover:bg-slate-50/50 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: c.logoColor ?? "#4f46e5" }}>
                      {c.logoText ?? c.name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900 text-sm">{c.name}</span>
                        <Badge variant="success" className="text-xs">Approved</Badge>
                        {c._count?.jobs > 0 && (
                          <span className="text-xs text-slate-500">{c._count.jobs} job{c._count.jobs !== 1 ? "s" : ""}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        {c.industry && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Users className="w-3 h-3" /> {c.industry}
                          </span>
                        )}
                        {c.location && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <MapPin className="w-3 h-3" /> {c.location}
                          </span>
                        )}
                        {c.website && (
                          <a href={c.website} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-indigo-500 hover:underline">
                            <Globe className="w-3 h-3" /> {c.website.replace(/^https?:\/\//, "")}
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">HR: {c.hrName ?? "—"} · {c.user?.email}</p>
                    </div>
                    <Link href={`/staff/jobs/new?companyId=${c.id}`}>
                      <Button size="sm" variant="outline" className="flex-shrink-0 text-xs">Post Job</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
