import React from "react";
import { logError } from "../lib/logError";

export default class SentryBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    logError(error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 24,
          background: "#fff4f4",
          border: "1px solid #ffd6d6",
          borderRadius: 12,
          color: "#b91c1c",
          textAlign: "center"
        }}>
          <div style={{ fontWeight: "bold" }}>3D Viewer Error</div>
          <div>Sorry, something went wrong in the 3D preview.</div>
          <div>Our team has been notified.</div>
        </div>
      );
    }
    return this.props.children;
  }
}