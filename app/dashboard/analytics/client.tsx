"use client";
import LinkStats from "@/components/dashboard/link/stats";
import { useLink } from "@/lib/swr/use-link";
import { useRouter } from "next/navigation";

export default function AnalyticsClient() {
  const router = useRouter();
  const { link, error } = useLink();

  if (error) {
    router.push("/404");
    return null;
  }

  return link ? <LinkStats link={link} /> : null;
}
