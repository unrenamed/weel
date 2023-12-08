"use client";

import { useOnlineStatusToast } from "@/hooks";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  useOnlineStatusToast();
  return <div className="min-h-screen w-full bg-gray-50">{children}</div>;
}
