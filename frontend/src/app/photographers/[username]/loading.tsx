import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header section skeleton */}
          <div className="p-6 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-gray-200">
            <Skeleton className="h-32 w-32 rounded-full shrink-0" />
            
            <div className="flex-1 text-center sm:text-left space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64 mx-auto sm:mx-0" />
                <Skeleton className="h-5 w-32 mx-auto sm:mx-0" />
              </div>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                <div className="flex items-center">
                  <Skeleton className="h-5 w-5 mr-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-5 w-5 mr-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-3 min-w-[200px]">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 sm:p-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>

              <div>
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-48 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i}>
                      <div className="flex items-center mb-1">
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
