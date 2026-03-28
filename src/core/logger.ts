import { supabase } from "../lib/supabase";

/**
 * Institutional System Monitoring Service
 * Centralized logging for API health, query failures, and behavioral exceptions.
 */

export type LogLevel = "info" | "warn" | "error" | "fatal";
export type LogType = "api" | "query" | "auth" | "payment" | "system";

export const logger = {
  async log(type: LogType, message: string, metadata: any = {}, level: LogLevel = "info") {
    const payload = {
      type,
      level,
      message,
      metadata: {
        ...metadata,
        url: globalThis.location.href,
        userAgent: globalThis.navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    };

    console.log(`[SystemHealth][${level.toUpperCase()}] ${type}: ${message}`, payload);

    // Persist to System Logs
    try {
      const { error } = await supabase
        .from("system_logs")
        .insert([payload]);
      
      if (error) console.error("[SystemHealth] Persistence Failure:", error);
    } catch (err) {
      console.error("[SystemHealth] Critical Logger Exception:", err);
    }
  },

  async error(type: LogType, message: string, metadata: any = {}) {
    return this.log(type, message, metadata, "error");
  },

  async warn(type: LogType, message: string, metadata: any = {}) {
    return this.log(type, message, metadata, "warn");
  }
};
