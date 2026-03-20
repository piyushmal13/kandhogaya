export const SiteBackdrop = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(88,242,182,0.16),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(77,153,255,0.14),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(88,242,182,0.08),transparent_34%)]" />
    <div className="site-grid absolute inset-0 opacity-35" />
    <div className="absolute left-[-10%] top-28 h-72 w-72 rounded-full bg-emerald-300/10 blur-[140px]" />
    <div className="absolute right-[-8%] top-16 h-80 w-80 rounded-full bg-sky-400/10 blur-[160px]" />
    <div className="absolute bottom-[-18%] left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-emerald-200/10 blur-[180px]" />
  </div>
);
