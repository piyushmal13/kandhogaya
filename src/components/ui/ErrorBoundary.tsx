import React, { Component, ErrorInfo } from "react";

export class ErrorBoundary extends Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-red-500 p-10 font-mono">
          <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
          <pre className="bg-zinc-900 p-4 rounded overflow-auto">{this.state.error?.toString()}</pre>
          <pre className="bg-zinc-900 p-4 rounded overflow-auto mt-4">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
