import { Skeleton } from "../ui/Skeleton";

/**
 * Institutional Route Loading State.
 * Prevents white flashes during route transitions by providing a 
 * mirrored layout of the Sovereign Dashboard.
 */
export function InstitutionalSkeleton() {
  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar Placeholder */}
      <div className="w-72 hidden lg:block border-r border-white/5 bg-black/40 p-8 space-y-6">
         <Skeleton height="40px" width="40px" className="rounded-xl" />
         <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} height="48px" className="rounded-2xl w-full" />
            ))}
         </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        {/* Header Placeholder */}
        <div className="h-20 border-b border-white/5 bg-black/20 px-10 flex items-center justify-between">
           <Skeleton height="24px" width="200px" />
           <Skeleton height="40px" width="120px" className="rounded-full" />
        </div>
        
        {/* Content Matrix Placeholder */}
        <main className="flex-1 p-10 space-y-12 max-w-7xl w-full mx-auto">
          <Skeleton height="12px" width="150px" className="mb-8" />
          
          <div className="space-y-4">
             <Skeleton height="48px" width="300px" />
             <Skeleton height="16px" width="500px" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
                <Skeleton height="200px" className="rounded-3xl w-full" />
                <div className="space-y-3">
                   <Skeleton height="20px" width="80%" />
                   <Skeleton height="12px" />
                   <Skeleton height="12px" width="60%" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
