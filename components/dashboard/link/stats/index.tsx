import { classNames } from "@/components/utils";
import { useScroll } from "@/hooks";
import { Link } from "@prisma/client";
import { useState } from "react";
import Header from "./header";
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
    <div className="w-full grid grid-cols-1 place-content-center py-3">
      <div
        className={classNames("sticky md:py-5 py-3 top-0 bg-gray-50 z-20", {
          "shadow-md": scrolled,
        })}
      >
        <div className="w-full max-w-4xl mx-auto px-3">
          <Header title={`${link.domain}/${link.key}`} />
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto p-3">
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
          <Locations />
          <Devices />
          <Referrers />
        </div>
      </div>
    </div>
  );
}
