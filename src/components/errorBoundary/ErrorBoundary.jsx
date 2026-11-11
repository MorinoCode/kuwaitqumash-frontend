import React from 'react';
import ErrorFallback from './ErrorFallback';

/**
 * React Error Boundary. Catches JS errors in child tree and shows fallback UI.
 * @param {React.ReactNode} children
 * @param {React.ComponentType|React.ReactNode} [fallback] - Custom fallback component or element. Receives { error, resetErrorBoundary }.
 * @param {Function} [onError] - (error, errorInfo) => void. Log to service.
 * @param {Function} [onReset] - Called when user retries.
 * @param {Array} [resetKeys] - When any key changes, boundary resets (e.g. [pathname] for route-level).
 */
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState((s) => ({ ...s, errorInfo }));
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    const { resetKeys } = this.props;
    if (!this.state.hasError || !resetKeys || !prevProps.resetKeys) return;
    const prevKeys = prevProps.resetKeys || [];
    if (resetKeys.length !== prevKeys.length || resetKeys.some((k, i) => k !== prevKeys[i])) {
      this.reset();
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const { fallback } = this.props;
      const fallbackProps = { error: this.state.error, resetErrorBoundary: this.reset };
      if (typeof fallback === 'function') {
        return fallback(fallbackProps);
      }
      if (React.isValidElement(fallback) && fallback.props) {
        return React.cloneElement(fallback, fallbackProps);
      }
      return <ErrorFallback {...fallbackProps} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
