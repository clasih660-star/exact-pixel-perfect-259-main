import { Link } from "@tanstack/react-router";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { KpiCard } from "@/components/dashboard/shared/KpiCard";
import { 
  Building2, 
  Users, 
  Activity, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export function PlatformAdminDashboard() {
  const config = dashboardConfigs.platform_admin;

  return (
    <DashboardShell config={config} activePath="/admin/platform">
      {/* Dashboard Header */}
      <section className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
            Platform Overview
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--gray-900)]">
          Platform Administration
        </h1>
        <p className="mt-2 text-sm text-[var(--gray-500)]">
          Manage institutions, monitor platform health, and oversee system operations
        </p>
      </section>

      {/* Platform KPI Cards */}
      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          title="Institutions"
          value="1,247"
          subtitle="Active organizations"
          href="/admin/institutions"
          icon={Building2}
          trend="+12%"
        />
        <KpiCard
          title="Total Users"
          value="89,432"
          subtitle="Across all roles"
          href="/admin/users"
          icon={Users}
          trend="+8%"
        />
        <KpiCard
          title="Active Sessions"
          value="1,847"
          subtitle="Live classrooms"
          href="/admin/usage"
          icon={Activity}
          trend="+23%"
        />
        <KpiCard
          title="Monthly Revenue"
          value="$247,892"
          subtitle="Subscription income"
          href="/admin/plans"
          icon={CreditCard}
          trend="+15%"
        />
        <KpiCard
          title="Platform Health"
          value="99.9%"
          subtitle="Uptime this month"
          href="/admin/health"
          icon={CheckCircle2}
        />
        <KpiCard
          title="Support Tickets"
          value="23"
          subtitle="Open issues"
          href="/admin/support"
          icon={AlertTriangle}
        />
      </section>

      {/* Dashboard Grid */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Institution Growth Chart */}
        <div className="dashboard-card col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[var(--gray-900)]">Institution Growth</h2>
              <p className="text-sm text-[var(--gray-500)]">New institutions over time</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                <TrendingUp className="h-4 w-4" />
                +18% vs last month
              </span>
            </div>
          </div>
          
          {/* Mock Chart */}
          <div className="h-64 rounded-lg bg-gradient-to-br from-[var(--gray-50)] to-white p-4">
            <div className="flex h-full items-end justify-between gap-2">
              {[45, 62, 55, 78, 82, 91, 85, 95, 88, 102, 97, 110].map((value, index) => (
                <div 
                  key={index} 
                  className="w-full rounded-t bg-[var(--primary)] opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-[var(--gray-400)]">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>

        {/* System Health Status */}
        <div className="dashboard-card">
          <h2 className="text-xl font-bold text-[var(--gray-900)]">System Health</h2>
          <p className="mb-4 text-sm text-[var(--gray-500)]">Platform performance metrics</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--gray-900)]">API Services</p>
                  <p className="text-xs text-[var(--gray-500)]">All systems operational</p>
                </div>
              </div>
              <span className="text-xs font-medium text-green-600">99.9%</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--gray-900)]">Database</p>
                  <p className="text-xs text-[var(--gray-500)]">Healthy connection</p>
                </div>
              </div>
              <span className="text-xs font-medium text-green-600">99.8%</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--gray-900)]">Video Services</p>
                  <p className="text-xs text-[var(--gray-500)]">High load detected</p>
                </div>
              </div>
              <span className="text-xs font-medium text-yellow-600">98.5%</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--gray-900)]">Storage</p>
                  <p className="text-xs text-[var(--gray-500)]">42% capacity used</p>
                </div>
              </div>
              <span className="text-xs font-medium text-green-600">OK</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card">
          <h2 className="text-xl font-bold text-[var(--gray-900)]">Recent Activity</h2>
          <p className="mb-4 text-sm text-[var(--gray-500)]">Latest platform events</p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                <Building2 className="h-3 w-3 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--gray-900)]">New institution registered</p>
                <p className="text-xs text-[var(--gray-500)]">St. Mary's High School · 2 min ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                <CreditCard className="h-3 w-3 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--gray-900)]">Plan upgrade completed</p>
                <p className="text-xs text-[var(--gray-500)]">Klassruum Demo Academy · 15 min ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100">
                <Users className="h-3 w-3 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--gray-900)]">Bulk user import</p>
                <p className="text-xs text-[var(--gray-500)]">1,247 students imported · 1 hour ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-3 w-3 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--gray-900)]">Payment failed</p>
                <p className="text-xs text-[var(--gray-500)]">Nairobi International School · 3 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Tickets */}
        <div className="dashboard-card">
          <h2 className="text-xl font-bold text-[var(--gray-900)]">Support Tickets</h2>
          <p className="mb-4 text-sm text-[var(--gray-500)]">Active support requests</p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-3 w-3 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--gray-900)]">Critical: Video lagging</p>
                  <span className="text-xs font-medium text-red-600">High</span>
                </div>
                <p className="text-xs text-[var(--gray-500)]">Technical Issue · 45 min ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100">
                <AlertTriangle className="h-3 w-3 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--gray-900)]">Feature request</p>
                  <span className="text-xs font-medium text-yellow-600">Medium</span>
                </div>
                <p className="text-xs text-[var(--gray-500)]">Enhancement · 2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[var(--gray-100)] bg-[var(--gray-50)] p-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                <AlertTriangle className="h-3 w-3 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--gray-900)]">Billing inquiry</p>
                  <span className="text-xs font-medium text-blue-600">Low</span>
                </div>
                <p className="text-xs text-[var(--gray-500)]">Question · 5 hours ago</p>
              </div>
            </div>
          </div>

          <Link
            to="/admin/support"
            className="mt-4 block w-full rounded-lg border border-[var(--gray-200)] bg-white px-4 py-2 text-center text-sm font-medium text-[var(--primary)] hover:bg-[var(--gray-50)]"
          >
            View All Tickets
          </Link>
        </div>

        {/* Usage Overview */}
        <div className="dashboard-card">
          <h2 className="text-xl font-bold text-[var(--gray-900)]">Usage Overview</h2>
          <p className="mb-4 text-sm text-[var(--gray-500)]">Platform resource consumption</p>

          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--gray-900)]">Storage Usage</span>
                <span className="text-xs text-[var(--gray-500)]">42% of 2TB</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--gray-200)]">
                <div className="h-2 rounded-full bg-[var(--primary)]" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--gray-900)]">Video Bandwidth</span>
                <span className="text-xs text-[var(--gray-500)]">78% of 10TB</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--gray-200)]">
                <div className="h-2 rounded-full bg-[var(--warning)]" style={{ width: '78%' }} />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--gray-900)]">API Calls</span>
                <span className="text-xs text-[var(--gray-500)]">65% of limit</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--gray-200)]">
                <div className="h-2 rounded-full bg-[var(--success)]" style={{ width: '65%' }} />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--gray-900)]">Active Sessions</span>
                <span className="text-xs text-[var(--gray-500)]">1,847 concurrent</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--gray-200)]">
                <div className="h-2 rounded-full bg-[var(--primary)]" style={{ width: '37%' }} />
              </div>
            </div>
          </div>

          <Link
            to="/admin/usage"
            className="mt-4 block w-full rounded-lg border border-[var(--gray-200)] bg-white px-4 py-2 text-center text-sm font-medium text-[var(--primary)] hover:bg-[var(--gray-50)]"
          >
            View Detailed Usage
          </Link>
        </div>
      </section>

      {/* Primary Actions */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          to="/admin/institutions"
          className="flex items-center gap-3 rounded-xl border border-[var(--gray-200)] bg-white p-4 hover:border-[var(--primary)] hover:bg-[var(--primary-light)] transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-[var(--gray-900)]">Manage Institutions</p>
            <p className="text-xs text-[var(--gray-500)]">View and edit organizations</p>
          </div>
          <ArrowUpRight className="ml-auto h-4 w-4 text-[var(--gray-400)]" />
        </Link>

        <Link
          to="/admin/users"
          className="flex items-center gap-3 rounded-xl border border-[var(--gray-200)] bg-white p-4 hover:border-[var(--primary)] hover:bg-[var(--primary-light)] transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-[var(--gray-900)]">View Users</p>
            <p className="text-xs text-[var(--gray-500)]">Manage platform users</p>
          </div>
          <ArrowUpRight className="ml-auto h-4 w-4 text-[var(--gray-400)]" />
        </Link>

        <Link
          to="/admin/plans"
          className="flex items-center gap-3 rounded-xl border border-[var(--gray-200)] bg-white p-4 hover:border-[var(--primary)] hover:bg-[var(--primary-light)] transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-[var(--gray-900)]">Manage Plans</p>
            <p className="text-xs text-[var(--gray-500)]">Subscription tiers</p>
          </div>
          <ArrowUpRight className="ml-auto h-4 w-4 text-[var(--gray-400)]" />
        </Link>

        <Link
          to="/admin/health"
          className="flex items-center gap-3 rounded-xl border border-[var(--gray-200)] bg-white p-4 hover:border-[var(--primary)] hover:bg-[var(--primary-light)] transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-[var(--gray-900)]">System Health</p>
            <p className="text-xs text-[var(--gray-500)]">Monitor performance</p>
          </div>
          <ArrowUpRight className="ml-auto h-4 w-4 text-[var(--gray-400)]" />
        </Link>
      </section>
    </DashboardShell>
  );
}