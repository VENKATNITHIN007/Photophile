export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12 animate-pulse">
        {/* Profile Header Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="shrink-0 w-[150px] h-[150px] rounded-full bg-gray-200" />
          
          <div className="flex-1 w-full space-y-4">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto md:mx-0" />
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto md:mx-0" />
            </div>
            
            <div className="flex gap-4 justify-center md:justify-start">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>

            <div className="space-y-2 max-w-2xl">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
          </div>

          <div className="shrink-0 w-32 h-12 bg-gray-200 rounded-md self-center md:self-start" />
        </div>

        {/* Portfolio Skeleton */}
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-32" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
