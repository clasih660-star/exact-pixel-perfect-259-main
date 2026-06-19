import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Eye, Gauge, Play, Users, Video } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { DashboardLoadingState } from "@/components/dashboard/shared/DashboardLoadingState";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";
import { type DashboardConfig } from "@/lib/dashboard-config";
import { useDashboardConfig } from "@/hooks/useDashboardConfig";

function getTeacherDashboardCopy(role: DashboardConfig["role"]) {
  switch (role) {
    case "private_teacher":
      return {
        headerLabel: "Private teaching workspace",
        headerTitle: "Run your independent teaching business",
        headerSubtitle:
          "Track verification, manage your own courses, and support private learners across live and AI-assisted sessions.",
        alertTitle: "Verification and lesson items need your attention",
        alertDescription:
          "Complete your profile checks and review pending lesson updates before your next private teaching session.",
        courseSectionTitle: "My private courses",
        courseSectionSubtitle: "Courses you own and deliver",
        scheduleTitle: "Upcoming private sessions",
      };
    case "kingpin_teacher":
      return {
        headerLabel: "KingPin teaching workspace",
        headerTitle: "Deliver official KingPin learning experiences",
        headerSubtitle:
          "Manage assigned delivery queues, refine official lessons, and maintain quality across learner groups.",
        alertTitle: "2 official lessons need your review",
        alertDescription:
          "Chemical Bonding and HTML Forms lessons have pending quality and caption updates before release.",
        courseSectionTitle: "KingPin course assignments",
        courseSectionSubtitle: "Official courses you are assigned to deliver",
        scheduleTitle: "Delivery queue",
      };
    case "institution_teacher":
      return {
        headerLabel: "Institution teaching workspace",
        headerTitle: "Prepare, teach, and support assigned classes",
        headerSubtitle:
          "Manage your institution courses, review lessons, and monitor learner progress across assigned classes.",
        alertTitle: "2 lessons need your review",
        alertDescription:
          "Chemical Bonding and HTML Forms lessons have pending caption and quiz updates.",
        courseSectionTitle: "Assigned courses",
        courseSectionSubtitle: "Courses you are responsible for",
        scheduleTitle: "Today's schedule",
      };
    default:
      return {
        headerLabel: "Teaching workspace",
        headerTitle: "Prepare, teach, and support learners",
        headerSubtitle:
          "Manage your courses, review lessons, and monitor student progress across all assigned classes.",
        alertTitle: "2 lessons need your review",
        alertDescription:
          "Chemical Bonding and HTML Forms lessons have pending caption and quiz updates.",
        courseSectionTitle: "My courses",
        courseSectionSubtitle: "Courses you are responsible for",
        scheduleTitle: "Today's schedule",
      };
  }
}

const mockUpcomingSession = {
  title: "Solving Quadratic Equations by Factoring",
  course: "Mathematics Form 2",
  time: "Today at 10:30 AM",
  mode: "AI-Assisted",
  expectedStudents: 32,
};

const mockCourses = [
  {
    title: "Mathematics Form 2",
    institution: "Klassruum Demo Academy",
    stats: [
      { label: "Students", value: "32" },
      { label: "Lessons", value: "12/28" },
    ],
    progress: 65,
    href: "/teacher/courses",
  },
  {
    title: "Science Form 3",
    institution: "Klassruum Demo Academy",
    stats: [
      { label: "Students", value: "45" },
      { label: "Lessons", value: "18/24" },
    ],
    progress: 42,
    href: "/teacher/courses",
  },
  {
    title: "English Form 2",
    institution: "Klassruum Demo Academy",
    stats: [
      { label: "Students", value: "28" },
      { label: "Lessons", value: "9/15" },
    ],
    progress: 78,
    href: "/teacher/courses",
  },
];

const mockUpcomingSessions = [
  {
    title: "Quadratic Equations",
    course: "Mathematics Form 2",
    time: "Today at 10:30 AM",
    participantCount: 32,
    href: "/teacher/sessions",
  },
  {
    title: "Chemical Bonding",
    course: "Science Form 3",
    time: "Today at 2:00 PM",
    participantCount: 45,
    href: "/teacher/sessions",
  },
  {
    title: "Parts of Speech",
    course: "English Form 2",
    time: "Tomorrow at 9:00 AM",
    participantCount: 28,
    href: "/teacher/sessions",
  },
];

