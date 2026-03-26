import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./cat-theme.css";

// Global unhandled error / rejection handler (belt-and-suspenders alongside errorLogger.init)
window.addEventListener("unhandledrejection", (event) => {
  const msg =
    event.reason instanceof Error
      ? event.reason.message
      : String(event.reason ?? "Unknown rejection");
  // errorLogger is initialised inside App; this is a last-resort safety net
  // that fires even if the React tree has not mounted yet.
  if (typeof console !== "undefined") {
    console.error("[global unhandledrejection]", msg);
  }
});

const rootEl = document.getElementById("root");

if (!rootEl) {
  // Fatal: the HTML shell is missing the mount point
  document.body.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui;text-align:center;padding:2rem">' +
    "<h1>Something went wrong</h1><p>Please refresh the page or try again later.</p></div>";
} else {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
