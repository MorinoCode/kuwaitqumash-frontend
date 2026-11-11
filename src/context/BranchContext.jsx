import React, { createContext, useContext, useEffect } from "react";
import useBranchStore from "../store/branchStore";
import { useBranches } from "../hooks/useBranches";
import { useAuth } from "./AuthContext";
import api from "../api/axios";

const BranchContext = createContext();

export const BranchProvider = ({ children }) => {
  const {
    activeBranchId,
    activeBranchName,
    setActiveBranch,
    validateBranch,
    setBranches,
  } = useBranchStore();

  const { user } = useAuth();
  const isAuthenticated = !!user;

  const { data: branches = [], isLoading } = useBranches(isAuthenticated);

  useEffect(() => {
    if (branches.length > 0) {
      setBranches(branches);
    }
  }, [branches, setBranches]);

  useEffect(() => {
    if (!isLoading && branches.length > 0 && activeBranchId) {
      validateBranch(activeBranchId, api).then((isValid) => {
        if (!isValid) {

          const defaultBranch = branches.find((b) => b.is_main) || branches[0];
          if (defaultBranch) {
            setActiveBranch(defaultBranch);
          }
        }
      });
    }
  }, [branches, isLoading, activeBranchId, validateBranch, setActiveBranch]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "branch-storage" && e.newValue) {
        try {
          const newState = JSON.parse(e.newValue);
          if (newState.state) {

          }
        } catch { void 0; }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const value = {
    activeBranchId,
    activeBranchName,
    setActiveBranch,
    branches,
    isLoading,
  };

  return (
    <BranchContext.Provider value={value}>{children}</BranchContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBranch = () => {
  const context = useContext(BranchContext);
  const storeValue = useBranchStore();
  if (!context) {

    return storeValue;
  }
  return context;
};