const mockLessonReview = [
  {
    title: "Quadratic Equations",
    course: "Mathematics Form 2",
    description: "Ready for teaching",
    href: "/teacher/lessons",
  },
  {
    title: "Chemical Bonding",
    course: "Science Form 3",
    description: "Ready for teaching",
    href: "/teacher/lessons",
  },
  {
    title: "Parts of Speech",
    course: "English Form 2",
    description: "Ready for teaching",
    href: "/teacher/lessons",
  },
];

const mockActivity = [
  {
    id: "1",
    action: "Lesson published",
    description: "Quadratic Equations lesson is live",
    timestamp: "Today at 9:30 AM",
  },
  {
    id: "2",
    action: "Student question",
    description: "3 students asked for help with factoring",
    timestamp: "Today at 8:45 AM",
  },
  {
    id: "3",
    action: "Session completed",
    description: "32 students completed Chemical Reactions lesson",
    timestamp: "Yesterday at 4:15 PM",
  },
  {
    id: "4",
    action: "Quiz graded",
    description: "Reviewed 45 quiz submissions from Math Form 2",
    timestamp: "Yesterday at 3:00 PM",
  },
];

const teacherMetrics = [
  {
    label: "Assigned courses",
    value: "3",
    meta: "Active courses",
    href: "/teacher/courses",
    icon: BookOpen,
  },
  {
    label: "Total students",
    value: "105",
    meta: "Across all courses",
    href: "/teacher/students",
    icon: Users,
  },
  {
    label: "Lessons ready",
    value: "12",
    meta: "Approved lessons",
    href: "/teacher/lessons",
    icon: CheckCircle2,
  },
  {
    label: "Pending review",
    value: "2",
    meta: "Needs your action",
    href: "/teacher/lessons",
    icon: Eye,
  },
  {
    label: "Sessions today",
    value: "3",
    meta: "Teaching sessions",
    href: "/teacher/sessions",
    icon: Video,
  },
];

