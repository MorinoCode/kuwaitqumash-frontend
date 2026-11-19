import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getStorageItem, setStorageItem } from "../utils/storage";

const useTenantStore = create(
  persist(
    (set) => ({
      tenantId: null,
      tenantName: null,
      subscriptionWarning: null,

      setSubscriptionWarning: (warning) => {
        set({ subscriptionWarning: warning });
      },

      clearSubscriptionWarning: () => {
        set({ subscriptionWarning: null });
      },

      setTenant: (tenantId, tenantName = null) => {
        set({
          tenantId,
          tenantName,
        });
      },

      clearTenant: () => {
        set({
          tenantId: null,
          tenantName: null,
          subscriptionWarning: null,
        });
      },

      resetStorage: () => {
        try {
          localStorage.removeItem("tenant-storage");
          set({
            tenantId: null,
            tenantName: null,
            subscriptionWarning: null,
          });
        } catch { void 0; }
      },
    }),
    {
      name: "tenant-storage",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const value = getStorageItem(name);
          return value ? JSON.stringify(value) : null;
        },
        setItem: (name, value) => {
          try {
            const parsed = JSON.parse(value);
            setStorageItem(name, parsed);
          } catch { void 0; }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch { void 0; }
        },
      })),
      partialize: (state) => ({
        tenantId: state.tenantId,
        tenantName: state.tenantName,
      }),
    },
  ),
);

export default useTenantStore;
