import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import api from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useBranchStore from "../store/branchStore";
import useTenantStore from "../store/tenantStore";
import useSaleDraftStore from "../store/saleDraftStore";

const AuthContext = createContext();

const clearAuthData = (queryClient) => {
  if (queryClient) {
    try {
      queryClient.clear();
    } catch {
      // ignore
    }
  }

  try {
    useBranchStore.getState().resetStorage?.();
    useTenantStore.getState().resetStorage?.();
  } catch {
    try {
      localStorage.removeItem("branch-storage");
      localStorage.removeItem("tenant-storage");
    } catch {
      // ignore
    }
  }

  try {
    localStorage.removeItem("sale-draft-storage");
    useSaleDraftStore.getState().clearAllDrafts?.();
  } catch {
    // ignore
  }

  const authKeys = [
    "user_data",
    "tenant_id",
    "active_branch_id",
    "active_branch_name",
    "active_store_id",
    "token",
    "authToken",
  ];

  authKeys.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  });

  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.includes("TanstackQueryDevtools") ||
          key.includes("react-query") ||
          key.includes("queryClient") ||
          key.startsWith("6cb1f90cba489c85caa3c2ee6ebd0ccc") ||
          key.includes("mcg_invalid_code_matched_list"))
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
    });
  } catch {
    // ignore
  }

  try {
    localStorage.removeItem("branch-storage");
    localStorage.removeItem("tenant-storage");
    localStorage.removeItem("sale-draft-storage");
  } catch {
    // ignore
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    abortControllerRef.current = new AbortController();
    const nav = navigate;
    const pathname = location.pathname;
    const qc = queryClient;

    const checkLoggedIn = async () => {
      try {
        const res = await api.get("/auth/me", {
          signal: abortControllerRef.current?.signal,
        });

        if (!isMountedRef.current) return;

        const userData = res.data?.data || res.data;

        if (userData && typeof userData === "object") {
          setUser(userData);
          if (userData.tenant_id != null) {
            useTenantStore
              .getState()
              .setTenant(userData.tenant_id, userData.tenant_name ?? null);
          }
        } else {
          setUser(null);
          clearAuthData(qc);
        }
      } catch (err) {
        if (!isMountedRef.current) return;

        if (err.name === "CanceledError" || err.name === "AbortError") {
          return;
        }

        if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
          setLoading(false);
          return;
        }

        const status = err.response?.status;
        const isUnauthorized = status === 401 || status === 403;

        if (isUnauthorized) {
          setUser(null);
          clearAuthData(qc);

          if (
            pathname !== "/login" &&
            pathname !== "/signup" &&
            pathname !== "/"
          ) {
            nav("/login", { replace: true });
          }
        } else if (status === 400) {
          const errorMessage = err.response.data?.message || "";
          if (
            errorMessage.includes("tenant") ||
            errorMessage.includes("Tenant")
          ) {
            setUser(null);
            clearAuthData(qc);
            if (
              pathname !== "/login" &&
              pathname !== "/signup" &&
              pathname !== "/"
            ) {
              nav("/login", { replace: true });
            }
          }
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    checkLoggedIn();

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [navigate, location.pathname, queryClient]);

  const login = (userData) => {
    if (!userData || typeof userData !== "object") {
      return;
    }

    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }

    setUser(userData);
    navigate("/home", { replace: true });
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // continue with logout even if API call fails
    } finally {
      setUser(null);
      clearAuthData(queryClient);
      navigate("/login", { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
