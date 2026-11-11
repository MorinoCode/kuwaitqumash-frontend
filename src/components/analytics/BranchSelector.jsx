import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./BranchSelector.css";

const BranchSelector = ({ branches, selectedBranches, onSelectionChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getBranchDisplayName = (branch) => {
    if (!branch || !branch.name) return "";

    return branch.name.replace(/^KuwaitQumash\s+/i, "");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectAll = () => {
    if (selectedBranches.length === branches.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(branches.map((b) => b.id));
    }
  };

  const handleBranchToggle = (branchId) => {
    if (selectedBranches.includes(branchId)) {
      onSelectionChange(selectedBranches.filter((id) => id !== branchId));
    } else {
      onSelectionChange([...selectedBranches, branchId]);
    }
  };

  const getDisplayText = () => {
    if (selectedBranches.length === 0) {
      return t("select_branches") || "Select Branches";
    }
    if (selectedBranches.length === branches.length) {
      return t("all_branches");
    }
    if (selectedBranches.length === 1) {
      const selectedBranch = branches.find((b) => b.id === selectedBranches[0]);
      return selectedBranch
        ? getBranchDisplayName(selectedBranch)
        : t("branches_selected", { count: 1, total: branches.length });
    }
    return t("branches_selected", {
      count: selectedBranches.length,
      total: branches.length,
    });
  };

  return (
    <div className="branch-selector" ref={dropdownRef}>
      <button className="branch-selector-toggle" onClick={handleToggle}>
        <span>{getDisplayText()}</span>
        <svg
          className={`dropdown-icon ${isOpen ? "open" : ""}`}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </button>

      {isOpen && (
        <div className="branch-selector-dropdown">
          <div className="branch-option" onClick={handleSelectAll}>
            <input
              type="checkbox"
              checked={selectedBranches.length === branches.length}
              onChange={handleSelectAll}
              onClick={(e) => e.stopPropagation()}
            />
            <span className="branch-option-label">{t("all_branches")}</span>
          </div>
          <div className="branch-divider"></div>
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="branch-option"
              onClick={() => handleBranchToggle(branch.id)}
            >
              <input
                type="checkbox"
                checked={selectedBranches.includes(branch.id)}
                onChange={() => handleBranchToggle(branch.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="branch-option-label">
                {getBranchDisplayName(branch)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BranchSelector;
