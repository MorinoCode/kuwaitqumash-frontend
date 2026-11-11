import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { queryKeys } from "../config/queryClient";

export const useDashboardOwner = (dateRange = null) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [
      ...queryKeys.dashboard("owner"),
      dateRange?.start,
      dateRange?.end,
      dateRange?.range,
    ],
    queryFn: async () => {
      const params = {};
      if (dateRange?.start && dateRange?.end) {
        params.startDate = dateRange.start;
        params.endDate = dateRange.end;
      }
      const res = await api.get("/dashboard/owner", { params });
      if (res.data?.success && res.data?.data) return res.data.data;
      if (res.data?.data) return res.data.data;
      return {};
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: [
        ...queryKeys.dashboard("owner"),
        dateRange?.start,
        dateRange?.end,
        dateRange?.range,
      ],
    });
  };

  return { ...query, refresh };
};

export const useDashboardManager = (dateRange = null) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [
      ...queryKeys.dashboard("manager"),
      dateRange?.start,
      dateRange?.end,
      dateRange?.range,
    ],
    queryFn: async () => {
      const params = {};
      if (dateRange?.start && dateRange?.end) {
        params.startDate = dateRange.start;
        params.endDate = dateRange.end;
      }
      const res = await api.get("/dashboard/manager", { params });
      return res.data?.data || {};
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: [
        ...queryKeys.dashboard("manager"),
        dateRange?.start,
        dateRange?.end,
        dateRange?.range,
      ],
    });
  };

  return { ...query, refresh };
};

export const useDashboardSalesman = (dateRange = null) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [
      ...queryKeys.dashboard("salesman"),
      dateRange?.start,
      dateRange?.end,
      dateRange?.range,
    ],
    queryFn: async () => {
      const params = {};
      if (dateRange?.start && dateRange?.end) {
        params.startDate = dateRange.start;
        params.endDate = dateRange.end;
      }
      const res = await api.get("/dashboard/salesman", { params });
      return res.data?.data || {};
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: [
        ...queryKeys.dashboard("salesman"),
        dateRange?.start,
        dateRange?.end,
        dateRange?.range,
      ],
    });
  };

  return { ...query, refresh };
};
