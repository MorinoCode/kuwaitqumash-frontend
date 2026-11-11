/**
 * Branch Store using Zustand
 * Manages active branch state with localStorage persistence and cross-tab sync
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getStorageItem, setStorageItem } from "../utils/storage";

const useBranchStore = create(
  persist(
    (set, get) => ({
      activeBranchId: null,
      activeBranchName: null,
      branches: [],

      setActiveBranch: (branch) => {
        set({
          activeBranchId: branch?.id || null,
          activeBranchName: branch?.name || null,
        });

        // Dispatch event for same-tab listeners
        window.dispatchEvent(
          new CustomEvent("branchChanged", {
            detail: { branchId: branch?.id, branchName: branch?.name },
          }),
        );
      },

      setBranches: (branches) => {
        set({ branches });
      },

      clearBranch: () => {
        set({
          activeBranchId: null,
          activeBranchName: null,
        });
      },

      // Completely reset storage (for logout)
      resetStorage: () => {
        try {
          localStorage.removeItem("branch-storage");
          set({
            activeBranchId: null,
            activeBranchName: null,
            branches: [],
          });
        } catch {
          // Silently ignore clear errors
        }
      },

      // Sync with server - validate branch exists
      validateBranch: async (branchId, api) => {
        if (!branchId) return false;

        try {
          const branches = get().branches;
          if (branches.length === 0) {
            // Fetch branches if not loaded
            const res = await api.get("/manage/branches");
            const fetchedBranches = res.data.data || [];
            get().setBranches(fetchedBranches);

            const branch = fetchedBranches.find((b) => b.id === branchId);
            if (!branch) {
              get().clearBranch();
              return false;
            }
            return true;
          }

          const branch = branches.find((b) => b.id === branchId);
          if (!branch) {
            get().clearBranch();
            return false;
          }
          return true;
        } catch {
          // Silently ignore validation errors
          return false;
        }
      },
    }),
    {
      name: "branch-storage",
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
        activeBranchId: state.activeBranchId,
        activeBranchName: state.activeBranchName,
      }),
    },
  ),
);

// Listen for storage changes (cross-tab sync)
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "branch-storage" && e.newValue) {
      try {
        const newState = JSON.parse(e.newValue);
        useBranchStore.setState({
          activeBranchId: newState.state?.activeBranchId || null,
          activeBranchName: newState.state?.activeBranchName || null,
        });
      } catch {
        // Silently ignore storage parse errors
      }
    }
  });
}

export default useBranchStore;
