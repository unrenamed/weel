export default function LinkSkeleton() {
  return (
    <div className="flex justify-between items-center rounded-lg bg-content p-3 shadow transition-all hover:shadow-md sm:p-4">
      <div className="flex items-center ">
        <div className="h-10 w-10 animate-pulse rounded-full bg-skeleton" />
        <div className="ml-3">
          <div className="mb-3 flex items-center space-x-1">
            <div className="h-5 w-28 animate-pulse rounded-md bg-skeleton" />
            <div className="h-5 w-5 animate-pulse rounded-full bg-skeleton" />
            <div className="h-5 w-5 animate-pulse rounded-full bg-skeleton" />
          </div>
          <div className="h-4 w-full animate-pulse rounded-md bg-skeleton" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="h-5 w-20 animate-pulse rounded-md bg-skeleton" />
        <div className="h-5 w-5 animate-pulse rounded-md bg-skeleton" />
      </div>
    </div>
  );
}
