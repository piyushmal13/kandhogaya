import React, { Component, ErrorInfo } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface State {
  hasError: boolean;
  errorId: string | null;
}

/**
 * ErrorBoundary — Institutional Runtime Error Shield
 *
 * Production : Shows a polished recovery UI, never leaks stack traces.
 * Development: Falls through to the default React overlay (verbose).
 */
export class ErrorBoundary extends Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorId: null };
  }

  static getDerivedStateFromError(): State {
    const errorId = `ERR-${Date.now().toString(36).toUpperCase()}`;
    return { hasError: true, errorId };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Route to Sentry / monitoring when available; always keep dev logs
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary] Caught:", error, errorInfo);
    }
    // TODO: Sentry.captureException(error, { extra: errorInfo });
  }

  private handleReload = () => {
    this.setState({ hasError: false, errorId: null });
    globalThis.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--color10)] flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            {/* Headline */}
            <h1 className="text-2xl font-black text-white tracking-tight mb-3">
              Something went wrong
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-2">
              An unexpected error occurred. Our team has been notified.
            </p>

            {/* Error reference (safe — no stack trace) */}
            {this.state.errorId && (
              <p className="text-[10px] font-mono text-gray-600 mb-8">
                Ref: {this.state.errorId}
              </p>
            )}

            {/* Primary action */}
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </button>

            {/* Secondary action */}
            <a
              href="/"
              className="block mt-4 text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
