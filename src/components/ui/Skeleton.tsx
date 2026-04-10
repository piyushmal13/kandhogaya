import { cn } from "../../utils/cn";

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

export const Skeleton = ({ className, height, width }: SkeletonProps) => (
  <div
    className={cn("skeleton", className)}
    style={{ height, width }}
    aria-hidden="true"
  />
);

export const BlogCardSkeleton = () => (
  <div className="site-panel overflow-hidden" aria-hidden="true">
    <Skeleton className="aspect-video rounded-none" />
    <div className="p-8 space-y-4">
      <Skeleton height="12px" width="80px" />
      <Skeleton height="28px" />
      <Skeleton height="28px" width="70%" />
      <Skeleton height="16px" />
      <Skeleton height="16px" />
      <Skeleton height="16px" width="60%" />
    </div>
  </div>
);

export const SignalCardSkeleton = () => (
  <div
    className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4"
    aria-hidden="true"
  >
    <div className="flex justify-between">
      <div className="space-y-2">
        <Skeleton height="28px" width="100px" />
        <Skeleton height="14px" width="80px" />
      </div>
      <Skeleton height="24px" width="60px" className="rounded-full" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <Skeleton height="10px" width="70px" />
        <Skeleton height="18px" width="90px" />
      </div>
      <div className="space-y-1">
        <Skeleton height="10px" width="70px" />
        <Skeleton height="18px" width="90px" />
      </div>
    </div>
  </div>
);

export const CourseCardSkeleton = () => (
  <div className="site-panel overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 p-8 space-y-6 flex flex-col h-full" aria-hidden="true">
    <Skeleton className="aspect-video rounded-3xl" />
    <div className="flex items-center gap-4">
       <Skeleton height="48px" width="48px" className="rounded-full shrink-0" />
       <div className="space-y-2 flex-1">
         <Skeleton height="12px" width="100px" />
         <Skeleton height="10px" width="60px" />
       </div>
    </div>
    <div className="space-y-3">
      <Skeleton height="28px" width="90%" />
      <Skeleton height="14px" />
      <Skeleton height="14px" width="70%" />
    </div>
    <div className="pt-4 border-t border-white/5">
       <Skeleton height="48px" className="rounded-2xl w-full" />
    </div>
  </div>
);

export const WebinarCardSkeleton = () => (
  <div className="rounded-[2.5rem] bg-white/5 border border-white/10 p-8 space-y-6" aria-hidden="true">
    <div className="flex justify-between items-start">
      <Skeleton height="24px" width="120px" className="rounded-full" />
      <Skeleton height="20px" width="60px" />
    </div>
    <div className="space-y-3">
      <Skeleton height="32px" />
      <Skeleton height="32px" width="60%" />
    </div>
    <div className="flex gap-4">
      <Skeleton height="48px" className="flex-1 rounded-2xl" />
      <Skeleton height="48px" width="48px" className="rounded-2xl" />
    </div>
  </div>
);

export const MediaSkeleton = ({ aspect = "video" }: { aspect?: "video" | "square" | "portrait" }) => {
  let aspectClass = "aspect-video";
  if (aspect === "square") aspectClass = "aspect-square";
  if (aspect === "portrait") aspectClass = "aspect-[3/4]";
  
  return <Skeleton className={cn(aspectClass, "rounded-2xl w-full")} />;
};
