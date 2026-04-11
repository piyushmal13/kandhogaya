import { PageLayout } from '../components/layout/PageLayout';
import { mobileFirst } from '../lib/responsive';
import { PageMeta } from '../components/site/PageMeta';

export const CaseStudies = () => {
  return (
    <PageLayout showFooter={true}>
      <PageMeta 
        title="Case Studies | IFX Trades"
        description="Read how tier-1 institutions deploy our algorithmic frameworks."
        path="/case-studies"
      />
      
      <div className={`space-y-16 ${mobileFirst.container} ${mobileFirst.section}`}>
        <div className="flex flex-col gap-6 max-w-4xl">
          <h1 className={mobileFirst.heading + " font-black text-white italic tracking-tighter uppercase leading-tight"}>
            Proven in <span className="text-[#00E5FF]">Markets</span>
          </h1>
          <p className={mobileFirst.subheading + " text-white/50"}>
            Discover how family offices and proprietary trading firms utilize our quant infrastructure for absolute returns.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-5xl">
           <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6 hover:border-[#00E5FF]/20 transition-all">
              <div className="text-[10px] uppercase text-[#00E5FF] tracking-widest font-black">Prop Firm ━ Dubai</div>
              <h3 className="text-2xl font-bold text-white">Scaling to $50M AUM with Zero Latency</h3>
              <p className="text-sm text-white/50 leading-relaxed max-w-3xl">
                By integrating the Sovereign DB Architecture v4.0.0, this firm reduced execution slippage by 44% and scaled operations to support 15,000 concurrent algo instances.
              </p>
           </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CaseStudies;
