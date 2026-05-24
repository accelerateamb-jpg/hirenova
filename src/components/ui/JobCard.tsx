"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatSalaryRange, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  MapPin,
  Clock,
  Users,
  Bookmark,
  BookmarkCheck,
  Wifi,
} from "lucide-react";
import { useState } from "react";

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  companyColor: string;
  location: string;
  type: string;
  experience: string;
  salary: { min: number; max: number };
  skills: string[];
  postedAt: string;
  applicants: number;
  isRemote: boolean;
  category: string;
}

interface JobCardProps {
  job: Job;
  showApply?: boolean;
  onApply?: (jobId: string) => void;
}

export function JobCard({ job, showApply = true, onApply }: JobCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 card-shadow card-shadow-hover transition-all duration-300 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ backgroundColor: job.companyColor }}
          >
            {job.companyLogo}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
              {job.title}
            </h3>
            <p className="text-sm text-slate-500">{job.company}</p>
          </div>
        </div>
        <button
          onClick={() => setSaved(!saved)}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-all flex-shrink-0"
        >
          {saved ? (
            <BookmarkCheck className="w-4.5 h-4.5 text-indigo-600" />
          ) : (
            <Bookmark className="w-4.5 h-4.5" />
          )}
        </button>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="w-3.5 h-3.5" /> {job.location}
        </span>
        {job.isRemote && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <Wifi className="w-3.5 h-3.5" /> Remote
          </span>
        )}
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" /> {timeAgo(job.postedAt)}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <Users className="w-3.5 h-3.5" /> {job.applicants} applied
        </span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {job.skills.slice(0, 4).map((skill) => (
          <Badge key={skill} variant="default" className="text-xs">
            {skill}
          </Badge>
        ))}
        {job.skills.length > 4 && (
          <Badge variant="outline">+{job.skills.length - 4}</Badge>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-50">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {formatSalaryRange(job.salary.min, job.salary.max)}
          </p>
          <p className="text-xs text-slate-500">{job.experience} exp</p>
        </div>
        {showApply && (
          <Button
            size="sm"
            onClick={() => onApply?.(job.id)}
            className="text-xs"
          >
            Apply Now
          </Button>
        )}
      </div>
    </div>
  );
}
