'use client'

import LinkStats from "@/components/dashboard/link/stats";
import { useLink } from "@/lib/swr/use-link";
import { useRouter } from "next/navigation";

export default function LinkPage() {
  const router = useRouter();
  const { link, error } = useLink();

  if (error) {
    router.push("/404");
    return null;
  }

  return (
    <section className="flex place-content-center">
      <div className="w-full xl:w-1/2 md:w-3/4 mt-10">
        {link && <LinkStats link={link} />}
      </div>
    </section>
  );
}
