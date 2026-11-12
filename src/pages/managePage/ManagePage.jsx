import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import {
  useBranches,
  useCreateBranch,
  useUpdateBranch,
  useDeleteBranch,
} from "../../hooks/useBranches";
import {
  useStaff,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
} from "../../hooks/useStaff";
import "./ManagePage.css";
import {
  Building,
  Users,
  Plus,
  Trash2,
  MapPin,
  Phone,
  X,
  Edit,
  Search,
  ShieldAlert,
  MessageSquare,
} from "lucide-react";

const ManagePage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, loading: authLoading } = useAuth();

  const [activeTabState, setActiveTabState] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const activeTab =
    activeTabState || (user?.role === "store_owner" ? "branches" : "staff");

  const handleTabChange = (tab) => {
    setActiveTabState(tab);
    setSearchTerm("");
  };

  const { data: branches = [], isLoading: branchesLoading } = useBranches();
  const createBranchMutation = useCreateBranch();
  const updateBranchMutation = useUpdateBranch();
  const deleteBranchMutation = useDeleteBranch();

  const { data: staffList = [], isLoading: dataLoading } = useStaff();
  const createStaffMutation = useCreateStaff();
  const updateStaffMutation = useUpdateStaff();
  const deleteStaffMutation = useDeleteStaff();

  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [branchForm, setBranchForm] = useState({
    id: null,
    name: "",
    location: "",
    phone: "",
  });
  const [staffForm, setStaffForm] = useState({
    username: "",
    password: "",
    full_name: "",
    branch_id: "",
    role: "sales_man",
  });

  const canEditStaff = (staffMember) => {
    if (!user) return false;

    if (user.role === "store_owner") return true;

    if (user.role === "branch_manager") {
      if (staffMember.role === "store_owner") return false;
      const managerBranchId = user.branch?.id || user.branch_id;
      const staffBranchId = staffMember.branch?.id || staffMember.branch_id;
      return managerBranchId == staffBranchId;
    }
    return false;
  };

  const handleSaveBranch = async (e) => {
    e.preventDefault();

    if (!branchForm.name || branchForm.name.trim().length < 2) {
      toast.error(
        t("branch_name_required") ||
          "Branch name must be at least 2 characters",
      );
      return;
    }
    if (!branchForm.location || branchForm.location.trim().length < 2) {
      toast.error(
        t("location_required") || "Location must be at least 2 characters",
      );
      return;
    }

    try {
      const payload = {
        name: branchForm.name.trim(),
        location: branchForm.location.trim(),
        phone: branchForm.phone?.trim() || "",
      };

      if (branchForm.id) {
        await updateBranchMutation.mutateAsync({
          id: branchForm.id,
          data: payload,
        });
      } else {
        await createBranchMutation.mutateAsync(payload);
      }
      setIsBranchModalOpen(false);
      setBranchForm({ id: null, name: "", location: "", phone: "" });
    } catch (err) {
      const errorMsg = err.response?.data?.message || t("error_saving_branch");
      toast.error(errorMsg);
    }
  };

  const handleDeleteBranch = async (id) => {
    if (!id || isNaN(parseInt(id))) {
      toast.error(t("invalid_branch_id") || "Invalid branch ID");
      return;
    }

    if (!window.confirm(t("confirm_delete_branch"))) return;
    try {
      await deleteBranchMutation.mutateAsync(id);

    } catch { void 0; }
  };

  const openEditBranch = (branch) => {
    setBranchForm(branch);
    setIsBranchModalOpen(true);
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();

    if (!staffForm.full_name || staffForm.full_name.trim().length < 2) {
      toast.error(
        t("full_name_required") || "Full name must be at least 2 characters",
      );
      return;
    }
    if (!staffForm.username || staffForm.username.trim().length < 3) {
      toast.error(
        t("username_required") || "Username must be at least 3 characters",
      );
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(staffForm.username.trim())) {
      toast.error(
        t("username_invalid") ||
          "Username can only contain letters, numbers, and underscores",
      );
      return;
    }
    if (
      !editingStaff &&
      (!staffForm.password || staffForm.password.length < 6)
    ) {
      toast.error(
        t("password_min_length") || "Password must be at least 6 characters",
      );
      return;
    }
    if (!staffForm.branch_id && user?.role === "store_owner") {
      toast.error(t("branch_required") || "Please select a branch");
      return;
    }

    try {
      const payload = {
        full_name: staffForm.full_name.trim(),
        username: staffForm.username.trim().toLowerCase(),
        role: staffForm.role,
        branch_id: staffForm.branch_id || null,
      };

      if (staffForm.password) {
        payload.password = staffForm.password;
      }

      if (editingStaff) {
        await updateStaffMutation.mutateAsync({
          id: editingStaff.id,
          data: payload,
        });
      } else {
        await createStaffMutation.mutateAsync(payload);
      }
      setIsStaffModalOpen(false);
      setEditingStaff(null);

      const defaultBranchId =
        user?.role === "branch_manager"
          ? user.branch?.id || user.branch_id
          : "";

      setStaffForm({
        username: "",
        password: "",
        full_name: "",
        branch_id: defaultBranchId,
        role: "sales_man",
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || t("error_saving_staff");
      toast.error(errorMsg);
    }
  };

  const openEditStaff = (staff) => {
    setEditingStaff(staff);

    const staffBranchId = staff.branch?.id || staff.branch_id || "";
    const userBranchId = user?.branch?.id || user?.branch_id;

    setStaffForm({
      username: staff.username,
      full_name: staff.full_name,
      branch_id:
        staffBranchId || (user?.role === "branch_manager" ? userBranchId : ""),
      role: staff.role,
      password: "",
    });
    setIsStaffModalOpen(true);
  };

  const handleDeleteStaff = async (id, role, e) => {
    e.stopPropagation();

    if (!id || isNaN(parseInt(id))) {
      toast.error(t("invalid_staff_id") || "Invalid staff ID");
      return;
    }

    if (role === "store_owner") {
      toast.error(t("cannot_delete_owner"));
      return;
    }

    if (id === user?.id) {
      toast.error(
        t("cannot_delete_self") || "You cannot delete your own account",
      );
      return;
    }

    if (!window.confirm(t("confirm_delete_staff"))) return;
    try {
      await deleteStaffMutation.mutateAsync(id);

    } catch { void 0; }
  };

  if (authLoading || !user || branchesLoading) {
    return (
      <div className={`manage-page manage-page--${theme} manage-page--loading`}>
        <div className="manage-page__loader"></div>
      </div>
    );
  }

  const filteredBranches = (branches || []).filter((b) => {
    if (!b) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      b.name?.toLowerCase().includes(searchLower) ||
      false ||
      b.location?.toLowerCase().includes(searchLower) ||
      false
    );
  });

  const filteredStaff = (staffList || []).filter((s) => {
    if (!s) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      s.full_name?.toLowerCase().includes(searchLower) ||
      false ||
      s.username?.toLowerCase().includes(searchLower) ||
      false
    );
  });

  return (
    <div
      className={`manage-page manage-page--${theme}`}
      dir={i18n.language === "ar" || i18n.language === "fa" ? "rtl" : "ltr"}
    >
      <header className="manage-header">
        <h1 className="manage-header__title">{t("system_management")}</h1>
        <div className="manage-header__tabs">
          <button
            className={`manage-tab ${activeTab === "branches" ? "manage-tab--active" : ""}`}
            onClick={() => handleTabChange("branches")}
          >
            <Building size={18} /> {t("branches")}
          </button>
          <button
            className={`manage-tab ${activeTab === "staff" ? "manage-tab--active" : ""}`}
            onClick={() => handleTabChange("staff")}
          >
            <Users size={18} /> {t("staff")}
          </button>
          {user?.role === "store_owner" && (
            <button
              className="manage-tab"
              onClick={() => navigate("/admin/messages")}
            >
              <MessageSquare size={18} /> {t("contact_inbox.title")}
            </button>
          )}
        </div>
      </header>

      <div className="manage-content">
        <div className="manage-controls">
          <div className="manage-search">
            <Search size={18} className="manage-search__icon" />
            <input
              className="manage-search__input"
              placeholder={
                activeTab === "branches"
                  ? t("search_branches")
                  : t("search_staff")
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {(user?.role === "store_owner" && activeTab === "branches") ||
          activeTab === "staff" ? (
            <button
              className="manage-btn manage-btn--primary"
              onClick={() => {
                if (activeTab === "branches") {
                  setBranchForm({
                    id: null,
                    name: "",
                    location: "",
                    phone: "",
                  });
                  setIsBranchModalOpen(true);
                } else {
                  setEditingStaff(null);
                  const defaultBranchId =
                    user?.role === "branch_manager"
                      ? user.branch?.id || user.branch_id
                      : "";
                  setStaffForm({
                    username: "",
                    password: "",
                    full_name: "",
                    branch_id: defaultBranchId,
                    role: "sales_man",
                  });
                  setIsStaffModalOpen(true);
                }
              }}
            >
              <Plus size={18} /> {t("add")}{" "}
              {activeTab === "branches" ? t("branch") : t("staff_member")}
            </button>
          ) : null}
        </div>

        {activeTab === "branches" && (
          <div className="manage-tab-content">
            <div className="manage-grid">
              {filteredBranches.length > 0 ? (
                filteredBranches.map((branch) => (
                  <div
                    key={branch.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/manage/branch/${branch.id}`)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      navigate(`/manage/branch/${branch.id}`)
                    }
                    className={`manage-card manage-card--clickable ${branch.is_main ? "manage-card--main" : ""}`}
                  >
                    <div
                      className={`manage-card__icon ${branch.is_main ? "manage-card__icon--brand" : ""}`}
                    >
                      <Building size={24} />
                    </div>
                    <div className="manage-card__info">
                      <div className="manage-card__header">
                        <h3>{branch.name || "-"}</h3>
                        {branch.is_main && (
                          <span className="manage-badge manage-badge--main">
                            {t("hq")}
                          </span>
                        )}
                      </div>
                      <p>
                        <MapPin size={14} /> {branch.location || "-"}
                      </p>
                      <p>
                        <Phone size={14} /> {branch.phone || "-"}
                      </p>
                    </div>
                    <div
                      className="manage-card__actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {user?.role === "store_owner" && (
                        <>
                          <button
                            onClick={() => openEditBranch(branch)}
                            className="manage-action-btn manage-action-btn--edit"
                            title={t("edit")}
                          >
                            <Edit size={16} />
                          </button>
                          {!branch.is_main && (
                            <button
                              onClick={() => handleDeleteBranch(branch.id)}
                              className="manage-action-btn manage-action-btn--delete"
                              title={t("delete")}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    gridColumn: "1/-1",
                    textAlign: "center",
                    padding: "2rem",
                    opacity: 0.5,
                  }}
                >
                  {t("no_branches_found") || "No branches found"}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "staff" && (
          <div className="manage-tab-content">
            {dataLoading ? (
              <div className="manage-loader-wrapper">
                <div className="manage-loader"></div>
                <span>{t("loading_staff")}</span>
              </div>
            ) : (
              <div className="manage-table-wrapper">
                <table className="manage-table">
                  <thead className="manage-table__head">
                    <tr>
                      <th>{t("name")}</th>
                      <th>{t("username")}</th>
                      <th>{t("role")}</th>
                      <th>{t("branch")}</th>
                      <th>{t("action")}</th>
                    </tr>
                  </thead>
                  <tbody className="manage-table__body">
                    {filteredStaff.length > 0 ? (
                      filteredStaff.map((staff) => (
                        <tr
                          key={staff.id}
                          onClick={() =>
                            canEditStaff(staff) &&
                            navigate(`/manage/staff/${staff.id}`)
                          }
                          className="manage-table__row"
                        >
                          <td
                            className="manage-table__cell manage-table__cell--bold"
                            data-label={t("name")}
                          >
                            {staff.full_name || "-"}
                          </td>
                          <td
                            className="manage-table__cell"
                            data-label={t("username")}
                          >
                            {staff.username || "-"}
                          </td>
                          <td
                            className="manage-table__cell"
                            data-label={t("role")}
                          >
                            <span
                              className={`manage-badge manage-badge--${staff.role || "sales_man"}`}
                            >
                              {t(staff.role || "sales_man")}
                            </span>
                          </td>
                          <td
                            className="manage-table__cell"
                            data-label={t("branch")}
                          >
                            {staff.branch ? (
                              staff.branch.name
                            ) : (
                              <span className="manage-text-muted">
                                {t("no_branch")}
                              </span>
                            )}
                          </td>
                          <td
                            className="manage-table__cell"
                            data-label={t("action")}
                          >
                            <div className="manage-table__actions">
                              {canEditStaff(staff) ? (
                                <button
                                  className="manage-action-btn manage-action-btn--edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditStaff(staff);
                                  }}
                                  title={t("edit")}
                                >
                                  <Edit size={16} />
                                </button>
                              ) : null}

                              {staff.role !== "store_owner" &&
                              staff.id !== user?.id &&
                              (user?.role === "store_owner" ||
                                canEditStaff(staff)) ? (
                                <button
                                  className="manage-action-btn manage-action-btn--delete"
                                  onClick={(e) =>
                                    handleDeleteStaff(staff.id, staff.role, e)
                                  }
                                  title={t("delete")}
                                >
                                  <Trash2 size={16} />
                                </button>
                              ) : (
                                <div
                                  className="manage-icon-protected"
                                  title={t("protected_account")}
                                >
                                  <ShieldAlert size={16} />
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="manage-table__cell"
                          style={{
                            textAlign: "center",
                            opacity: 0.5,
                            padding: "2rem",
                          }}
                        >
                          {t("no_staff_found") || "No staff found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {isStaffModalOpen && (
        <div className="manage-modal-overlay">
          <div className={`manage-modal manage-modal--${theme}`}>
            <div className="manage-modal__header">
              <h3>{editingStaff ? t("edit_staff") : t("add_new_staff")}</h3>
              <button
                className="manage-modal__close"
                onClick={() => setIsStaffModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveStaff} className="manage-form">
              <input
                className="manage-input"
                placeholder={t("full_name")}
                required
                value={staffForm.full_name}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, full_name: e.target.value })
                }
              />
              <input
                className="manage-input"
                placeholder={t("username")}
                required
                value={staffForm.username}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, username: e.target.value })
                }
              />
              <input
                className="manage-input"
                type="password"
                placeholder={
                  editingStaff ? t("new_password_optional") : t("password")
                }
                required={!editingStaff}
                value={staffForm.password}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, password: e.target.value })
                }
              />

              <select
                className="manage-input"
                required
                value={staffForm.role}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, role: e.target.value })
                }
                disabled={user?.role === "branch_manager"}
              >
                <option value="sales_man">{t("sales_man")}</option>
                {user?.role === "store_owner" && (
                  <option value="branch_manager">{t("branch_manager")}</option>
                )}
                {user?.role === "store_owner" && (
                  <option value="store_owner">{t("store_owner")}</option>
                )}
              </select>

              <select
                className="manage-input"
                required
                value={staffForm.branch_id}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, branch_id: e.target.value })
                }
                disabled={user?.role !== "store_owner"}
              >
                <option value="">{t("select_branch")}</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <button type="submit" className="manage-btn manage-btn--submit">
                {editingStaff ? t("update_staff") : t("create_staff")}
              </button>
            </form>
          </div>
        </div>
      )}

      {isBranchModalOpen && (
        <div className="manage-modal-overlay">
          <div className={`manage-modal manage-modal--${theme}`}>
            <div className="manage-modal__header">
              <h3>{branchForm.id ? t("edit_branch") : t("add_new_branch")}</h3>
              <button
                className="manage-modal__close"
                onClick={() => setIsBranchModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveBranch} className="manage-form">
              <input
                className="manage-input"
                placeholder={t("branch_name")}
                required
                value={branchForm.name}
                onChange={(e) =>
                  setBranchForm({ ...branchForm, name: e.target.value })
                }
              />
              <input
                className="manage-input"
                placeholder={t("location")}
                required
                value={branchForm.location}
                onChange={(e) =>
                  setBranchForm({ ...branchForm, location: e.target.value })
                }
              />
              <input
                className="manage-input"
                placeholder={t("phone")}
                value={branchForm.phone}
                onChange={(e) =>
                  setBranchForm({ ...branchForm, phone: e.target.value })
                }
              />
              <button type="submit" className="manage-btn manage-btn--submit">
                {branchForm.id ? t("update_branch") : t("create_branch")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePage;
