/**
 * Custom hook for customer queries using React Query
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { queryKeys } from "../config/queryClient";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const useCustomers = (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.branch_id) queryParams.append("branch_id", filters.branch_id);
  if (filters.page) queryParams.append("page", filters.page || 1);
  if (filters.limit) queryParams.append("limit", filters.limit || 20);

  const queryString = queryParams.toString();
  const url = `/customers${queryString ? `?${queryString}` : ""}`;

  return useQuery({
    queryKey: queryKeys.customers(filters),
    queryFn: async () => {
      const res = await api.get(url);
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache time
    refetchOnMount: false, // Don't refetch if data is fresh
  });
};

export const useCustomer = (id) => {
  return useQuery({
    queryKey: queryKeys.customer(id),
    queryFn: async () => {
      const res = await api.get(`/customers/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCustomerHistory = (id) => {
  return useQuery({
    queryKey: queryKeys.customerHistory(id),
    queryFn: async () => {
      const res = await api.get(`/customers/${id}/history`);
      return res.data.data || [];
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes (history changes frequently)
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "front_image" || key === "back_image") {
          if (data[key]) formData.append(key, data[key]);
        } else if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      const res = await api.post("/customers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      // Optimistically update customers list with new customer
      const newCustomer = data.data;

      queryClient.setQueriesData({ queryKey: queryKeys.customers() }, (old) => {
        if (!old || !old.data) return old;

        // Check if customer already exists
        const exists = old.data.some(
          (customer) => customer.id === newCustomer.id,
        );

        return {
          ...old,
          data: exists ? old.data : [newCustomer, ...old.data],
          count: exists ? old.count : (old.count || 0) + 1,
        };
      });

      // Invalidate to ensure consistency (but don't force immediate refetch)
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers(),
        refetchType: "none", // Don't refetch immediately, use cached data
      });

      toast.success(
        t("customer_added_successfully") || "Customer added successfully",
      );
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        t("failed_to_add_customer") ||
        "Failed to add customer";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "front_image" || key === "back_image") {
          if (data[key]) formData.append(key, data[key]);
        } else if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      const res = await api.put(`/customers/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      const updatedCustomer = data.data;

      // Update single customer query
      queryClient.setQueryData(
        queryKeys.customer(variables.id),
        updatedCustomer,
      );

      // Update customers list
      queryClient.setQueriesData({ queryKey: queryKeys.customers() }, (old) => {
        if (!old || !old.data) return old;

        return {
          ...old,
          data: old.data.map((customer) =>
            customer.id === variables.id ? updatedCustomer : customer,
          ),
        };
      });

      // Invalidate to ensure consistency (but don't force immediate refetch)
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer(variables.id),
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers(),
        refetchType: "none",
      });

      toast.success(
        t("customer_updated_successfully") || "Customer updated successfully",
      );
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        t("failed_to_update_customer") ||
        "Failed to update customer";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/customers/${id}`);
      return res.data;
    },
    onMutate: async (id) => {
      // Cancel outgoing queries to prevent race conditions
      await queryClient.cancelQueries({ queryKey: queryKeys.customers() });
      await queryClient.cancelQueries({ queryKey: queryKeys.customer(id) });

      // Snapshot previous values for rollback
      const previousQueries = queryClient.getQueriesData({
        queryKey: queryKeys.customers(),
      });
      const previousCustomer = queryClient.getQueryData(queryKeys.customer(id));

      // Optimistically remove customer from list
      previousQueries.forEach(([queryKey, oldData]) => {
        if (oldData && oldData.data) {
          queryClient.setQueryData(queryKey, (old) => {
            if (!old || !old.data) return old;

            return {
              ...old,
              data: old.data.filter((customer) => customer.id !== id),
              count: Math.max(0, (old.count || 0) - 1),
            };
          });
        }
      });

      // Remove single customer query
      queryClient.removeQueries({ queryKey: queryKeys.customer(id) });

      return { previousQueries, previousCustomer };
    },
    onSuccess: () => {
      // Invalidate to ensure consistency (but don't force immediate refetch)
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers(),
        refetchType: "none",
      });

      toast.success(
        t("customer_deleted_successfully") || "Customer deleted successfully",
      );
    },
    onError: (error, id, context) => {
      // Rollback optimistic updates on error
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      if (context?.previousCustomer) {
        queryClient.setQueryData(
          queryKeys.customer(id),
          context.previousCustomer,
        );
      }

      const errorMessage =
        error.response?.data?.message ||
        t("failed_to_delete_customer") ||
        "Failed to delete customer";
      toast.error(errorMessage);
    },
  });
};
