import { Skeleton } from "../ui/Skeleton";

/**
 * Institutional Route Loading State (v2.0 - One Page Terminal)
 * Prevents navigation flashes by providing a mirrored loading state 
 * for the new 'Royale Noir' layout hierarchy.
 */
export function InstitutionalSkeleton() {
  return (
    <div className="min-h-screen bg-[#030406] flex flex-col pt-24">
      
      {/* Simulation Header */}
      <div className="w-full max-w-7xl mx-auto px-6 mb-12 flex items-center justify-between">
         <div className="space-y-4">
            <Skeleton height="12px" width="100px" className="rounded-full opacity-20" />
            <Skeleton height="40px" width="300px" className="rounded-xl" />
         </div>
         <Skeleton height="48px" width="120px" className="rounded-2xl" />
      </div>
      
      {/* Content Matrix Placeholder */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Surface */}
          <div className="lg:col-span-2 space-y-10">
            <Skeleton height="300px" className="rounded-[3rem] w-full" />
            <div className="space-y-6">
               <Skeleton height="20px" width="200px" />
               <div className="grid grid-cols-2 gap-6">
                  <Skeleton height="120px" className="rounded-[2rem]" />
                  <Skeleton height="120px" className="rounded-[2rem]" />
               </div>
            </div>
          </div>

          {/* Rail Surface */}
          <div className="space-y-10">
             <Skeleton height="400px" className="rounded-[3.5rem] w-full" />
             <Skeleton height="200px" className="rounded-[2.5rem] w-full" />
          </div>

        </div>
      </main>
      
    </div>
  );
}
