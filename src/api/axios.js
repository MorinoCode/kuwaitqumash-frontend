import axios from 'axios';
import useTenantStore from '../store/tenantStore';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api',
    withCredentials: true,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.interceptors.request.use(
    (config) => {
        const tenantId = useTenantStore.getState().tenantId;

        if (tenantId && tenantId.trim()) {
            config.headers['x-tenant-id'] = tenantId.trim();
        }

        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            return Promise.reject(error);
        }

        if (error.response && error.response.status === 400) {
            const errorMessage = error.response.data?.message || '';

            if (errorMessage.includes('tenant') || errorMessage.includes('Tenant')) {

                const tenantId = useTenantStore.getState().tenantId;
                if (!tenantId || tenantId.trim() === '') {
                    useTenantStore.getState().clearTenant();
                }
            }
        }

        return Promise.reject(error);
    }
);

export const apiBaseURL = instance.defaults.baseURL || 'http://localhost:5000/api';
export default instance;
