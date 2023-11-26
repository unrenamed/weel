"use client";

import { useOnlineStatusToast } from "@/hooks/use-online-status-toast";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  useOnlineStatusToast();
  return <div>{children}</div>;
}
