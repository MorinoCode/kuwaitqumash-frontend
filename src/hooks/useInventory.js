import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { queryKeys } from "../config/queryClient";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const useInventory = (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.branch_ids) queryParams.append("branch_ids", filters.branch_ids);
  if (filters.branch_id) queryParams.append("branch_id", filters.branch_id);
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.fabric_type && filters.fabric_type !== "All")
    queryParams.append("fabric_type", filters.fabric_type);
  if (filters.pattern && filters.pattern !== "All")
    queryParams.append("pattern", filters.pattern);
  if (filters.color && filters.color !== "All")
    queryParams.append("color", filters.color);
  if (filters.category && filters.category !== "All")
    queryParams.append("category", filters.category);
  if (filters.country_of_origin && filters.country_of_origin !== "All")
    queryParams.append("country_of_origin", filters.country_of_origin);
  if (filters.unit && filters.unit !== "All")
    queryParams.append("unit", filters.unit);
  if (filters.status) queryParams.append("status", filters.status);
  if (filters.page) queryParams.append("page", filters.page);
  if (filters.limit) queryParams.append("limit", filters.limit || 50);

  const queryString = queryParams.toString();
  const url = `/inventory${queryString ? `?${queryString}` : ""}`;

  return useQuery({
    queryKey: queryKeys.inventory(filters),
    queryFn: async () => {
      const res = await api.get(url);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
  });
};

