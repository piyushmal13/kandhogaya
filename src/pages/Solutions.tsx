import { PageLayout } from '../components/layout/PageLayout';
import { mobileFirst } from '../lib/responsive';
import { PageMeta } from '../components/site/PageMeta';

export const Solutions = () => {
  return (
    <PageLayout showFooter={true}>
      <PageMeta 
        title="Institutional Solutions | IFX Trades"
        description="Engineering proprietary trading systems for institutional desks."
        path="/solutions"
      />
      
      <div className={`space-y-16 ${mobileFirst.container} ${mobileFirst.section}`}>
        <div className="flex flex-col gap-6 max-w-4xl">
          <h1 className={mobileFirst.heading + " font-black text-white italic tracking-tighter uppercase leading-tight"}>
            Engineered for <span className="text-[#00E5FF]">Institutions</span>
          </h1>
          <p className={mobileFirst.subheading + " text-white/50"}>
            From high-frequency algorithmic infrastructure to sovereign capital management frameworks, our solutions scale with your AUM.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Algorithmic Development", desc: "Custom C++/Python execution models." },
            { title: "Proprietary Data Engineering", desc: "Low-latency market gateways." },
            { title: "Sovereign UI Integrations", desc: "Bloomberg-style operational dashboards." },
          ].map(s => (
            <div key={s.title} className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4 hover:border-[#00E5FF]/20 transition-all">
              <h3 className="text-xl font-bold text-white">{s.title}</h3>
              <p className="text-sm text-white/50">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Solutions;
