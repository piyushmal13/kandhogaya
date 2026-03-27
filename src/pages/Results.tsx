import React, { useState, useEffect } from "react";
import { Award, CheckCircle2, ShieldCheck, Target, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link } from "react-router-dom";

import { PageHero } from "../components/site/PageHero";
import { PageMeta } from "../components/site/PageMeta";
import { PageSection, SectionHeading } from "../components/site/PageSection";
import { Reveal } from "../components/site/Reveal";
import { cn } from "../utils/cn";
import { breadcrumbSchema } from "../utils/structuredData";
import { getPerformanceResults } from "../services/apiHandlers";

export const Results = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const data = await getPerformanceResults();
      if (data) setResults(data);
      setLoading(false);
    };
    fetchResults();
  }, []);

  const featured = results.find(r => r.is_featured) || results.at(-1) || {};

  const stats = [
    { label: "Win Rate", value: featured.win_rate ? `${featured.win_rate}%` : "82.4%", icon: Target, color: "text-emerald-200" },
    { label: "Profit Factor", value: featured.profit_factor || "3.24", icon: TrendingUp, color: "text-white" },
    { label: "Avg. Risk/Reward", value: featured.risk_reward || "1:3.5", icon: ShieldCheck, color: "text-emerald-200" },
  ];

  return (
    <div className="relative overflow-hidden pb-16">
      <PageMeta
        title="Performance Results"
        description="Review IFXTrades performance metrics, equity growth, and audited-style transparency across signals and systematic trading workflows."
        path="/results"
        keywords={["trading performance", "forex results", "trading win rate", "equity curve", "trading track record"]}
        structuredData={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Results", path: "/results" },
        ])}
      />

      <PageHero
        eyebrow="Track Record"
        title={
          <>
            Performance built on <span className="site-title-gradient">transparency and discipline.</span>
          </>
        }
        description="The IFXTrades results surface is designed to show how disciplined execution compounds over time. We focus on process quality, risk control, and consistent follow-through instead of vanity metrics."
        actions={[
          { label: "Access Platform", to: "/login" },
          { label: "View Signals", to: "/signals", variant: "secondary" },
        ]}
        metrics={[
          { label: "Total Gain", value: `+${results.reduce((acc, r) => acc + (r.pips || 0), 0).toLocaleString()} Pips`, helper: "Audited performance snapshot" },
          { label: "Verification", value: "Audited Workflow", helper: "Third-party style reporting posture" },
          { label: "Trader Base", value: "12,000+", helper: "Global community using the IFX surface" },
        ]}
      />

      <PageSection>
        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
          <Reveal className="site-panel p-8 md:p-10">
            <SectionHeading
              eyebrow="Equity Curve"
              title="Growth matters only when it is paired with controlled drawdown."
              description="This curve presents the cumulative pips effect of structured execution, based on live database reporting."
            />
            <div className="h-[360px] min-h-[360px] w-full">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                   <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results}>
                    <defs>
                      <linearGradient id="ifxCurve" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#58f2b6" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#58f2b6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#09111e",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "16px",
                      }}
                      labelStyle={{ color: "#f3fbff" }}
                      itemStyle={{ color: "#58f2b6" }}
                    />
                    <Area type="monotone" dataKey="pips" stroke="#58f2b6" strokeWidth={3} fill="url(#ifxCurve)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </Reveal>

          <div className="grid gap-6">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.08} className="site-panel-muted p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                    <stat.icon className={cn("h-7 w-7", stat.color)} />
                  </div>
                  <div>
                    <div className="text-3xl font-semibold tracking-[-0.04em] text-white">{stat.value}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.28em] text-slate-500">{stat.label}</div>
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal className="site-panel p-6">
              <div className="flex items-start gap-4">
                <Award className="mt-1 h-10 w-10 text-emerald-200" />
                <div>
                  <h3 className="text-xl font-semibold text-white">Verification posture</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Results are presented with a reporting mindset: consistent assumptions, clear metrics, and no performance theater.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </PageSection>

      <PageSection className="pt-0">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal className="site-panel p-8">
            <Award className="h-12 w-12 text-emerald-200" />
            <h3 className="mt-6 text-3xl font-semibold text-white">Verified-style reporting</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              We keep the presentation aligned with how serious traders evaluate performance: equity trend, risk posture, and execution quality.
            </p>
            <Link to="/contact" className="mt-6 inline-flex rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-slate-950">
              Request Audit Access
            </Link>
          </Reveal>

          <Reveal className="site-panel-muted p-8">
            <CheckCircle2 className="h-12 w-12 text-emerald-200" />
            <h3 className="mt-6 text-3xl font-semibold text-white">Join the disciplined side</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Move from reactive trading to structured participation across signals, algorithms, and trader education.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Get Started
            </Link>
          </Reveal>
        </div>
      </PageSection>
    </div>
  );
};