export const useInventoryItem = (id) => {
  return useQuery({
    queryKey: queryKeys.inventoryItem(id),
    queryFn: async () => {
      const res = await api.get(`/inventory/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useInventoryByBarcode = (barcode) => {
  return useQuery({
    queryKey: queryKeys.inventoryByBarcode(barcode),
    queryFn: async () => {
      const res = await api.get(
        `/inventory?search=${encodeURIComponent(barcode)}`,
      );
      return res.data.data || [];
    },
    enabled: !!barcode && barcode.length > 0,
    staleTime: 1 * 60 * 1000,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "images" && Array.isArray(data[key])) {
          data[key].forEach((file) => {
            formData.append("images", file);
          });
        } else if (data[key] !== null && data[key] !== undefined) {
          if (typeof data[key] === "object") {
            formData.append(key, JSON.stringify(data[key]));
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      const res = await api.post("/inventory", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onMutate: async (newItem) => {

      await queryClient.cancelQueries({ queryKey: queryKeys.inventory() });

      const previousQueries = queryClient.getQueriesData({
        queryKey: queryKeys.inventory(),
      });

      const tempId = `temp_${Date.now()}`;
      const optimisticItem = {
        ...newItem,
        id: tempId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "In Stock",

        images: newItem.images || [],
        quantity: newItem.quantity || 1,
        length_m: parseFloat(newItem.length_m) || 0,
        cost_per_meter: parseFloat(newItem.cost_per_meter) || 0,
      };

      previousQueries.forEach(([queryKey, oldData]) => {
        if (oldData && oldData.data) {
          const [, filters] = queryKey;

          const shouldInclude =
            !filters?.branch_id ||
            !filters?.branch_ids ||
            filters.branch_id === newItem.branch_id ||
            (filters.branch_ids &&
              filters.branch_ids.includes(String(newItem.branch_id)));

          if (shouldInclude) {
            queryClient.setQueryData(queryKey, (old) => {
              if (!old || !old.data) return old;

              const exists = old.data.some(
                (item) =>
                  (typeof item.id === "string" && item.id === tempId) ||
                  (item.barcode && item.barcode === optimisticItem.barcode),
              );

              if (exists) return old;

              return {
                ...old,
                data: [optimisticItem, ...old.data],
                count: old.count + 1,
                pagination: {
                  ...old.pagination,
                  totalItems: (old.pagination?.totalItems || 0) + 1,
                },
              };
            });
          }
        }
      });

      return { previousQueries, tempId };
    },
    onSuccess: (data, variables, context) => {

      const newItem = data.data;
      const tempId = context?.tempId;

      queryClient.setQueriesData({ queryKey: queryKeys.inventory() }, (old) => {
        if (!old || !old.data) return old;

        const filtered = old.data.filter(
          (item) =>
            !(typeof item.id === "string" && item.id === tempId) &&
            item.id !== newItem.id,
        );

        const exists = filtered.some((item) => item.id === newItem.id);

        return {
          ...old,
          data: exists ? filtered : [newItem, ...filtered],
          count: exists ? old.count : Math.max(old.count, filtered.length + 1),
          pagination: {
            ...old.pagination,
            totalItems: exists
              ? old.pagination?.totalItems || 0
              : Math.max(old.pagination?.totalItems || 0, filtered.length + 1),
          },
        };
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.inventory(),
        refetchType: "none",
      });

      toast.success(t("item_added_successfully") || "Item added successfully");
    },
    onError: (error, variables, context) => {

      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }

      const errorMessage =
        error.response?.data?.message ||
        t("failed_to_add_item") ||
        "Failed to add item";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "images" && Array.isArray(data[key])) {
          data[key].forEach((file) => {
            if (file instanceof File) {
              formData.append("images", file);
            }
          });
        } else if (data[key] !== null && data[key] !== undefined) {
          if (typeof data[key] === "object") {
            formData.append(key, JSON.stringify(data[key]));
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      const res = await api.put(`/inventory/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onMutate: async ({ id, data }) => {

      await queryClient.cancelQueries({ queryKey: queryKeys.inventory() });
      await queryClient.cancelQueries({
        queryKey: queryKeys.inventoryItem(id),
      });

      const previousQueries = queryClient.getQueriesData({
        queryKey: queryKeys.inventory(),
      });
      const previousItem = queryClient.getQueryData(
        queryKeys.inventoryItem(id),
      );

      const qtyNum = data.quantity != null ? parseInt(data.quantity, 10) : null;
      const willBecomeInStock = typeof qtyNum === "number" && qtyNum > 0;

      previousQueries.forEach(([queryKey, oldData]) => {
        if (!oldData || !oldData.data) return;
        const filters = queryKey[1] || {};
        const isSoldList = filters.status === "Sold";

        if (isSoldList && willBecomeInStock) {
          const newData = oldData.data.filter((item) => item.id !== id);
          queryClient.setQueryData(queryKey, {
            ...oldData,
            data: newData,
            pagination: oldData.pagination
              ? {
                  ...oldData.pagination,
                  totalItems: Math.max(
                    0,
                    (oldData.pagination.totalItems || 0) - 1,
                  ),
                }
              : oldData.pagination,
          });
        } else {
          queryClient.setQueryData(queryKey, (old) => {
            if (!old || !old.data) return old;
            return {
              ...old,
              data: old.data.map((item) =>
                item.id === id
                  ? { ...item, ...data, updatedAt: new Date().toISOString() }
                  : item,
              ),
            };
          });
        }
      });

      if (previousItem) {
        queryClient.setQueryData(queryKeys.inventoryItem(id), (old) => ({
          ...old,
          ...data,
          updatedAt: new Date().toISOString(),
        }));
      }

      return { previousQueries, previousItem };
    },
    onSuccess: (data, variables) => {
      const updatedItem = data.data;
      const becameInStock = updatedItem?.status === "In Stock";

      const allQueries = queryClient.getQueriesData({
        queryKey: queryKeys.inventory(),
      });
      allQueries.forEach(([queryKey, oldData]) => {
        if (!oldData || !Array.isArray(oldData.data)) return;
        const filters = queryKey[1] || {};
        const isSoldList = filters.status === "Sold";

        if (isSoldList && becameInStock) {
          const newData = oldData.data.filter(
            (item) => item.id !== variables.id,
          );
          queryClient.setQueryData(queryKey, {
            ...oldData,
            data: newData,
            pagination: oldData.pagination
              ? {
                  ...oldData.pagination,
                  totalItems: Math.max(
                    0,
                    (oldData.pagination.totalItems || 0) - 1,
                  ),
                }
              : oldData.pagination,
          });
        } else if (!isSoldList) {
          const exists = oldData.data.some((item) => item.id === variables.id);
          const newData = exists
            ? oldData.data.map((item) =>
                item.id === variables.id ? updatedItem : item,
              )
            : [updatedItem, ...oldData.data];
          queryClient.setQueryData(queryKey, {
            ...oldData,
            data: newData,
            pagination: oldData.pagination
              ? {
                  ...oldData.pagination,
                  totalItems: exists
                    ? oldData.pagination.totalItems
                    : (oldData.pagination.totalItems || 0) + 1,
                }
              : oldData.pagination,
          });
        } else {
          queryClient.setQueryData(queryKey, (old) => {
            if (!old || !old.data) return old;
            return {
              ...old,
              data: old.data.map((item) =>
                item.id === variables.id ? updatedItem : item,
              ),
            };
          });
        }
      });

      queryClient.setQueryData(
        queryKeys.inventoryItem(variables.id),
        updatedItem,
      );

      queryClient.invalidateQueries({
        queryKey: queryKeys.inventoryItem(variables.id),
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.inventory(),
        refetchType: "none",
      });

      toast.success(
        t("item_updated_successfully") || "Item updated successfully",
      );
    },
    onError: (error, variables, context) => {

      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      if (context?.previousItem) {
        queryClient.setQueryData(
          queryKeys.inventoryItem(variables.id),
          context.previousItem,
        );
      }

      const errorMessage =
        error.response?.data?.message ||
        t("failed_to_update_item") ||
        "Failed to update item";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/inventory/${id}`);
      return res.data;
    },
    onMutate: async (id) => {

      await queryClient.cancelQueries({ queryKey: queryKeys.inventory() });
      await queryClient.cancelQueries({
        queryKey: queryKeys.inventoryItem(id),
      });

      const previousQueries = queryClient.getQueriesData({
        queryKey: queryKeys.inventory(),
      });
      const previousItem = queryClient.getQueryData(
        queryKeys.inventoryItem(id),
      );

      previousQueries.forEach(([queryKey, oldData]) => {
        if (oldData && oldData.data) {
          queryClient.setQueryData(queryKey, (old) => {
            if (!old || !old.data) return old;

            const filtered = old.data.filter((item) => item.id !== id);

            return {
              ...old,
              data: filtered,
              count: filtered.length,
              pagination: {
                ...old.pagination,
                totalItems: Math.max(0, (old.pagination?.totalItems || 0) - 1),
              },
            };
          });
        }
      });

      queryClient.removeQueries({ queryKey: queryKeys.inventoryItem(id) });

      return { previousQueries, previousItem };
    },
    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: queryKeys.inventory(),
        refetchType: "none",
      });

      toast.success(
        t("item_deleted_successfully") || "Item deleted successfully",
      );
    },
    onError: (error, id, context) => {

      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      if (context?.previousItem) {
        queryClient.setQueryData(
          queryKeys.inventoryItem(id),
          context.previousItem,
        );
      }

      const errorMessage =
        error.response?.data?.message ||
        t("failed_to_delete_item") ||
        "Failed to delete item";
      toast.error(errorMessage);
    },
  });
};

export const useCustomOptions = (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.type) queryParams.append("type", filters.type);
  if (filters.fabric_type) queryParams.append("fabric_type", filters.fabric_type);
  if (filters.pattern) queryParams.append("pattern", filters.pattern);
  if (filters.color) queryParams.append("color", filters.color);

  const queryString = queryParams.toString();
  const url = `/inventory/custom-options${queryString ? `?${queryString}` : ""}`;

  return useQuery({
    queryKey: ["customOptions", filters],
    queryFn: async () => {
      const res = await api.get(url);
      const data = res.data?.data || res.data || [];
      return Array.isArray(data) ? data : [];
    },
    staleTime: 0,
    gcTime: 5 * 60 * 1000,

    placeholderData: [],
  });
};

export const useSaveCustomOption = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/inventory/custom-options", data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customOptions"] });
      queryClient.refetchQueries({ queryKey: ["customOptions"] });
      toast.success(
        t("custom_option_saved") || "Custom option saved successfully",
      );
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        t("failed_to_save_custom_option") ||
        "Failed to save custom option";
      toast.error(errorMessage);
    },
  });
};
