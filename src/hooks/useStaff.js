import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { queryKeys } from '../config/queryClient';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const useStaff = () => {
  return useQuery({
    queryKey: queryKeys.staff(),
    queryFn: async () => {
      const res = await api.get('/manage/staff');
      return res.data.data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useStaffMember = (id) => {
  return useQuery({
    queryKey: queryKeys.staffMember(id),
    queryFn: async () => {
      const res = await api.get(`/manage/staff/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/manage/staff', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff() });
      toast.success(t('staff_created') || 'Staff created successfully');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || t('failed_to_create_staff') || 'Failed to create staff';
      toast.error(errorMessage);
    }
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/manage/staff/${id}`, data);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staffMember(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.staff() });
      toast.success(t('staff_updated') || 'Staff updated successfully');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || t('failed_to_update_staff') || 'Failed to update staff';
      toast.error(errorMessage);
    }
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/manage/staff/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff() });
      toast.success(t('staff_deleted_successfully') || 'Staff deleted successfully');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || t('failed_to_delete_staff') || 'Failed to delete staff';
      toast.error(errorMessage);
    }
  });
};
