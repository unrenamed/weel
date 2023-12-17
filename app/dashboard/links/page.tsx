import LinksContainer from "@/components/dashboard/links/container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Short Links",
  description:
    "Effortlessly manage your short links with our user-friendly platform. View, create, delete, and take control of your links for a seamless experience.",
};

export default function LinksPage() {
  return (
    <section className="relative flex place-content-center">
      <div className="w-full 2xl:w-3/5 xl:w-4/5 px-4 py-3 sm:px-3 sm:py-5 flex flex-col gap-3 sm:gap-5">
        <h1 className="text-2xl text-gray-800">My Links</h1>
        <LinksContainer />
      </div>
    </section>
  );
}
