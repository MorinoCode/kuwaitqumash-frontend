import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import "../i18n";

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 5 * 60 * 1000, staleTime: 0 },
      mutations: { retry: false },
    },
  });

export const renderHookWithQuery = (hook, options = {}) => {
  const client = options.client || createTestQueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return { ...renderHook(hook, { wrapper }), client };
};
