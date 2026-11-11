import { create } from "zustand";
import { persist } from "zustand/middleware";

const getDefaultPayments = () => [
  { method: "K-Net", amount: "", reference: "" },
];

const useSaleDraftStore = create(
  persist(
    (set, get) => ({

      draftByBranch: {},

      getDraft: (branchId) => {
        if (!branchId) {
          return {
            selectedCustomer: null,
            cart: [],
            payments: getDefaultPayments(),
          };
        }
        const draft = get().draftByBranch[branchId];
        if (!draft) {
          return {
            selectedCustomer: null,
            cart: [],
            payments: getDefaultPayments(),
          };
        }
        return {
          selectedCustomer: draft.selectedCustomer ?? null,
          cart: Array.isArray(draft.cart) ? draft.cart : [],
          payments:
            Array.isArray(draft.payments) && draft.payments.length > 0
              ? draft.payments
              : getDefaultPayments(),
        };
      },

      setDraft: (branchId, payload) => {
        if (!branchId) return;
        set((state) => ({
          draftByBranch: {
            ...state.draftByBranch,
            [branchId]: {
              selectedCustomer:
                payload.selectedCustomer !== undefined
                  ? payload.selectedCustomer
                  : state.draftByBranch[branchId]?.selectedCustomer ?? null,
              cart:
                payload.cart !== undefined
                  ? payload.cart
                  : state.draftByBranch[branchId]?.cart ?? [],
              payments:
                payload.payments !== undefined
                  ? payload.payments
                  : state.draftByBranch[branchId]?.payments ??
                    getDefaultPayments(),
            },
          },
        }));
      },

      setSelectedCustomer: (branchId, customer) => {
        if (!branchId) return;
        set((state) => {
          const current = state.draftByBranch[branchId] || {};
          return {
            draftByBranch: {
              ...state.draftByBranch,
              [branchId]: {
                ...current,
                selectedCustomer: customer ?? null,
              },
            },
          };
        });
      },

      setCart: (branchId, cart) => {
        if (!branchId) return;
        set((state) => {
          const current = state.draftByBranch[branchId] || {};
          return {
            draftByBranch: {
              ...state.draftByBranch,
              [branchId]: {
                ...current,
                cart: Array.isArray(cart) ? cart : [],
              },
            },
          };
        });
      },

      setPayments: (branchId, payments) => {
        if (!branchId) return;
        set((state) => {
          const current = state.draftByBranch[branchId] || {};
          return {
            draftByBranch: {
              ...state.draftByBranch,
              [branchId]: {
                ...current,
                payments:
                  Array.isArray(payments) && payments.length > 0
                    ? payments
                    : getDefaultPayments(),
              },
            },
          };
        });
      },

      clearDraft: (branchId) => {
        set((state) => {
          if (!branchId) return state;
          const next = { ...state.draftByBranch };
          delete next[branchId];
          return { draftByBranch: next };
        });
      },

      clearAllDrafts: () => {
        set({ draftByBranch: {} });
      },
    }),
    {
      name: "sale-draft-storage",
      partialize: (state) => ({ draftByBranch: state.draftByBranch }),
    }
  )
);

export default useSaleDraftStore;
