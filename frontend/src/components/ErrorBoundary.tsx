import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="govuk-width-container">
          <main className="govuk-main-wrapper" id="main-content" role="main">
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-two-thirds">
                <h1 className="govuk-heading-l">
                  Sorry, there is a problem with the service
                </h1>
                <p className="govuk-body">Try again later.</p>
                {this.state.error && process.env.NODE_ENV === "development" && (
                  <details
                    className="govuk-details"
                    data-module="govuk-details"
                  >
                    <summary className="govuk-details__summary">
                      <span className="govuk-details__summary-text">
                        Error details (Development Mode)
                      </span>
                    </summary>
                    <div className="govuk-details__text">
                      <pre
                        style={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-all",
                        }}
                      >
                        {this.state.error.toString()}
                        <br />
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </details>
                )}
              </div>
            </div>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
