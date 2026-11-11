import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { queryKeys } from "../config/queryClient";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const useInvoices = (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.branch_ids) queryParams.append("branch_ids", filters.branch_ids);
  if (filters.branch_id) queryParams.append("branch_id", filters.branch_id);
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.start_date) queryParams.append("start_date", filters.start_date);
  if (filters.end_date) queryParams.append("end_date", filters.end_date);
  if (filters.date) queryParams.append("date", filters.date);
  if (filters.page) queryParams.append("page", filters.page || 1);
  if (filters.limit) queryParams.append("limit", filters.limit || 20);

  const queryString = queryParams.toString();
  const url = `/sales/invoices${queryString ? `?${queryString}` : ""}`;

  return useQuery({
    queryKey: queryKeys.invoices(filters),
    queryFn: async () => {
      const res = await api.get(url);
      return res.data;
    },
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
  });
};

export const useInvoice = (id) => {
  return useQuery({
    queryKey: queryKeys.invoice(id),
    queryFn: async () => {
      const res = await api.get(`/sales/invoices/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/sales/create", data);
      return res.data;
    },
    onSuccess: (data) => {

      const newInvoice = data.data;

      if (newInvoice) {
        queryClient.setQueriesData(
          { queryKey: queryKeys.invoices() },
          (old) => {
            if (!old || !old.data) return old;

            const exists = old.data.some(
              (invoice) => invoice.id === newInvoice.id,
            );

            return {
              ...old,
              data: exists ? old.data : [newInvoice, ...old.data],
              count: exists ? old.count : (old.count || 0) + 1,
              pagination: {
                ...old.pagination,
                totalItems: exists
                  ? old.pagination?.totalItems || 0
                  : (old.pagination?.totalItems || 0) + 1,
              },
            };
          },
        );
      }

      queryClient.invalidateQueries({
        queryKey: queryKeys.invoices(),
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.inventory(),
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard(),
        refetchType: "none",
      });

      toast.success(
        t("sale_completed_successfully") || "Sale completed successfully!",
      );
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("transaction_failed") ||
        "Transaction failed";
      toast.error(errorMessage);
    },
  });
};

export const useSendInvoiceWhatsApp = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ id, phone }) => {
      const res = await api.post(`/sales/invoices/${id}/send-whatsapp`, {
        phone,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success(
        t("invoice_sent_successfully") ||
          "Invoice sent via WhatsApp successfully",
      );
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        t("failed_to_send_invoice") ||
        "Failed to send invoice";
      toast.error(errorMessage);
    },
  });
};
