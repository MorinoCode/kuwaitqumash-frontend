/**
 * React Query configuration
 * Provides caching, background refetching, and error handling
 */
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes - cache time (formerly cacheTime)
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch on window focus (optional)
      refetchOnReconnect: true, // Refetch when network reconnects
      refetchOnMount: false, // Don't refetch on mount if data is fresh (use staleTime instead)
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query keys factory for type safety
export const queryKeys = {
  // Inventory
  inventory: (filters = {}) => ['inventory', filters],
  inventoryItem: (id) => ['inventory', id],
  inventoryByBarcode: (barcode) => ['inventory', 'barcode', barcode],
  
  // Customers
  customers: (filters = {}) => ['customers', filters],
  customer: (id) => ['customer', id],
  customerHistory: (id) => ['customer', id, 'history'],
  
  // Sales
  invoices: (filters = {}) => ['invoices', filters],
  invoice: (id) => ['invoice', id],
  
  // Branches
  branches: () => ['branches'],
  branch: (id) => ['branch', id],
  
  // Staff
  staff: () => ['staff'],
  staffMember: (id) => ['staff', id],
  
  // Dashboard
  dashboard: (role) => ['dashboard', role],
  analytics: (filters = {}) => ['analytics', filters],
  
  
  
  // WhatsApp
  whatsappStatus: (branchId = null) => ['whatsapp', 'status', branchId],
};
