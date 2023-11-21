import AnalyticsClient from "./client";

export default function AnalyticsPage() {
  return (
    <section className="flex place-content-center">
      <div className="w-full xl:w-1/2 md:w-3/4 mt-10">
        <AnalyticsClient />
      </div>
    </section>
  );
}
