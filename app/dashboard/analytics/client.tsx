"use client";

import LinkStats from "@/components/dashboard/link/stats";
import { useLink } from "@/lib/swr/use-link";
import { notFound } from 'next/navigation';

export default function AnalyticsClient() {
  const { link, error } = useLink();

  if (error) {
    notFound();
  }

  return link ? <LinkStats link={link} /> : null;
}
