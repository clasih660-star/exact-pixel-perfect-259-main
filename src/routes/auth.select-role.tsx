import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/select-role")({
  component: () => <Navigate to="/auth/complete-profile" />,
});
