/**
 * Tenant Store using Zustand
 * Manages tenant state with localStorage persistence
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getStorageItem, setStorageItem } from "../utils/storage";

const useTenantStore = create(
  persist(
    (set) => ({
      tenantId: null,
      tenantName: null,

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
        });
      },

      // Completely reset storage (for logout)
      resetStorage: () => {
        try {
          localStorage.removeItem("tenant-storage");
          set({
            tenantId: null,
            tenantName: null,
          });
        } catch {
          // Silently ignore reset errors
        }
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
          } catch {
            // Silently ignore parse errors
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch {
            // Silently ignore removal errors
          }
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
