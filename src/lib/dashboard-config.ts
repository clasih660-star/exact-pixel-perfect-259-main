import {
  Accessibility,
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  Building2,
  Calendar,
  Clipboard,
  CreditCard,
  Eye,
  FileText,
  Folder,
  GraduationCap,
  HelpCircle,
  Home,
  Layers,
  LifeBuoy,
  MessageSquare,
  Monitor,
  Notebook,
  Palette,
  Phone,
  Search,
  Server,
  Settings,
  Shield,
  Sparkles,
  type LucideIcon,
  FileCheck,
  FolderUp,
  Radio,
  School,
  ScrollText,
  UserPlus,
  Users,
  Video,
  Zap,
} from "lucide-react";

export type DashboardRole = "learner" | "teacher" | "institution" | "platform_admin" | "parent";

export type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

export type SidebarGroup = {
  title: string;
  items: SidebarItem[];
};

export type DashboardConfig = {
  role: DashboardRole;
  title: string;
  subtitle: string;
  primaryAction: {
    label: string;
    href: string;
  };
  sidebar: SidebarItem[];
  sidebarGroups?: SidebarGroup[];
  searchPlaceholder: string;
  settingsHref: string;
  roleLabel: string;
};

export const dashboardConfigs: Record<DashboardRole, DashboardConfig> = {
  /* ─── Learner ──────────────────────────────────────────────────── */
  learner: {
    role: "learner",
    title: "Learner Dashboard",
    subtitle: "Continue learning, enter classrooms, and track your progress.",
    primaryAction: { label: "Enter Classroom", href: "/student/classrooms" },
    searchPlaceholder: "Search lessons, notes, resources...",
    settingsHref: "/student/settings",
    roleLabel: "Learner",
    sidebar: [
      { label: "Dashboard", href: "/student/dashboard", icon: Home },
      { label: "My Classrooms", href: "/student/classrooms", icon: Monitor },
      { label: "My Courses", href: "/student/courses", icon: BookOpen },
      { label: "Lessons", href: "/student/lessons", icon: FileText },
      { label: "Calendar", href: "/student/calendar", icon: Calendar },
      { label: "Resources", href: "/student/resources", icon: Folder },
      { label: "Notes", href: "/student/notes", icon: Notebook },
      { label: "Transcripts", href: "/student/transcripts", icon: ScrollText },
      { label: "Progress", href: "/student/progress", icon: Activity },
      { label: "Assignments", href: "/student/assignments", icon: Clipboard },
      { label: "Quizzes", href: "/student/quizzes", icon: HelpCircle },
      { label: "Messages", href: "/student/messages", icon: MessageSquare },
      { label: "Learning Access", href: "/student/access", icon: Accessibility },
      { label: "Search", href: "/student/search", icon: Search },
      { label: "Notifications", href: "/student/notifications", icon: Bell },
      { label: "Settings", href: "/student/settings", icon: Settings },
    ],
  },

  /* ─── Teacher ──────────────────────────────────────────────────── */
  teacher: {
    role: "teacher",
    title: "Teacher Dashboard",
    subtitle: "Prepare lessons, start classes, and support learners.",
    primaryAction: { label: "Start Class", href: "/teacher/sessions" },
    searchPlaceholder: "Search courses, lessons, students...",
    settingsHref: "/teacher/settings",
    roleLabel: "Teacher",
    sidebar: [
      { label: "Dashboard", href: "/teacher/dashboard", icon: Home },
      { label: "My Courses", href: "/teacher/courses", icon: BookOpen },
      { label: "Lessons", href: "/teacher/lessons", icon: FileText },
      { label: "Sessions", href: "/teacher/sessions", icon: Video },
      { label: "Resources", href: "/teacher/resources", icon: Folder },
      { label: "Students", href: "/teacher/students", icon: Users },
      { label: "Supervision", href: "/teacher/supervision", icon: Monitor },
      { label: "Analytics", href: "/teacher/analytics", icon: BarChart3 },
      { label: "Messages", href: "/teacher/messages", icon: MessageSquare },
      { label: "Settings", href: "/teacher/settings", icon: Settings },
    ],
  },

  /* ─── Institution Admin ────────────────────────────────────────── */
  institution: {
    role: "institution",
    title: "Institution Dashboard",
    subtitle: "Manage programmes, courses, teachers, students, and learning materials.",
    primaryAction: { label: "Create Programme", href: "/institution/programmes/new" },
    searchPlaceholder: "Search students, teachers, courses, programmes...",
    settingsHref: "/institution/settings",
    roleLabel: "Institution Admin",
    sidebar: [
      { label: "Dashboard", href: "/institution/dashboard", icon: Home },
      { label: "Programmes", href: "/institution/programmes", icon: Layers },
      { label: "Courses", href: "/institution/courses", icon: BookOpen },
      { label: "Lesson Generation", href: "/institution/lesson-generation", icon: Sparkles },
      { label: "Classrooms / Sessions", href: "/institution/sessions", icon: Video },
      { label: "Resources", href: "/institution/resources", icon: Folder },
      { label: "Teachers", href: "/institution/teachers", icon: GraduationCap },
      { label: "Students", href: "/institution/students", icon: Users },
      { label: "Enrollments", href: "/institution/enrollments", icon: UserPlus },
      { label: "Progress", href: "/institution/analytics", icon: Activity },
      { label: "Activity", href: "/institution/activity", icon: Radio },
      { label: "Billing", href: "/institution/billing", icon: CreditCard },
      { label: "Settings", href: "/institution/settings", icon: Settings },
    ],
  },

  /* ─── Platform Admin ───────────────────────────────────────────── */
  platform_admin: {
    role: "platform_admin",
    title: "Platform Admin",
    subtitle: "Manage institutions, KingPin courses, AI settings, and platform health.",
    primaryAction: { label: "View Institutions", href: "/admin/institutions" },
    searchPlaceholder: "Search institutions, users, courses, jobs...",
    settingsHref: "/admin/settings",
    roleLabel: "Platform Admin",
    sidebar: [
      { label: "Dashboard", href: "/admin/dashboard", icon: Home },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Institutions", href: "/admin/institutions", icon: Building2 },
      { label: "KingPin Courses", href: "/admin/kingpin-courses", icon: School },
      { label: "Programmes", href: "/admin/programmes", icon: Layers },
      { label: "Courses", href: "/admin/courses", icon: BookOpen },
      { label: "Lessons", href: "/admin/lessons", icon: FileText },
      { label: "Materials", href: "/admin/materials", icon: Folder },
      { label: "Lesson Generation", href: "/admin/lesson-generation", icon: Sparkles },
      { label: "Realtime", href: "/admin/realtime", icon: Radio },
      { label: "AI Settings", href: "/admin/ai-settings", icon: Brain },
      { label: "Plans", href: "/admin/plans", icon: CreditCard },
      { label: "Usage", href: "/admin/usage", icon: BarChart3 },
      { label: "Support", href: "/admin/support", icon: LifeBuoy },
      { label: "Activity", href: "/admin/activity", icon: Activity },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
      { label: "System Health", href: "/admin/health", icon: Server },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },

  /* ─── Parent ───────────────────────────────────────────────────── */
  parent: {
    role: "parent",
    title: "Parent Dashboard",
    subtitle: "Monitor learner progress, sessions, reports, and feedback.",
    primaryAction: { label: "View Report", href: "/parent/reports" },
    searchPlaceholder: "Search reports, learners, sessions...",
    settingsHref: "/parent/settings",
    roleLabel: "Parent",
    sidebar: [
      { label: "Dashboard", href: "/parent/dashboard", icon: Home },
      { label: "Learners", href: "/parent/learners", icon: Users },
      { label: "Progress", href: "/parent/progress", icon: BarChart3 },
      { label: "Sessions", href: "/parent/sessions", icon: Video },
      { label: "Reports", href: "/parent/reports", icon: FileText },
      { label: "Messages", href: "/parent/messages", icon: MessageSquare },
      { label: "Settings", href: "/parent/settings", icon: Settings },
    ],
  },
};
