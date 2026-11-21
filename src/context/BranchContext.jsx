import React, { createContext, useContext, useEffect, useMemo } from "react";
import useBranchStore from "../store/branchStore";
import { useBranches } from "../hooks/useBranches";
import { useAuth } from "./AuthContext";
import api from "../api/axios";

const BranchContext = createContext();

export const BranchProvider = ({ children }) => {
  const activeBranchId = useBranchStore((s) => s.activeBranchId);
  const activeBranchName = useBranchStore((s) => s.activeBranchName);
  const setActiveBranch = useBranchStore((s) => s.setActiveBranch);
  const validateBranch = useBranchStore((s) => s.validateBranch);
  const setBranches = useBranchStore((s) => s.setBranches);

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

  const value = useMemo(
    () => ({
      activeBranchId,
      activeBranchName,
      setActiveBranch,
      branches,
      isLoading,
    }),
    [activeBranchId, activeBranchName, setActiveBranch, branches, isLoading],
  );

  return (
    <BranchContext.Provider value={value}>{children}</BranchContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    return useBranchStore.getState();
  }
  return context;
};
