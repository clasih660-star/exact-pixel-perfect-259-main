import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  DoorOpen,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { dashboardConfigs } from "@/lib/dashboard-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  listClassroomRentals,
  fmtMoney,
} from "@/lib/payouts-rentals.functions";
import { requireClientAuthRoute } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/institution/rentals")({
  beforeLoad: () => requireClientAuthRoute(),
  component: InstitutionRentalsPage,
});

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  active: "bg-emerald-50 text-emerald-700",
  completed: "bg-slate-100 text-slate-500",
  cancelled: "bg-red-50 text-red-700",
};

function InstitutionRentalsPage() {
  const listFn = useServerFn(listClassroomRentals);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: ["rentals", statusFilter],
    queryFn: () =>
      listFn({ data: statusFilter ? { status: statusFilter } : {} }),
  });

  const rentals = query.data?.rentals ?? [];
  const filtered = search.trim()
    ? rentals.filter((r: any) => {
        const q = search.toLowerCase();
        const classroomName = r.virtual_classrooms?.name ?? "";
        return (
          classroomName.toLowerCase().includes(q) ||
          (r.rental_type ?? "").toLowerCase().includes(q)
        );
      })
    : rentals;

  // Stats
  const totalSpend = rentals
    .filter((r: any) => ["confirmed", "active", "completed"].includes(r.status))
    .reduce((sum: number, r: any) => sum + (r.amount_cents ?? 0), 0);
  const activeCount = rentals.filter((r: any) =>
    ["confirmed", "active"].includes(r.status),
  ).length;

  return (
    <DashboardShell
      config={dashboardConfigs.institution}
      activePath="/institution/rentals"
      title="Classroom Rentals"
      subtitle="Rent virtual classrooms by the hour, day, or month. Manage bookings and payments."
    >
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                <DoorOpen className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#61758A]">Active Bookings</p>
                <p className="text-xl font-black text-[#132033]">{activeCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF8F7]">
                <CheckCircle2 className="h-6 w-6 text-[#1F7C80]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#61758A]">Total Rental Spend</p>
                <p className="text-xl font-black text-[#132033]">
                  {fmtMoney(totalSpend)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("")}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                statusFilter === ""
                  ? "bg-[#1F7C80] text-white"
                  : "bg-white text-[#61758A] hover:bg-[#EAF8F7]"
              }`}
            >
              All
            </button>
            {["pending", "confirmed", "active", "completed", "cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize transition ${
                  statusFilter === s
                    ? "bg-[#1F7C80] text-white"
                    : "bg-white text-[#61758A] hover:bg-[#EAF8F7]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by classroom..."
              className="pl-9 w-64"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => query.refetch()}
            disabled={query.isFetching}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${query.isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Loading */}
        {query.isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#1F7C80]" />
          </div>
        )}

        {/* Empty */}
        {!query.isLoading && filtered.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF8F7]">
                <CalendarDays className="h-7 w-7 text-[#1F7C80]" />
              </div>
              <h3 className="text-lg font-black text-[#132033]">No rentals yet</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-[#61758A]">
                Rent a virtual classroom to host sessions. Choose from per-session, hourly, daily, or monthly plans.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Rentals table */}
        {!query.isLoading && filtered.length > 0 && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-left text-xs font-bold uppercase text-[#61758A]">
                      <th className="px-5 py-3">Classroom</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Window</th>
                      <th className="px-5 py-3">Amount</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Payment Ref</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((rental: any) => {
                      const vcName =
                        Array.isArray(rental.virtual_classrooms)
                          ? rental.virtual_classrooms[0]?.name
                          : rental.virtual_classrooms?.name ?? "Classroom";
                      return (
                        <tr key={rental.id} className="border-b border-[#F1F5F9] last:border-0">
                          <td className="px-5 py-4 font-bold text-[#132033]">{vcName}</td>
                          <td className="px-5 py-4 capitalize text-[#61758A]">
                            {rental.rental_type?.replace("_", " ")}
                          </td>
                          <td className="px-5 py-4 text-xs text-[#61758A]">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              {new Date(rental.start_at).toLocaleDateString()} →{" "}
                              {new Date(rental.end_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-5 py-4 font-bold text-[#132033]">
                            {fmtMoney(rental.amount_cents, rental.currency)}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                                STATUS_STYLES[rental.status] ?? "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {rental.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono text-xs text-[#94A3B8]">
                            {rental.paystack_reference ?? "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}