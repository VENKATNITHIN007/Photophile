"use client";

import React, { Component, ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { DataState } from "./DataState";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * A specialized Error Boundary that integrates with React Query
 * to catch errors thrown by useSuspenseQuery.
 */
class ErrorBoundaryInner extends Component<Props & { reset: () => void }, State> {
  constructor(props: Props & { reset: () => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("QueryErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.props.reset();
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-12">
          <DataState.Error 
            message={this.state.error?.message || "Failed to load data"} 
            onRetry={this.handleRetry} 
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export function QueryErrorBoundary({ children }: Props) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundaryInner reset={reset}>
          {children}
        </ErrorBoundaryInner>
      )}
    </QueryErrorResetBoundary>
  );
}
