import OnlineStatus from "@/components/dashboard/online-status";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <OnlineStatus />
      {children}
    </div>
  );
}
