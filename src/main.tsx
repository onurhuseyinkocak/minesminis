import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import * as Sentry from '@sentry/react';
import App from "./App";
import "./index.css";
import "./cat-theme.css";
import "./kenney-ui.css";

// ── Web Vitals — report LCP, CLS, FID to GA4 without web-vitals package ──────
function reportWebVitals() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    // LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
      if (window.gtag) window.gtag('event', 'web_vitals', { metric_name: 'LCP', value: Math.round(last.startTime), metric_unit: 'ms' });
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch { /* PerformanceObserver type not supported */ }

  try {
    // CLS
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!layoutEntry.hadRecentInput) clsValue += layoutEntry.value;
      }
      if (window.gtag) window.gtag('event', 'web_vitals', { metric_name: 'CLS', value: Math.round(clsValue * 1000), metric_unit: 'unitless_x1000' });
    }).observe({ type: 'layout-shift', buffered: true });
  } catch { /* PerformanceObserver type not supported */ }

  try {
    // FID
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as PerformanceEntry & { processingStart: number; startTime: number };
        const fid = fidEntry.processingStart - fidEntry.startTime;
        if (window.gtag) window.gtag('event', 'web_vitals', { metric_name: 'FID', value: Math.round(fid), metric_unit: 'ms' });
      }
    }).observe({ type: 'first-input', buffered: true });
  } catch { /* PerformanceObserver type not supported */ }
}

// Only report vitals in production to avoid noise during dev
if (import.meta.env.PROD) {
  reportWebVitals();
}

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || '',
  enabled: import.meta.env.PROD && !!import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
  replaysOnErrorSampleRate: 0.5,
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
  beforeSend(event) {
    // Don't send events without a real DSN configured
    if (!import.meta.env.VITE_SENTRY_DSN) return null;
    return event;
  },
});

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
