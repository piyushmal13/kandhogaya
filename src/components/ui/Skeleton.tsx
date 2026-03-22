import { cn } from "../../utils/cn";

interface SkeletonProps {
  className?: string;
  count?: number;
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
  <div className="site-panel overflow-hidden" aria-hidden="true">
    <Skeleton className="aspect-video rounded-none" />
    <div className="p-6 space-y-4">
      <Skeleton height="24px" width="80px" className="rounded-full" />
      <Skeleton height="28px" />
      <Skeleton height="16px" />
      <Skeleton height="16px" width="75%" />
      <div className="flex gap-4 pt-2">
        <Skeleton height="16px" width="80px" />
        <Skeleton height="16px" width="80px" />
      </div>
    </div>
  </div>
);
