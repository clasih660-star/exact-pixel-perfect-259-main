import React from "react";

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: Error | null; info?: string };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, info: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ error, info: info.componentStack });
    // also log to console for dev server
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <h2 style={{ marginTop: 0 }}>Client error while rendering classroom</h2>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#111', color: '#fff', padding: 12, borderRadius: 8 }}>
            {String(this.state.error?.message)}
            {this.state.info ? "\n\n" + this.state.info : ""}
          </pre>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => location.reload()}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children as JSX.Element;
  }
}

export default ErrorBoundary;
