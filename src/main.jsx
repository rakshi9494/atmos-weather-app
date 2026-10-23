// ─── main.jsx ─────────────────────────────────────────────────────────────────
// Application entry point with ErrorBoundary and StrictMode.
import React, { StrictMode, Component } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Atmos ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            color: "#f5f7ff",
            background: "#090e1c",
            fontFamily: "'Manrope', system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "24px", marginBottom: "12px", color: "#f87171" }}>
            Something went wrong
          </h2>
          <p
            style={{
              maxWidth: "520px",
              color: "#8997b6",
              fontSize: "13px",
              marginBottom: "24px",
              lineHeight: 1.6,
            }}
          >
            {this.state.error?.message ||
              "An unexpected error occurred while rendering the dashboard."}
          </p>
          <button
            onClick={() => {
              window.localStorage.clear();
              window.location.reload();
            }}
            style={{
              padding: "10px 22px",
              background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "13px",
            }}
          >
            Reset Settings &amp; Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}
