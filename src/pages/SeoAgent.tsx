import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { EliteButton } from "../components/ui/Button";
import { 
  Terminal, 
  Cpu, 
  Send, 
  Trash2, 
  Copy, 
  Check,
  Search, 
  ShieldAlert, 
  Activity, 
  Sparkles,
  TrendingUp
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  {
    title: "Homepage SEO Audit",
    text: "Conduct a highly technical SEO audit of the IFXTrades homepage structure. Suggest semantic tags and schema.org markup.",
    icon: Search
  },
  {
    title: "Gold Signals Keyword Matrix",
    text: "Generate a targeted keyword matrix for XAUUSD (Gold) trading signals, mapping intent levels and search volumes.",
    icon: TrendingUp
  },
  {
    title: "SaaS Licensing Strategy",
    text: "Outline a premium B2B marketing pipeline to license our proprietary MT5 systematic algorithms to prop firms.",
    icon: Cpu
  },
  {
    title: "Webinar Funnel Optimization",
    text: "How do we optimize webinar landing page conversion rates using Core Web Vitals and psychological B2B copy rules?",
    icon: Sparkles
  }
];

export const SeoAgent = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "### System Handshake Established.\n\nI am the **IFXTrades CEO & SEO Strategic Advisor Agent**. I combine high-performance Google Developer Search Optimizations with B2B SaaS growth strategy.\n\nSelect a preset protocol card below or enter a custom strategy inquiry regarding sitemaps, keyword mapping, conversion pipelines, or algorithmic licensing models.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const statusIntervals = [
    "Establishing connection to Gemini cognitive cluster...",
    "Injecting SEO indexing guidelines...",
    "Querying volatility models and SERP rankings...",
    "Parsing search optimization schema...",
    "Structuring facts-first strategic output..."
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      let idx = 0;
      setStatusMessage(statusIntervals[0]);
      timer = setInterval(() => {
        idx = (idx + 1) % statusIntervals.length;
        setStatusMessage(statusIntervals[idx]);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Send conversation history + new message to our backend endpoint
      const response = await fetch("/api/ai/advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map((m) => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error("Synapse transmission failure");
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply || "Protocol Exception: Empty reply returned from cognitive nodes.",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        role: "assistant",
        content: `### ⚠️ Protocol Transmission Failure\n\nFailed to sync with the cognitive node. Connection status: **Offline**.\n\n*Technical Details:* ${err.message || "Unknown ECN node error"}.\n\nEnsure your \`GEMINI_API_KEY\` is active in the environment.`,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "### System Reset Completed.\n\nPrevious session logs archived. Awaiting next command directive.",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-[#010203] text-[#BAC9CC] font-sans selection:bg-[#00A3FF]/20 selection:text-white">
      <main className="max-w-6xl mx-auto px-6 py-24">
        {/* Terminal Header */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A3FF]/10 border border-[#00A3FF]/20 text-[#00A3FF] text-[9px] font-mono tracking-widest mb-4 uppercase">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              Cognitive Node: Operational
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
              Strategic <span className="text-transparent bg-clip-text bg-[var(--grad-royale)]">AI Advisor</span>
            </h1>
            <p className="text-[#849396] mt-4 max-w-xl text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
              Query our systematic CEO & SEO model for high-end digital architecture, keyword mapping, conversion pipelines, and organic SEO directives.
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <div className="bg-[#040507] border border-white/5 px-4 py-3 rounded-2xl flex flex-col items-center justify-center">
              <span className="text-[8px] font-black text-gray-500 tracking-widest uppercase">LATENCY</span>
              <span className="text-xs font-mono font-bold text-[#00E5FF]">&lt;1.2ms</span>
            </div>
            <div className="bg-[#040507] border border-white/5 px-4 py-3 rounded-2xl flex flex-col items-center justify-center">
              <span className="text-[8px] font-black text-gray-500 tracking-widest uppercase">NODE LOCATION</span>
              <span className="text-xs font-mono font-bold text-white">EQUINIX NY4</span>
            </div>
          </div>
        </div>

        {/* Preset Prompt Cards */}
        {messages.length <= 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt.title}
                onClick={() => handleSend(prompt.text)}
                className="text-left p-6 bg-[#040507]/40 border border-white/5 rounded-3xl hover:border-[#00A3FF]/30 hover:bg-[#00A3FF]/5 transition-all group relative overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-white/5 text-[#00A3FF] border border-white/5 group-hover:scale-110 transition-transform">
                    <prompt.icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-black uppercase text-white tracking-wider group-hover:text-[#00A3FF] transition-colors">
                    {prompt.title}
                  </h3>
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">
                  {prompt.text}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Chat Terminal Box */}
        <div className="bg-[#040507] border border-white/5 rounded-[2.5rem] relative overflow-hidden flex flex-col min-h-[500px] max-h-[700px] shadow-2xl">
          {/* Top double-border specular highlight */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8B5CF6]/40 via-[#00A3FF]/40 to-[#00E5FF]/40" />

          {/* Terminal Controls Bar */}
          <div className="p-4 bg-black/40 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00A3FF]" />
              <span className="text-[9px] font-mono tracking-widest text-gray-500 font-bold uppercase">
                IFX-COGNITIVE-SHELL-V6.0
              </span>
            </div>
            <button
              onClick={clearChat}
              className="p-2 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest"
              title="Reset Chat Session"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Terminal
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/10">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[85%] ${
                  msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div
                  className={`p-6 rounded-3xl relative group border ${
                    msg.role === "user"
                      ? "bg-[#0A0A0A] border-white/5 text-white rounded-br-none"
                      : "bg-[#0E1428]/45 border-[#00A3FF]/10 text-[#BAC9CC] rounded-bl-none"
                  }`}
                >
                  <div className="prose prose-invert max-w-none text-xs font-sans leading-relaxed tracking-wide space-y-4">
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-base font-black uppercase tracking-wider text-white border-b border-white/5 pb-2" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-sm font-black uppercase tracking-wider text-white" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-xs font-black uppercase tracking-widest text-[#00A3FF]" {...props} />,
                        p: ({node, ...props}) => <p className="leading-relaxed" {...props} />,
                        li: ({node, ...props}) => <li className="list-disc ml-4 leading-relaxed" {...props} />,
                        code: ({node, inline, className, children, ...props}: any) => {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline ? (
                            <pre className="bg-black/60 border border-white/5 p-4 rounded-xl font-mono text-[10px] overflow-x-auto text-[#00E5FF] leading-normal my-3">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          ) : (
                            <code className="bg-white/5 px-1.5 py-0.5 rounded font-mono text-[#00E5FF]" {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(msg.content, idx)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 border border-white/5 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy response"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <span className="text-[8px] font-mono text-gray-600 uppercase mt-2 tracking-widest">
                  {msg.role === "user" ? "USER_INPUT" : "ADVISOR_ENGINE"} //{" "}
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex flex-col items-start max-w-[80%]">
                <div className="p-6 bg-[#0E1428]/25 border border-[#00A3FF]/5 rounded-3xl rounded-bl-none text-[#BAC9CC] flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-[#00A3FF] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#00A3FF] animate-pulse">
                    {statusMessage}
                  </span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-6 bg-black/30 border-t border-white/5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="Ask CEO & SEO strategic advisor agent..."
                className="flex-1 bg-black/60 border border-white/10 px-5 py-4 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00A3FF]/50 focus:ring-1 focus:ring-[#00A3FF]/40 disabled:opacity-50 font-sans"
              />
              <EliteButton
                type="submit"
                disabled={loading || !input.trim()}
                variant="gemini"
                size="md"
                glowEffect
              >
                <Send className="w-4 h-4" />
              </EliteButton>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
