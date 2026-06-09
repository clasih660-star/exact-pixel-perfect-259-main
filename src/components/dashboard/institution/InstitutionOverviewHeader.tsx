import { Link } from "@tanstack/react-router";
import { 
  Plus, 
  Upload, 
  UserPlus, 
  GraduationCap, 
  Play,
  Building2,
  MapPin,
  CheckCircle2
} from "lucide-react";

interface InstitutionOverviewHeaderProps {
  institutionName: string;
  institutionType: string;
  status: string;
  location: string;
  logo: string;
}

export function InstitutionOverviewHeader({
  institutionName,
  institutionType,
  status,
  location,
  logo,
}: InstitutionOverviewHeaderProps) {
  return (
    <section className="dashboard-card overflow-hidden">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Left side: Institution info */}
        <div className="flex items-start gap-4">
          {/* Institution Logo */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-2xl font-bold text-white shadow-lg">
            {logo}
          </div>

          {/* Institution Details */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                Institution dashboard
              </span>
            </div>
            
            <h1 className="text-2xl font-bold text-[var(--gray-900)] lg:text-3xl">
              {institutionName}
            </h1>
            
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-[var(--gray-600)]">
                <Building2 className="h-4 w-4" />
                {institutionType}
              </span>
              <span className="flex items-center gap-1 text-[var(--gray-600)]">
                <MapPin className="h-4 w-4" />
                {location}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">{status}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Primary Actions */}
        <div className="flex flex-wrap gap-3 lg:ml-auto">
          <Link
            to="/institution/courses/new"
            className="btn-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </Link>
          <Link
            to="/institution/resources/upload"
            className="btn-secondary flex items-center gap-2 rounded-xl border border-[var(--gray-200)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--gray-50)]"
          >
            <Upload className="h-4 w-4" />
            Upload Resource
          </Link>
          <Link
            to="/institution/students/invite"
            className="btn-secondary flex items-center gap-2 rounded-xl border border-[var(--gray-200)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--gray-50)]"
          >
            <UserPlus className="h-4 w-4" />
            Invite Student
          </Link>
          <Link
            to="/institution/teachers/invite"
            className="btn-secondary flex items-center gap-2 rounded-xl border border-[var(--gray-200)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--gray-50)]"
          >
            <GraduationCap className="h-4 w-4" />
            Invite Teacher
          </Link>
          <Link
            to="/institution/sessions/new"
            className="btn-secondary flex items-center gap-2 rounded-xl border border-[var(--gray-200)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--gray-50)]"
          >
            <Play className="h-4 w-4" />
            Start Classroom
          </Link>
        </div>
      </div>
    </section>
  );
}