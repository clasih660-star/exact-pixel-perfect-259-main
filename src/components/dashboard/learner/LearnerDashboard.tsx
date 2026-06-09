import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Activity, BookOpen, Flame, Monitor, Play, Clock, FileText, TrendingUp, Accessibility, CircleCheck as CheckCircle2 } from "lucide-react";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";

const config = dashboardConfigs.learner;

const classrooms = [
  {
    course: "Mathematics Form 2",
    institution: "Klassruum Demo Academy",
    lesson: "Quadratic Equations",
    step: "Worked Example",
    progress: 42,
    mode: "AI Teacher",
  },
  {
    course: "KCSE Chemistry Revision",
    institution: "Klassruum Demo Academy",
    lesson: "Chemical Reactions",
    step: "Guided Practice",
    progress: 28,
    mode: "Hybrid",
  },
  {
    course: "English Speaking Practice",
    institution: "Klassruum Demo Academy",
    lesson: "Daily Conversation",
    step: "Independent Work",
    progress: 65,
    mode: "Human Teacher",
  },
];

const recentSessions = [
  { title: "Quadratic Equations", course: "Mathematics Form 2", duration: "45 min", status: "Completed" },
  { title: "Chemical Reactions", course: "KCSE Chemistry Revision", duration: "38 min", status: "Completed" },
  { title: "HTML Introduction", course: "Computer Studies Basics", duration: "41 min", status: "Completed" },
];