export default function TeacherDashboard() {
  const config = useDashboardConfig();
  const copy = getTeacherDashboardCopy(config.role);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsLoading(false);
      } catch {
        setError("Failed to load dashboard data");
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <DashboardShell config={config} activePath="/teacher/dashboard">
        <DashboardLoadingState type="skeleton" />
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell config={config} activePath="/teacher/dashboard">
        <DashboardLoadingState type="error" message={error} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell config={config} activePath="/teacher/dashboard">
      <div className="kr-teacher-flow">
        <section className="kr-teacher-hero kr-reveal">
          <div className="kr-hero-copy">
            <p className="kr-section-kicker">{copy.headerLabel}</p>
            <h1>{copy.headerTitle}</h1>
            <p>{copy.headerSubtitle}</p>
          </div>

          <div className="kr-session-stage" aria-label="Next teaching session">
            <div className="kr-session-orbit" aria-hidden="true" />
            <div className="kr-session-main">
              <div className="kr-session-label">
                <span className="kr-live-dot" />
                Next session
              </div>
              <h2>{mockUpcomingSession.title}</h2>
              <p>
                {mockUpcomingSession.course} - {mockUpcomingSession.time}
              </p>
            </div>
            <dl className="kr-session-facts">
              <div>
                <dt>Mode</dt>
                <dd>{mockUpcomingSession.mode}</dd>
              </div>
              <div>
                <dt>Students</dt>
                <dd>{mockUpcomingSession.expectedStudents}</dd>
              </div>
              <div>
                <dt>Access</dt>
                <dd>Captions on</dd>
              </div>
            </dl>
            <div className="kr-action-row">
              <Link to="/teacher/sessions" className="kr-command-button kr-command-button--primary">
                <Play className="h-4 w-4" />
                Open teaching sessions
              </Link>
              <Link to="/teacher/lessons" className="kr-command-button">
                Review lessons
              </Link>
              <Link to="/teacher/students" className="kr-command-button">
                Students
              </Link>
            </div>
          </div>
        </section>

        <section className="kr-attention-rail kr-reveal" aria-label="Needs attention">
          <div>
            <span>Attention</span>
            <strong>{copy.alertTitle}</strong>
            <p>{copy.alertDescription}</p>
          </div>
          <Link to="/teacher/lessons">
            Review queue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="kr-metric-strip kr-reveal" aria-label="Teaching metrics">
          {teacherMetrics.map((metric) => (
            <Link key={metric.label} to={metric.href} className="kr-metric-item">
              <metric.icon className="h-4 w-4" />
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.meta}</small>
            </Link>
          ))}
        </section>

        <section className="kr-open-grid">
          <div className="kr-open-column kr-open-column--wide">
            <div className="kr-section-heading kr-reveal">
              <div>
                <p className="kr-section-kicker">Courses</p>
                <h2>{copy.courseSectionTitle}</h2>
                <span>{copy.courseSectionSubtitle}</span>
              </div>
              <Link to="/teacher/courses">View all</Link>
            </div>

            <div className="kr-course-ledger kr-reveal">
              {mockCourses.map((course) => (
                <Link key={course.title} to={course.href} className="kr-ledger-row">
                  <div className="kr-ledger-title">
                    <BookOpen className="h-4 w-4" />
                    <div>
                      <strong>{course.title}</strong>
                      <span>{course.institution}</span>
                    </div>
                  </div>
                  <div className="kr-ledger-stats">
                    {course.stats.map((stat) => (
                      <span key={stat.label}>
                        <small>{stat.label}</small>
                        {stat.value}
                      </span>
                    ))}
                  </div>
                  <div className="kr-progress-line" aria-label={`${course.progress}% complete`}>
                    <span style={{ width: `${course.progress}%` }} />
                  </div>
                  <ArrowRight className="kr-row-arrow h-4 w-4" />
                </Link>
              ))}
            </div>

            <div className="kr-section-heading kr-reveal">
              <div>
                <p className="kr-section-kicker">Quality</p>
                <h2>Lesson review queue</h2>
                <span>Lessons awaiting your approval</span>
              </div>
              <Link to="/teacher/lessons">View all</Link>
            </div>

            <div className="kr-review-list kr-reveal">
              {mockLessonReview.map((lesson) => (
                <Link key={lesson.title} to={lesson.href} className="kr-review-row">
                  <div>
                    <strong>{lesson.title}</strong>
                    <span>{lesson.course}</span>
                  </div>
                  <StatusBadge variant="success">Ready</StatusBadge>
                  <small>{lesson.description}</small>
                  <Eye className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <aside className="kr-open-column">
            <div className="kr-section-heading kr-reveal">
              <div>
                <p className="kr-section-kicker">Schedule</p>
                <h2>{copy.scheduleTitle}</h2>
              </div>
              <Link to="/teacher/sessions">View all</Link>
            </div>

            <div className="kr-timeline kr-reveal">
              {mockUpcomingSessions.map((session) => (
                <Link key={session.title} to={session.href} className="kr-timeline-row">
                  <span className="kr-timeline-pin" />
                  <div>
                    <small>{session.time}</small>
                    <strong>{session.title}</strong>
                    <span>{session.course}</span>
                  </div>
                  <em>{session.participantCount}</em>
                </Link>
              ))}
            </div>

            <div className="kr-live-panel kr-reveal">
              <div>
                <span className="kr-section-kicker">Live now</span>
                <strong>87</strong>
                <p>Students online in your courses</p>
              </div>
              <div className="kr-live-gauge">
                <Gauge className="h-5 w-5" />
                <span>+12 this hour</span>
              </div>
            </div>

            <div className="kr-activity-stream kr-reveal">
              <div className="kr-section-heading">
                <div>
                  <p className="kr-section-kicker">Activity</p>
                  <h2>Recent movement</h2>
                </div>
              </div>
              {mockActivity.slice(0, 4).map((item) => (
                <div key={item.id} className="kr-activity-row">
                  <CheckCircle2 className="h-4 w-4" />
                  <div>
                    <strong>{item.action}</strong>
                    <span>{item.description}</span>
                    <small>{item.timestamp}</small>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </DashboardShell>
  );
}
