import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../../utils/cn";
import { Reveal } from "./Reveal";

interface PageSectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  contained?: boolean;
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
}

export const PageSection = ({
  children,
  className,
  contained = true,
  ...props
}: PageSectionProps) => (
  <section className={cn("relative py-12 md:py-16", className)} {...props}>
    {contained ? <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div> : children}
  </section>
);

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) => (
  <Reveal
    className={cn(
      "mb-10 md:mb-12",
      align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl",
    )}
  >
    {eyebrow ? (
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-emerald-200/80">
        {eyebrow}
      </div>
    ) : null}
    <h2 className="text-3xl font-semibold leading-tight text-white md:text-5xl">{title}</h2>
    {description ? (
      <p className="mt-4 text-base leading-8 text-slate-300 md:text-lg">{description}</p>
    ) : null}
  </Reveal>
);
