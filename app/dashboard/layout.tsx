import { ReactNode } from "react";
import AppHeader from "@/components/dashboard/header";
import OnlineStatus from "@/components/dashboard/online-status";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <OnlineStatus />
      <AppHeader />
      {children}
    </div>
  );
}
