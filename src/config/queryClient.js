import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const queryKeys = {

  inventory: (filters = {}) => ['inventory', filters],
  inventoryItem: (id) => ['inventory', id],
  inventoryByBarcode: (barcode) => ['inventory', 'barcode', barcode],

  customers: (filters = {}) => ['customers', filters],
  customer: (id) => ['customer', id],
  customerHistory: (id) => ['customer', id, 'history'],

  invoices: (filters = {}) => ['invoices', filters],
  invoice: (id) => ['invoice', id],

  branches: () => ['branches'],
  branch: (id) => ['branch', id],

  staff: () => ['staff'],
  staffMember: (id) => ['staff', id],

  dashboard: (role) => ['dashboard', role],
  analytics: (filters = {}) => ['analytics', filters],

  whatsappStatus: (branchId = null) => ['whatsapp', 'status', branchId],
};
