import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';

export function useSignalPlans() {
  return useQuery({
    queryKey: ['signal_plans'],
    queryFn: async () => {
      const plans = await productService.getSignalPlans();
      
      // If no plans found in DB, return standard hardcoded ones as fallback
      if (!plans || plans.length === 0) {
        return [
          {
            id: 'plan_1m',
            duration: "1 Month",
            price: 20,
            features: ["Daily Signals", "Entry/SL/TP", "Basic Support"],
          },
          {
            id: 'plan_3m',
            duration: "3 Months",
            price: 50,
            originalPrice: 60,
            savings: 10,
            features: ["Daily Signals", "Entry/SL/TP", "Priority Support", "Risk Management Guide"],
            popular: true,
          },
          {
            id: 'plan_6m',
            duration: "6 Months",
            price: 80,
            features: ["Daily Signals", "Entry/SL/TP", "VIP Support", "Risk Management Guide", "1-on-1 Consultation"],
          },
        ];
      }

      // Map DB variants to UI format
      return plans.map((p: any) => ({
        id: p.id,
        duration: p.duration_days === 30 ? "1 Month" : p.duration_days === 90 ? "3 Months" : p.duration_days === 180 ? "6 Months" : `${p.duration_days} Days`,
        price: p.price,
        features: p.product?.description?.split(',') || ["Daily Signals", "Entry/SL/TP", "Full Access"],
        popular: p.duration_days === 90,
      }));
    },
    staleTime: 600000, // 10 minutes
  });
}
