import { Suspense, lazy } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ErrorBoundary from "./ErrorBoundary";

// Prefer default export; if your component is named, export default it.
const Portfolio = lazy(() => import("./components/Portfolio"));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div style={{ padding: 24, fontFamily: "system-ui" }}>
            <h1>Loading…</h1>
          </div>
        }
      >
        <Portfolio />
      </Suspense>
    </ErrorBoundary>
  );
}
