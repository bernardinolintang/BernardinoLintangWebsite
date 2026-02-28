import React from "react";

type Props = { children: React.ReactNode; fallback?: React.ReactNode };
type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught:", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div style={{ padding: 24, fontFamily: "system-ui" }}>
            <h1>Something went wrong.</h1>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {this.state.error?.message ?? "Unknown error"}
            </pre>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
