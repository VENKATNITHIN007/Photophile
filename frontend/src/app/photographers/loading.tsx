import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full max-w-md hidden sm:block" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Skeletons */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="space-y-5">
                {[1, 2, 3].map(i => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Skeletons */}
          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm h-full flex flex-col">
                  <div className="p-5 flex flex-col items-center border-b border-gray-100">
                    <Skeleton className="h-20 w-20 rounded-full mb-3" />
                    <Skeleton className="h-6 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center mb-3">
                      <Skeleton className="h-4 w-4 mr-2" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4 flex-1" />
                    
                    <div className="mt-auto">
                      <div className="flex gap-2 mb-3">
                        <Skeleton className="h-5 w-16 rounded" />
                        <Skeleton className="h-5 w-16 rounded" />
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}