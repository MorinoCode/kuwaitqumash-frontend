import axios from 'axios';
import useTenantStore from '../store/tenantStore';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const cleanApiUrl = rawApiUrl.replace(/\/+$/, '').replace(/\/api$/, '');

const instance = axios.create({
    baseURL: `${cleanApiUrl}/api`,
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
        const warning = response.headers?.['x-subscription-warning'];
        const expiringSoon = response.headers?.['x-subscription-expiring-soon'];
        const expiresAt = response.headers?.['x-subscription-expires-at'];
        const graceEndsAt = response.headers?.['x-subscription-grace-ends-at'];

        if (warning || expiringSoon) {
            useTenantStore.getState().setSubscriptionWarning?.({
                type: warning || (expiringSoon ? 'expiring_soon' : null),
                expiresAt,
                graceEndsAt,
                isReadonly: response.headers?.['x-subscription-readonly'] === 'true',
            });
        } else if (useTenantStore.getState().subscriptionWarning) {
            useTenantStore.getState().clearSubscriptionWarning?.();
        }
        return response;
    },
    (error) => {
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            return Promise.reject(error);
        }

        if (error.response?.status === 403) {
            const code = error.response.data?.code;
            if (code === 'SUBSCRIPTION_EXPIRED_READONLY') {
                useTenantStore.getState().setSubscriptionWarning?.({
                    type: 'expired_readonly',
                    isReadonly: true,
                });
            } else if (code === 'SUBSCRIPTION_INACTIVE') {
                useTenantStore.getState().setSubscriptionWarning?.({
                    type: 'expired_readonly',
                    isReadonly: true,
                    inactive: true,
                });
            }
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

export const apiBaseURL = instance.defaults.baseURL || 'http://localhost:5001/api';
export default instance;
