export default function NoData({ search }: { search: string }) {
  return (
    <div className="px-7 pb-5 w-full h-full flex place-content-center justify-center items-center">
      <p className="flex items-center justify-center flex-wrap text-sm font-light text-gray-500 dark:text-gray-100">
        {search.length > 0 ? (
          <>
            No results found for&nbsp;
            <span className="flex items-center">
              &quot;
              <span className="block max-w-[130px] font-semibold truncate">
                {search}
              </span>
              &quot;
            </span>
            &nbsp; search criteria
          </>
        ) : (
          <>No data available</>
        )}
      </p>
    </div>
  );
}
