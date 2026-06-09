import {
  Accessibility,
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  Calendar,
  Clipboard,
  CreditCard,
  FileText,
  Folder,
  GraduationCap,
  Home,
  LifeBuoy,
  MessageSquare,
  Monitor,
  Notebook,
  Search,
  Server,
  Settings,
  type LucideIcon,
  UserPlus,
  Users,
  Video,
} from "lucide-react";

export type DashboardRole =
  | "learner"
  | "teacher"
  | "institution"
  | "platform_admin"
  | "parent";

export type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
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
  searchPlaceholder: string;
  settingsHref: string;
  roleLabel: string;
};

export const dashboardConfigs: Record<DashboardRole, DashboardConfig> = {
  learner: {
    role: "learner",
    title: "Learner Dashboard",
    subtitle: "Continue learning, enter classrooms, and track your progress.",
    primaryAction: { label: "Enter Classroom", href: "/classroom/session_demo_math" },
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
      { label: "Assignments", href: "/student/assignments", icon: Clipboard },
      { label: "Quizzes", href: "/student/quizzes", icon: BarChart3 },
      { label: "Progress", href: "/student/progress", icon: Activity },
      { label: "Messages", href: "/student/messages", icon: MessageSquare },
      { label: "Notes", href: "/student/notes", icon: Notebook },
      { label: "Learning Access", href: "/student/access", icon: Accessibility },
      { label: "Search", href: "/student/search", icon: Search },
      { label: "Notifications", href: "/student/notifications", icon: Bell },
      { label: "Settings", href: "/student/settings", icon: Settings },
    ],
  },

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
      { label: "Analytics", href: "/teacher/analytics", icon: BarChart3 },
      { label: "Messages", href: "/teacher/messages", icon: MessageSquare },
      { label: "Settings", href: "/teacher/settings", icon: Settings },
    ],
  },

  institution: {
    role: "institution",
    title: "Institution Dashboard",
    subtitle: "Manage courses, teachers, students, sessions, and resources.",
    primaryAction: { label: "Create Course", href: "/institution/courses/new" },
    searchPlaceholder: "Search students, teachers, courses...",
    settingsHref: "/institution/settings",
    roleLabel: "Institution Admin",
    sidebar: [
      { label: "Dashboard", href: "/institution/dashboard", icon: Home },
      { label: "Courses", href: "/institution/courses", icon: BookOpen },
      { label: "Classrooms / Sessions", href: "/institution/sessions", icon: Video },
      { label: "Resources", href: "/institution/resources", icon: Folder },
      { label: "Students", href: "/institution/students", icon: Users },
      { label: "Teachers", href: "/institution/teachers", icon: GraduationCap },
      { label: "Enrollments", href: "/institution/enrollments", icon: UserPlus },
      { label: "Analytics", href: "/institution/analytics", icon: BarChart3 },
      { label: "Billing", href: "/institution/billing", icon: CreditCard },
      { label: "Settings", href: "/institution/settings", icon: Settings },
    ],
  },

  platform_admin: {
    role: "platform_admin",
    title: "Platform Admin",
    subtitle: "Manage institutions, plans, usage, and platform health.",
    primaryAction: { label: "View Institutions", href: "/admin/institutions" },
    searchPlaceholder: "Search institutions, users, plans...",
    settingsHref: "/admin/settings",
    roleLabel: "Platform Admin",
    sidebar: [
      { label: "Dashboard", href: "/admin/platform", icon: Home },
      { label: "Institutions", href: "/admin/institutions", icon: Building2 },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Plans", href: "/admin/plans", icon: CreditCard },
      { label: "Usage", href: "/admin/usage", icon: Activity },
      { label: "Support", href: "/admin/support", icon: LifeBuoy },
      { label: "System Health", href: "/admin/health", icon: Server },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },

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
