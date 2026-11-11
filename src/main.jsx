import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import "./i18n";
import App from "./App.jsx";
import ErrorBoundary from "./components/errorBoundary/ErrorBoundary";
import { queryClient } from "./config/queryClient";

import "./utils/logger";

if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    event.preventDefault();
  });

  window.addEventListener("error", () => {

  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
