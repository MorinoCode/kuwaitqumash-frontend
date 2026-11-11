/**
 * Custom hook for branch queries using React Query
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { queryKeys } from "../config/queryClient";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import useBranchStore from "../store/branchStore";

export const useBranches = (enabled = true) => {
  // Get cached branches from Zustand store as fallback
  const cachedBranches = useBranchStore((state) => state.branches);

  const query = useQuery({
    queryKey: queryKeys.branches(),
    queryFn: async () => {
      const res = await api.get("/manage/branches");
      const branches = res.data.data || [];

      // Update Zustand store
      useBranchStore.getState().setBranches(branches);

      return branches;
    },
    enabled: enabled, // enabled is passed from parent (BranchContext checks auth)
    staleTime: 10 * 60 * 1000, // 10 minutes (branches don't change often)
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    retry: (failureCount, error) => {
      // Don't retry on 401/403 errors (authentication errors)
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      // Retry other errors up to 3 times
      return failureCount < 3;
    },
  });

  // Return query with fallback to cached branches if query is disabled and has no data
  const shouldUseCache = !enabled && !query.data && cachedBranches.length > 0;

  return {
    ...query,
    data: query.data ?? (shouldUseCache ? cachedBranches : undefined),
    isLoading: enabled ? query.isLoading : false, // Only show loading if query is enabled
  };
};

export const useBranch = (id) => {
  return useQuery({
    queryKey: queryKeys.branch(id),
    queryFn: async () => {
      const res = await api.get(`/manage/branches/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/manage/branches", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.branches() });
      toast.success(
        t("branch_added_successfully") || "Branch added successfully",
      );
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        t("failed_to_add_branch") ||
        "Failed to add branch";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/manage/branches/${id}`, data);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.branch(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.branches() });
      toast.success(
        t("branch_updated_successfully") || "Branch updated successfully",
      );
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        t("failed_to_update_branch") ||
        "Failed to update branch";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/manage/branches/${id}`);
      return { ...res.data, deletedId: id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.branches() });
      // Clear active branch if it was deleted
      const activeBranchId = useBranchStore.getState().activeBranchId;
      if (activeBranchId === data.deletedId) {
        useBranchStore.getState().clearBranch();
      }
      toast.success(
        t("branch_deleted_successfully") || "Branch deleted successfully",
      );
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        t("failed_to_delete_branch") ||
        "Failed to delete branch";
      toast.error(errorMessage);
    },
  });
};
