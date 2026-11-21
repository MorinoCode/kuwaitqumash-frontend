import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
  useMemo,
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
    } catch { void 0; }
  }

  try {
    useBranchStore.getState().resetStorage?.();
    useTenantStore.getState().resetStorage?.();
  } catch {
    try {
      localStorage.removeItem("branch-storage");
      localStorage.removeItem("tenant-storage");
    } catch { void 0; }
  }

  try {
    localStorage.removeItem("sale-draft-storage");
    useSaleDraftStore.getState().clearAllDrafts?.();
  } catch { void 0; }

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
    } catch { void 0; }
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
      } catch { void 0; }
    });
  } catch { void 0; }

  try {
    localStorage.removeItem("branch-storage");
    localStorage.removeItem("tenant-storage");
    localStorage.removeItem("sale-draft-storage");
  } catch { void 0; }
};

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/contact",
  "/privacy",
  "/terms",
];

const isPublicPath = (pathname) => {
  if (!pathname) return false;
  return (
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_PATHS.some((p) => p !== "/" && pathname.startsWith(p))
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const navigateRef = useRef(navigate);
  const queryClientRef = useRef(queryClient);
  const pathnameRef = useRef(location.pathname);
  const hadNetworkErrorRef = useRef(false);

  navigateRef.current = navigate;
  queryClientRef.current = queryClient;
  pathnameRef.current = location.pathname;

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");
      const tenantId = useTenantStore.getState().tenantId;

      if (!token && !tenantId && isPublicPath(pathnameRef.current)) {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await api.get("/auth/me", {
          signal: controller.signal,
        });

        if (cancelled) return;

        const userData = res.data?.data || res.data;

        if (userData && typeof userData === "object") {
          hadNetworkErrorRef.current = false;
          setUser(userData);
          if (userData.tenant_id != null) {
            useTenantStore
              .getState()
              .setTenant(userData.tenant_id, userData.tenant_name ?? null);
          }
        } else {
          setUser(null);
          clearAuthData(queryClientRef.current);
        }
      } catch (err) {
        if (cancelled) return;

        if (err.name === "CanceledError" || err.name === "AbortError") {
          return;
        }

        if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
          hadNetworkErrorRef.current = true;
          setLoading(false);
          return;
        }

        const status = err.response?.status;
        const isUnauthorized = status === 401 || status === 403;

        if (isUnauthorized) {
          setUser(null);
          clearAuthData(queryClientRef.current);
          if (!isPublicPath(pathnameRef.current)) {
            navigateRef.current("/login", { replace: true });
          }
        } else if (status === 400) {
          const errorMessage = err.response.data?.message || "";
          if (
            errorMessage.includes("tenant") ||
            errorMessage.includes("Tenant")
          ) {
            setUser(null);
            clearAuthData(queryClientRef.current);
            if (!isPublicPath(pathnameRef.current)) {
              navigateRef.current("/login", { replace: true });
            }
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    checkLoggedIn();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (loading || hadNetworkErrorRef.current) return;
    if (!user && !isPublicPath(location.pathname)) {
      navigate("/login", { replace: true });
    }
  }, [loading, user, location.pathname, navigate]);

  const login = useCallback((userData) => {
    if (!userData || typeof userData !== "object") {
      return;
    }

    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }

    hadNetworkErrorRef.current = false;
    setUser(userData);
    navigate("/home", { replace: true });
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch { void 0; } finally {
      hadNetworkErrorRef.current = false;
      setUser(null);
      clearAuthData(queryClient);
      navigate("/login", { replace: true });
    }
  }, [navigate, queryClient]);

  const contextValue = useMemo(
    () => ({ user, login, logout, loading }),
    [user, login, logout, loading],
  );

  return (
    <AuthContext.Provider value={contextValue}>
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
