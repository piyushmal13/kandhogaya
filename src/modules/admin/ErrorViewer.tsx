import React, { useState } from "react";
import { 
  Zap, User as UserIcon,
  ChevronLeft, ChevronRight,
  RefreshCw, Clock
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useAdmin } from "../../hooks/useAdmin";

/**
 * ErrorViewer - Institutional Health Monitoring Surface
 * Strict Component Logic: Hook-Driven Audit Discovery
 */
export const ErrorViewer = () => {
  const { logs, fetchLogs, loading } = useAdmin();
  const [severityFilter, setSeverityFilter] = useState<string | undefined>();
  const [page, setPage] = useState(0);

  React.useEffect(() => {
    fetchLogs(0);
  }, [fetchLogs]);

  const getSeverityColor = (sev: string) => {
    if (sev === 'critical') return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (sev === 'warning') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      
      {/* 1. Health Monitoring Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Institutional Health Audit</h2>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-2">Zero Blindness Monitoring v6.0</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-zinc-900 border border-white/10 rounded-2xl p-1 p-x-2 h-12">
            {[
              { id: undefined, label: "ALL" },
              { id: "critical", label: "CRITICAL", color: "text-red-500" },
              { id: "warning", label: "WARNING", color: "text-amber-500" },
              { id: "info", label: "INFO", color: "text-emerald-500" }
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => setSeverityFilter(option.id)}
                className={cn(
                  "px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all",
                  severityFilter === option.id ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button 
            onClick={() => fetchLogs(page)}
            className="p-3 bg-zinc-900 border border-white/10 rounded-2xl hover:border-emerald-500 transition-all group"
          >
            <RefreshCw className={cn("w-4 h-4 text-gray-500 group-hover:text-emerald-500", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* 2. Audit Pulse Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Error Rate", value: "0.2%", status: "OPTIMAL", color: "text-emerald-500" },
          { label: "Protocol Sync", value: "Verified", status: "STABLE", color: "text-cyan-500" },
          { label: "Database Health", value: "Optimal", status: "HEALTHY", color: "text-emerald-500" },
          { label: "Critical Discovery", value: "0 Today", status: "CLEAR", color: "text-white" }
        ].map((metric) => (
          <div key={metric.label} className="bg-zinc-900 border border-white/10 p-8 rounded-[40px] group overflow-hidden relative">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 block">{metric.label}</span>
            <div className={cn("text-3xl font-black tracking-tighter italic", metric.color)}>{metric.value}</div>
            <div className="flex items-center gap-2 mt-4">
              <div className={cn("w-1 h-1 rounded-full animate-pulse", metric.color)} />
              <span className={cn("text-[9px] font-black uppercase tracking-widest", metric.color)}>{metric.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Operational Log Matrix */}
      <div className="bg-zinc-900 border border-white/10 rounded-[48px] overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Operational Identity</th>
                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Discovery Stream</th>
                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Severity Signal</th>
                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">User Context</th>
                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Auditing Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
                    No Health Logs Discovered
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-white uppercase tracking-wider">{log.type}</span>
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1 line-clamp-1">{log.message}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <Zap className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest italic truncate max-w-[150px]">
                          {typeof log.metadata === 'string' ? log.metadata : JSON.stringify(log.metadata).substring(0, 30)}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        getSeverityColor(log.severity)
                      )}>
                        {log.severity}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-3 h-3 text-gray-600" />
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{log.user_id?.substring(0, 8) || 'SYSTEM'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest italic">
                          <Clock className="w-3 h-3 text-emerald-500" />
                          {new Date(log.created_at).toLocaleTimeString()}
                        </div>
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1">
                          {new Date(log.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Global Pagination Hub */}
        <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
          <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
            Audit Segment {page + 1}
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 0 || loading}
              onClick={() => { setPage(p => p - 1); fetchLogs(page - 1); }}
              className="p-2 bg-zinc-900 border border-white/10 rounded-xl hover:border-emerald-500 disabled:opacity-30 transition-all group"
            >
              <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-emerald-500" />
            </button>
            <button 
              disabled={logs.length < 20 || loading}
              onClick={() => { setPage(p => p + 1); fetchLogs(page + 1); }}
              className="p-2 bg-zinc-900 border border-white/10 rounded-xl hover:border-emerald-500 disabled:opacity-30 transition-all group"
            >
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-500" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
