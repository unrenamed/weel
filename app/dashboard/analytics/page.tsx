import AnalyticsClient from "./client";
import type { Metadata } from "next";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const domain = searchParams["domain"] ?? "";
  const key = searchParams["key"] ?? "";

  const title =
    domain.length > 0 && key.length > 0
      ? `${domain}/${key} analytics`
      : "Short Link Analytics";

  return {
    title,
    description:
      "Explore comprehensive analytics for your short link. Instantly track performance metrics, clicks, and engagement. Empower your link strategy with real-time insights.",
  };
}

export default function AnalyticsPage() {
  return (
    <section className="relative">
      <AnalyticsClient />
    </section>
  );
}
