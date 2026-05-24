import Link from "next/link";
import { Briefcase, X, Globe, Code, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Hire<span className="text-indigo-400">Nova</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              The smarter way to hire and get hired. Connecting talent with
              opportunity across India.
            </p>
            <div className="flex gap-3">
              {[X, Globe, Code, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition-colors text-slate-400 hover:text-white"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              For Candidates
            </h4>
            <ul className="space-y-2.5">
              {[
                ["Browse Jobs", "/candidate/jobs"],
                ["Create Profile", "/candidate/register"],
                ["Resume Tips", "#"],
                ["Career Advice", "#"],
                ["Salary Insights", "#"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm hover:text-indigo-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Companies */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              For Companies
            </h4>
            <ul className="space-y-2.5">
              {[
                ["Post a Job", "/company/post-job"],
                ["Search Candidates", "#"],
                ["Pricing", "#"],
                ["Recruitment Solutions", "#"],
                ["Bulk Hiring", "#"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm hover:text-indigo-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                ["About Us", "#"],
                ["Blog", "#"],
                ["Press", "#"],
                ["Privacy Policy", "#"],
                ["Terms of Service", "#"],
                ["Contact", "#"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm hover:text-indigo-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            © 2026 HireNova. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Made with</span>
            <span className="text-red-500">♥</span>
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
