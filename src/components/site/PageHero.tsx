import type { ReactNode } from "react";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

import { cn } from "../../utils/cn";
import { Reveal } from "./Reveal";

interface HeroAction {
  label: string;
  to?: string;
  href?: string;
  icon?: ReactNode;
  variant?: "primary" | "secondary";
}

interface HeroMetric {
  label: string;
  value: string;
  helper?: string;
}

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  actions?: HeroAction[];
  metrics?: HeroMetric[];
  aside?: ReactNode;
  className?: string;
}

const ActionButton = ({ action }: { action: HeroAction }) => {
  const sharedClassName = cn(
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300",
    action.variant === "secondary"
      ? "border border-white/10 bg-white/5 text-white hover:border-emerald-300/30 hover:bg-white/10"
      : "bg-emerald-300 text-slate-950 shadow-[0_16px_40px_rgba(88,242,182,0.18)] hover:bg-emerald-200",
  );

  const content = (
    <>
      <span>{action.label}</span>
      {action.icon ?? <ArrowRight className="h-4 w-4" />}
    </>
  );

  if (action.to) {
    return (
      <Link to={action.to} className={sharedClassName}>
        {content}
      </Link>
    );
  }

  return (
    <a href={action.href} className={sharedClassName}>
      {content}
    </a>
  );
};

export const PageHero = ({
  eyebrow,
  title,
  description,
  actions = [],
  metrics = [],
  aside,
  className,
}: PageHeroProps) => (
  <section className={cn("relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24", className)}>
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(88,242,182,0.18),transparent_32%),radial-gradient(circle_at_82%_14%,rgba(89,180,255,0.16),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_30%)]" />
    <div className="site-grid pointer-events-none absolute inset-0 opacity-50" />

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className={cn("grid gap-12", aside ? "items-end lg:grid-cols-[minmax(0,1fr)_360px]" : "max-w-4xl")}>
        <div>
          <Reveal>
            <div className="site-pill mb-6 inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.35em] text-emerald-100/85">
              {eyebrow}
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="max-w-5xl text-5xl font-semibold leading-none tracking-[-0.04em] text-white md:text-7xl xl:text-[5.6rem]">
              {title}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-xl">
              {description}
            </p>
          </Reveal>

          {actions.length ? (
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {actions.map((action) => (
                  <ActionButton key={action.label} action={action} />
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>

        {aside ? (
          <Reveal delay={0.2} className="site-panel p-6 md:p-8">
            {aside}
          </Reveal>
        ) : null}
      </div>

      {metrics.length ? (
        <Reveal delay={0.25} className="mt-10 md:mt-14">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <motion.div
                key={metric.label}
                whileHover={{ y: -4 }}
                className="site-panel-muted p-5"
              >
                <div className="text-sm uppercase tracking-[0.28em] text-slate-400">{metric.label}</div>
                <div className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                  {metric.value}
                </div>
                {metric.helper ? <div className="mt-2 text-sm text-slate-400">{metric.helper}</div> : null}
              </motion.div>
            ))}
          </div>
        </Reveal>
      ) : null}
    </div>
  </section>
);
