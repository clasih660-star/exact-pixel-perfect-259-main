import type { ReactNode } from "react";
import { Outlet } from "@tanstack/react-router";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  children?: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="dashboard-content">{children || <Outlet />}</main>
      </div>
    </div>
  );
}
