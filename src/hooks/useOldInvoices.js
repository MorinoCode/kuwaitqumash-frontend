/**
 * Custom hook for old invoices queries using React Query
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { queryKeys } from '../config/queryClient';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const useOldInvoices = (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.branch_ids) queryParams.append('branch_ids', filters.branch_ids);
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.start_date) queryParams.append('start_date', filters.start_date);
  if (filters.end_date) queryParams.append('end_date', filters.end_date);
  if (filters.page) queryParams.append('page', filters.page || 1);
  if (filters.limit) queryParams.append('limit', filters.limit || 20);
  
  const queryString = queryParams.toString();
  const url = `/sales/old-invoices${queryString ? `?${queryString}` : ''}`;
  
  return useQuery({
    queryKey: queryKeys.oldInvoices(filters),
    queryFn: async () => {
      const res = await api.get(url);
      return res.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
};

export const useDeleteOldInvoice = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/sales/old-invoices/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.oldInvoices() });
      toast.success(t('old_invoice_deleted_successfully') || 'Old invoice deleted successfully');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || t('failed_to_delete_old_invoice') || 'Failed to delete old invoice';
      toast.error(errorMessage);
    }
  });
};
