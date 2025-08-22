import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
      }

      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-foreground/70 mb-6">
              We encountered an error while loading this page. This might be a temporary issue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-3 bg-accent1 text-white rounded-lg hover:bg-accent2 transition-colors"
              >
                Try Again
              </button>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-accent1/10 transition-colors"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-foreground/70 hover:text-foreground">
                  Error Details
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple hydration error fallback
export const HydrationErrorFallback: React.FC<{ error?: Error; retry: () => void }> = ({ retry }) => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
    <div className="text-center max-w-md mx-auto px-4">
      <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-3">Loading Error</h2>
      <p className="text-foreground/70 mb-4">
        There was an issue loading this page. Please refresh to try again.
      </p>
      <button
        onClick={retry}
        className="px-6 py-3 bg-accent1 text-white rounded-lg hover:bg-accent2 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  </div>
);