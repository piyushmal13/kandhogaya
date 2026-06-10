import { supabaseAdmin, safeQuery } from "../utils/supabase";
import { logger } from "../config";
import { generateText } from "../../src/lib/gemini";

const CEO_SEO_SYSTEM_PROMPT = `You are the IFXTrades CEO & SEO Strategic Advisor Agent. You have world-class expertise in digital marketing, SEO, SaaS growth, business strategy, and web optimization.

You have been designed to serve as the ultimate digital strategist. You combine:
1. Google Core Developer & SEO Optimizer Mindset: Highly technical SEO advice, keyword mapping, semantic HTML improvements, schema.org markup, PageSpeed optimization (Core Web Vitals), and click-through rate optimization.
2. Chief Executive Officer (CEO) Growth Mindset: Scaling SaaS products, client acquisition pipelines, algorithmic trading software licensing, and conversion rate optimization.

Guidelines for your replies:
- Keep your tone sharp, authoritative, technical, yet highly engaging (matching premium finance/tech brands like OpenAI, Stripe, or Vercel).
- Use clear Markdown formatting with headers, code blocks (for HTML/JS/CSS optimization snippets), bullet points, and strong emphasis where necessary.
- Proactively suggest concrete SEO strategies, target keywords, sitemap improvements, and marketing ideas for IFXTrades (Trading Intelligence Hub, Gold trading signals, MT5 bots, Academy courses, Webinars).
- If the user asks about general business strategy or quantitative systems, connect it back to organic discovery (SEO) and scaling the business.`;

export const RequestService = {
  /**
   * Submits a custom engineering (Deep Coding) request.
   * Persists as a high-intent lead with specific CRM metadata.
   */
  submitDeepCodingRequest: async (data: {
    name: string;
    email: string;
    project_type: string;
    description: string;
    budget?: string;
    timeline?: string;
    user_id?: string;
  }) => {
    const { name, email, project_type, description, budget, timeline, user_id } = data;

    return safeQuery(
      async () => {
        // 1. Upsert Lead (Institutional CRM)
        const { data: lead, error } = await supabaseAdmin
          .from('leads')
          .upsert({
            email,
            user_id,
            source: 'deep_coding_terminal',
            stage: 'NEW_REQUEST',
            is_hot: true,
            priority_tag: 'INSTITUTIONAL_CUSTOM',
            crm_metadata: {
              full_name: name,
              project_type,
              description,
              budget,
              timeline,
              submitted_at: new Date().toISOString()
            }
          }, { onConflict: 'email' })
          .select()
          .single();

        if (error) return { data: null, error };

        // 2. Log System Event
        const { error: logErr } = await supabaseAdmin.from('system_logs').insert({
          type: 'CUSTOM_REQUEST',
          severity: 'info',
          message: `New Deep Coding request from ${email}: ${project_type}`,
          user_id,
          metadata: { lead_id: lead.id }
        });

        return { data: { success: true, lead_id: lead?.id }, error: logErr };
      },
      "RequestService.submitDeepCodingRequest"
    );
  },

  /**
   * Proxies AI chat conversations to Gemini with a specialized CEO & SEO system instruction.
   */
  askAiAdvisor: async (message: string, history: any[]) => {
    return safeQuery(
      async () => {
        const contents = [];
        if (history && Array.isArray(history)) {
          for (const turn of history) {
            contents.push({
              role: turn.role === "assistant" ? "model" : "user",
              parts: [{ text: turn.content }]
            });
          }
        }

        contents.push({
          role: "user",
          parts: [{ text: message }]
        });

        try {
          const reply = await generateText(CEO_SEO_SYSTEM_PROMPT, contents);
          return { data: { success: true, reply }, error: null };
        } catch (err: any) {
          return { data: null, error: err };
        }
      },
      "RequestService.askAiAdvisor"
    );
  }
};

