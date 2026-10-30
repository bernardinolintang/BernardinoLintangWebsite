import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./components/ThemeProvider";
import "./index.css";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
  <ThemeProvider>
    <App />
    <SpeedInsights />
    <Analytics />
  </ThemeProvider>
  </React.StrictMode>

);
