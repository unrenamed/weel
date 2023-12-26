import { cn } from "@/components/utils";
import { useScroll } from "@/hooks";
import { Link } from "@prisma/client";
import { useState } from "react";
import Header from "./header";
import Clicks from "./clicks";
import Locations from "./locations";
import Devices from "./devices";
import Referrers from "./referrers";

type Params = {
  link: Link;
};

export default function LinkStats({ link }: Params) {
  const [scrolled, setIsScrolled] = useState(false);
  useScroll(({ scrollY }) => setIsScrolled(scrollY > 0));

  return (
    <div className="w-full grid grid-cols-1 place-content-center">
      <div
        className={cn(
          "sticky md:py-5 py-3 top-[4rem] bg-bkg z-20",
          {
            "shadow-md": scrolled,
          }
        )}
      >
        <div className="w-full 2xl:w-3/5 xl:w-4/5 mx-auto px-3">
          <Header title={`${link.domain}/${link.key}`} />
        </div>
      </div>
      <div className="w-full 2xl:w-3/5 xl:w-4/5 mx-auto p-3 flex flex-col gap-3 sm:gap-5">
        <Clicks />
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 sm:gap-5">
          <Locations />
          <Devices />
          <Referrers />
        </div>
      </div>
    </div>
  );
}
