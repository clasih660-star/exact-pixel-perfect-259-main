import { createFileRoute } from "@tanstack/react-router";
import InstitutionDashboard from "@/components/dashboard/institution/InstitutionDashboard";

export const Route = createFileRoute("/_authenticated/institution/dashboard")({
  component: InstitutionDashboard,
});