export function LearnerDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <DashboardShell config={config} activePath="/student/dashboard">
        <div className="animate-pulse space-y-6">
          <div className="kr-continue-hero h-48 bg-gray-100" />
          <div className="kr-kpi-grid five">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="kr-kpi-card h-28 bg-gray-100" />
            ))}
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell config={config} activePath="/student/dashboard">
      {/* Header */}
      <section className="kr-dashboard-header">
        <div>
          <p className="kr-eyebrow">Welcome back</p>
          <h1>Continue your learning journey</h1>
          <p>Your next classroom is ready. Pick up from your last lesson and keep your progress moving.</p>
        </div>
        <Link to="/classroom/session_demo_math" className="kr-primary-button">
          <Monitor className="h-4 w-4" />
          Enter Classroom
        </Link>
      </section>

      {/* Continue Learning Hero */}
      <section className="kr-continue-hero">
        <div>
          <span className="kr-status-pill live">
            <Play className="h-3 w-3" />
            AI Teacher Ready
          </span>
          <h2>Introduction to Quadratic Equations</h2>
          <p>Mathematics Form 2 · Klassruum Demo Academy</p>

          <div className="kr-progress-block">
            <div>
              <span>Current Step</span>
              <strong>Step 3 of 8 · Worked Example</strong>
            </div>
            <div style={{ textAlign: "right" }}>
              <span>Progress</span>
              <strong style={{ fontSize: "24px", color: "var(--kr-primary)" }}>42%</strong>
            </div>
          </div>

          <div className="kr-progress-track">
            <div style={{ width: "42%" }} />
          </div>

          <div className="kr-meta-grid" style={{ marginTop: "12px" }}>
            <span>AI Teacher</span>
            <span>Captions On</span>
            <span>Voice On</span>
          </div>
        </div>

        <div className="kr-hero-actions">
          <Link to="/classroom/session_demo_math" className="kr-primary-button">
            <Monitor className="h-4 w-4" />
            Enter Classroom
          </Link>
          <Link to="/student/sessions/session_demo_math/summary" className="kr-secondary-button">
            <FileText className="h-4 w-4" />
            Review Summary
          </Link>
          <Link to="/student/quizzes/quiz_quadratic_001" className="kr-secondary-button">
            <Clock className="h-4 w-4" />
            Take Quick Quiz
          </Link>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="kr-kpi-grid five">
        <Link to="/student/classrooms" className="kr-kpi-card">
          <div className="kr-kpi-icon">
            <Monitor className="h-5 w-5" />
          </div>
          <div>
            <span className="kr-kpi-title">My Classrooms</span>
            <span className="kr-kpi-value">4</span>
            <span className="kr-kpi-subtitle">Active classrooms</span>
          </div>
        </Link>
        <Link to="/student/progress" className="kr-kpi-card">
          <div className="kr-kpi-icon">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="kr-kpi-title">Completed Lessons</span>
            <span className="kr-kpi-value">18</span>
            <span className="kr-kpi-subtitle">This month</span>
          </div>
        </Link>
        <Link to="/student/progress" className="kr-kpi-card">
          <div className="kr-kpi-icon">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <span className="kr-kpi-title">Study Time</span>
            <span className="kr-kpi-value">12h 45m</span>
            <span className="kr-kpi-subtitle">This week</span>
          </div>
        </Link>
        <Link to="/student/quizzes" className="kr-kpi-card">
          <div className="kr-kpi-icon">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="kr-kpi-title">Quiz Average</span>
            <span className="kr-kpi-value">86%</span>
            <span className="kr-kpi-subtitle">This month</span>
            <span className="kr-kpi-trend">+4%</span>
          </div>
        </Link>
        <Link to="/student/progress" className="kr-kpi-card">
          <div className="kr-kpi-icon">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <span className="kr-kpi-title">Current Streak</span>
            <span className="kr-kpi-value">7</span>
            <span className="kr-kpi-subtitle">Days in a row</span>
          </div>
        </Link>
      </section>

      {/* Main Grid */}
      <section className="kr-dashboard-grid">
        {/* My Classrooms */}
        <div className="kr-card large">
          <div className="kr-card-header">
            <div>
              <h2>My Classrooms</h2>
              <p>Enter your active learning spaces.</p>
            </div>
            <Link to="/student/classrooms">View all</Link>
          </div>

          <div className="kr-classroom-list">
            {classrooms.map((c) => (
              <article key={c.course} className="kr-classroom-row">
                <div className="kr-classroom-icon">{c.course.slice(0, 2)}</div>
                <div className="kr-classroom-main">
                  <h3>{c.course}</h3>
                  <p>
                    {c.institution} · {c.lesson}
                  </p>
                  <div className="kr-mini-progress" style={{ maxWidth: "200px" }}>
                    <div style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
                <span className="kr-status-pill">{c.mode}</span>
                <Link to="/classroom/session_demo_math" className="kr-secondary-button">
                  Enter
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* Learning Plan */}
        <div className="kr-card">
          <h2>Today's Learning Plan</h2>
          <p>Recommended for you.</p>

          <ol className="kr-plan-list">
            {[
              "Continue Quadratic Equations lesson",
              "Complete the quick quiz (5 min)",
              "Review weak topic: Factoring",
            ].map((item, i) => (
              <li key={i}>
                <span
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "var(--kr-primary)",
                    color: "white",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>

          <div className="kr-button-row">
            <Link to="/classroom/session_demo_math" className="kr-primary-button">
              Start Plan
            </Link>
            <Link to="/student/learning-plan" className="kr-secondary-button">
              Customize
            </Link>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="kr-card">
          <h2>Recent Sessions</h2>
          <p>Review what you learned.</p>

          <div className="kr-activity-list">
            {recentSessions.map((s) => (
              <Link
                key={s.title}
                to="/student/sessions/session_demo_math/summary"
                className="kr-activity-item"
              >
                <div>
                  <strong>{s.title}</strong>
                  <span>
                    {s.course} · {s.duration}
                  </span>
                </div>
                <span className="kr-status-pill">{s.status}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Learning Access */}
        <div className="kr-card access">
          <h2>Learning Access</h2>
          <p>Standard profile</p>

          <div className="kr-access-list">
            {[
              { label: "Teacher voice", value: "On" },
              { label: "Captions", value: "On" },
              { label: "Keyboard shortcuts", value: "On" },
              { label: "Focus mode", value: "Off" },
            ].map((item) => (
              <span
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {item.label}
                <strong
                  style={{
                    color: item.value === "On" ? "var(--kr-success)" : "var(--kr-muted)",
                    fontSize: "12px",
                  }}
                >
                  {item.value}
                </strong>
              </span>
            ))}
          </div>

          <div className="kr-button-row">
            <Link to="/student/access" className="kr-primary-button">
              Adjust Access
            </Link>
            <button className="kr-secondary-button">
              <TrendingUp className="h-4 w-4" />
              Focus Mode
            </button>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}

export default LearnerDashboard;
