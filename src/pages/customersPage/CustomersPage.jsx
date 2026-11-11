import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import api from "../../api/axios";
import Pagination from "../../components/pagination/Pagination";
import { SkeletonCustomersTableRows } from "../../components/skeleton/SkeletonCustomers";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useBranchStore from "../../store/branchStore";
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "../../hooks/useCustomers";
import { normalizeToLatinDigits } from "../../utils/normalizeNumbers.js";
import "./CustomersPage.css";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Camera,
  Loader,
  Upload,
} from "lucide-react";

// Memoized Customer Row Component for better performance
const CustomerRow = React.memo(
  ({ customer, onRowClick, onEdit, onDelete, t }) => (
    <tr onClick={onRowClick} className="customers-table__row">
      <td
        className="customers-table__cell customers-table__cell--name"
        data-label={t("name")}
      >
        {customer.full_name}
      </td>
      <td className="customers-table__cell" data-label={t("phone")}>
        {customer.phone}
      </td>
      <td className="customers-table__cell" data-label={t("civil_id")}>
        {customer.civil_id || "-"}
      </td>
      <td className="customers-table__cell" data-label={t("type")}>
        <span
          className={`customers-badge customers-badge--${customer.type.toLowerCase()}`}
        >
          {customer.type}
        </span>
      </td>
      <td
        className="customers-table__cell customers-table__cell--actions"
        data-label={t("actions")}
      >
        <div className="customers-table__actions-group">
          <button
            className="customers-action-btn"
            title={t("edit")}
            onClick={onEdit}
          >
            <Edit size={16} />
          </button>
          <button
            className="customers-action-btn customers-action-btn--delete"
            title={t("delete")}
            onClick={onDelete}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  ),
);

CustomerRow.displayName = "CustomerRow";

const CustomersPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const [idFiles, setIdFiles] = useState({ front: null, back: null });
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    civil_id: "",
    type: "Regular",
    notes: "",
    nationality: "Kuwaiti",
    gender: "M",
    address: "",
    birth_date: "",
    expiry_date: "",
  });

  const { activeBranchId, activeBranchName: branchNameFromStore } =
    useBranchStore();
  const activeBranchName = branchNameFromStore || t("all_branches");

  // Use React Query for customers
  const customerFilters = {
    search: searchTerm.trim() || undefined,
    branch_id:
      user?.role === "store_owner" && activeBranchId
        ? activeBranchId
        : undefined,
    page: pagination.currentPage,
    limit: 20,
  };

  const {
    data: customersData,
    isLoading: customersLoading,
    refetch: refetchCustomers,
  } = useCustomers(customerFilters);
  const customers = useMemo(() => customersData?.data || [], [customersData?.data]);
  const loading = customersLoading; // Use React Query's loading state directly

  // Use mutations
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();

  // Check if any mutation is in progress
  const isSaving =
    createCustomerMutation.isPending || updateCustomerMutation.isPending;

  // Update pagination only
  useEffect(() => {
    if (customersData?.pagination) {
      setPagination(customersData.pagination);
    }
  }, [customersData]);

  // React Query automatically handles fetching when filters change

  // React Query handles errors automatically via onError in hooks

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    // React Query will automatically fetch new page if not in cache
    // No need to manually call fetchCustomers
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // React Query handles caching automatically
  // No need to manually refetch on navigation - cache will be used if data is fresh

  // Reset to page 1 when search or branch changes
  useEffect(() => {
    if (pagination.currentPage !== 1) {
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  }, [searchTerm, activeBranchId, pagination.currentPage]);

  // React Query automatically refetches when queryKey changes (filters)
  // No need for manual refetch - React Query handles it efficiently

  const handleFileSelect = async (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    // File validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error(t("file_too_large") || "File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error(t("invalid_file_type") || "Please select an image file");
      return;
    }

    setIdFiles((prev) => ({ ...prev, [side]: file }));
    await processOCR(file);
  };

  const processOCR = async (file) => {
    setIsScanning(true);
    const ocrFormData = new FormData();
    ocrFormData.append("image", file);

    try {
      const res = await api.post("/customers/scan", ocrFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        const data = res.data.data;
        setFormData((prev) => ({
          ...prev,
          civil_id: data.civil_id || prev.civil_id,
          full_name: data.full_name || prev.full_name,
          nationality: data.nationality || prev.nationality,
          gender: data.gender ? (data.gender === "F" ? "F" : "M") : prev.gender,
          birth_date: data.birth_date || prev.birth_date,
          expiry_date: data.expiry_date || prev.expiry_date,
          address: data.address || prev.address,
          notes: prev.notes + (prev.notes ? "\n" : "") + "[AI Scanned]",
        }));
        toast.success(t("id_scanned_success"));
      }
    } catch {
      toast.error(t("scan_failed"));
    } finally {
      setIsScanning(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Input Validation
    if (!formData.full_name || formData.full_name.trim().length < 2) {
      return toast.error(
        t("name_required") || "Full name must be at least 2 characters",
      );
    }

    const phoneNorm = normalizeToLatinDigits(formData.phone || "").replace(
      /[^0-9+]/g,
      "",
    );
    if (!phoneNorm || phoneNorm.length < 8) {
      return toast.error(
        t("phone_required") || "Valid phone number is required",
      );
    }

    // Sanitize inputs (normalize Arabic/Persian digits for phone and civil_id)
    const sanitizedData = {
      ...formData,
      full_name: formData.full_name.trim().substring(0, 255),
      phone: normalizeToLatinDigits(formData.phone || "")
        .trim()
        .substring(0, 50),
      civil_id: formData.civil_id
        ? normalizeToLatinDigits(formData.civil_id).trim().substring(0, 50)
        : "",
      nationality: formData.nationality
        ? formData.nationality.trim().substring(0, 100)
        : "",
      address: formData.address
        ? formData.address.trim().substring(0, 500)
        : "",
      notes: formData.notes ? formData.notes.trim().substring(0, 2000) : "",
    };

    try {
      const payload = new FormData();
      Object.keys(sanitizedData).forEach((key) =>
        payload.append(key, sanitizedData[key]),
      );

      if (activeBranchId) payload.append("branch_id", activeBranchId);

      if (idFiles.front) payload.append("front_image", idFiles.front);
      if (idFiles.back) payload.append("back_image", idFiles.back);

      // Convert FormData to object for mutation
      const dataObj = {};
      payload.forEach((value, key) => {
        if (key === "front_image" || key === "back_image") {
          dataObj[key] = value;
        } else {
          dataObj[key] = value;
        }
      });

      if (selectedCustomer) {
        await updateCustomerMutation.mutateAsync({
          id: selectedCustomer.id,
          data: dataObj,
        });
      } else {
        await createCustomerMutation.mutateAsync(dataObj);
      }

      setIsFormOpen(false);
      setFormData({
        full_name: "",
        phone: "",
        civil_id: "",
        type: "Regular",
        notes: "",
        nationality: "Kuwaiti",
        gender: "M",
        address: "",
        birth_date: "",
        expiry_date: "",
      });
      setIdFiles({ front: null, back: null });
      setSelectedCustomer(null);
      refetchCustomers();
    } catch (err) {
      toast.error(err.response?.data?.message || t("error_saving_customer"));
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setCustomerToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      await deleteCustomerMutation.mutateAsync(customerToDelete);
      setIsConfirmModalOpen(false);
      setCustomerToDelete(null);
    } catch {
      // Error is handled by mutation
      setIsConfirmModalOpen(false);
    }
  };

  const openEdit = (customer, e) => {
    e.stopPropagation();
    setSelectedCustomer(customer);
    setFormData({
      full_name: customer.full_name,
      phone: customer.phone,
      civil_id: customer.civil_id || "",
      type: customer.type || "Regular",
      notes: customer.notes || "",
      nationality: customer.nationality || "",
      gender: customer.gender || "M",
      address: customer.address || "",
      birth_date: customer.birth_date || "",
      expiry_date: customer.expiry_date || "",
    });
    setIdFiles({ front: null, back: null });
    setIsFormOpen(true);
  };



  return (
    <div
      className={`customers-page customers-page--${theme}`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <header className="customers-page__header">
        <div className="customers-page__titles">
          <h1 className="customers-page__title">
            <Users className="customers-page__title-icon" size={24} />
            {t("customer_management")}
          </h1>
          <p className="customers-page__subtitle">{activeBranchName}</p>
        </div>
        <div className="customers-page__actions">
          <button
            className="customers-page__btn customers-page__btn--primary"
            onClick={() => {
              setSelectedCustomer(null);
              setIsFormOpen(true);
            }}
          >
            <Plus size={18} /> {t("new_customer")}
          </button>
        </div>
      </header>

      <div className="customers-page__controls">
        <div className="customers-search">
          <Search size={18} className="customers-search__icon" />
          <input
            className="customers-search__input"
            placeholder={t("search_customer_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="customers-table-container">
        <div className="customers-table-wrapper">
          <table className="customers-table">
            <thead className="customers-table__head">
              <tr>
                <th>{t("name")}</th>
                <th>{t("phone")}</th>
                <th>{t("civil_id")}</th>
                <th>{t("type")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="customers-table__body">
              {loading ? (
                <SkeletonCustomersTableRows />
              ) : (
                <>
                  {customers.map((c) => (
                    <CustomerRow
                      key={c.id}
                      customer={c}
                      onRowClick={() => navigate(`/customers/${c.id}`)}
                      onEdit={(e) => openEdit(c, e)}
                      onDelete={(e) => handleDelete(c.id, e)}
                      t={t}
                    />
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="customers-table__empty">
                        {t("no_customers_found")}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}

      {isFormOpen && (
        <div className="customers-modal-overlay">
          <div className={`customers-modal customers-modal--${theme}`}>
            <div className="customers-modal__header">
              <h3 className="customers-modal__title">
                {selectedCustomer ? t("edit_customer") : t("new_customer_scan")}
              </h3>
              <button
                className="customers-modal__close"
                onClick={() => setIsFormOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="customers-scan">
              <p className="customers-scan__label">{t("upload_civil_id")}</p>
              <div className="customers-scan__buttons">
                <input
                  type="file"
                  ref={frontInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, "front")}
                />
                <button
                  type="button"
                  className={`customers-scan__btn ${
                    idFiles.front ? "customers-scan__btn--done" : ""
                  }`}
                  onClick={() => frontInputRef.current.click()}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <Loader className="customers-spin" size={18} />
                  ) : (
                    <Camera size={18} />
                  )}
                  {idFiles.front ? t("front_uploaded") : t("scan_front")}
                </button>

                <input
                  type="file"
                  ref={backInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, "back")}
                />
                <button
                  type="button"
                  className={`customers-scan__btn ${
                    idFiles.back ? "customers-scan__btn--done" : ""
                  }`}
                  onClick={() => backInputRef.current.click()}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <Loader className="customers-spin" size={18} />
                  ) : (
                    <Upload size={18} />
                  )}
                  {idFiles.back ? t("back_uploaded") : t("scan_back")}
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="customers-form">
              <input
                className="customers-form__input"
                placeholder={t("full_name")}
                required
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />

              <div className="customers-form__row">
                <input
                  className="customers-form__input"
                  placeholder={t("phone")}
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                <input
                  className="customers-form__input"
                  placeholder={t("civil_id")}
                  value={formData.civil_id}
                  onChange={(e) =>
                    setFormData({ ...formData, civil_id: e.target.value })
                  }
                />
              </div>

              <div className="customers-form__row">
                <select
                  className="customers-form__input"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="M">{t("male")}</option>
                  <option value="F">{t("female")}</option>
                </select>
                <input
                  className="customers-form__input"
                  placeholder={t("nationality")}
                  value={formData.nationality}
                  onChange={(e) =>
                    setFormData({ ...formData, nationality: e.target.value })
                  }
                />
              </div>

              <div className="customers-form__row">
                <input
                  className="customers-form__input"
                  placeholder={t("birth_date")}
                  value={formData.birth_date}
                  onChange={(e) =>
                    setFormData({ ...formData, birth_date: e.target.value })
                  }
                />
                <input
                  className="customers-form__input"
                  placeholder={t("expiry_date")}
                  value={formData.expiry_date}
                  onChange={(e) =>
                    setFormData({ ...formData, expiry_date: e.target.value })
                  }
                />
              </div>

              <input
                className="customers-form__input"
                placeholder={t("address")}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />

              <select
                className="customers-form__input"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
                <option value="Wholesaler">Wholesaler</option>
              </select>

              <textarea
                className="customers-form__input customers-form__input--textarea"
                placeholder={t("notes")}
                rows="2"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />

              <button
                type="submit"
                className="customers-page__btn customers-page__btn--submit"
                disabled={isScanning || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader className="customers-spin" size={18} />
                    {t("saving") || "Saving..."}
                  </>
                ) : isScanning ? (
                  t("wait_ai")
                ) : (
                  t("save_customer")
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {isConfirmModalOpen && (
        <div className="customers-modal-overlay">
          <div className={`customers-modal customers-modal--${theme}`}>
            <div className="customers-modal__header">
              <h3 className="customers-modal__title">
                {t("confirm") || "Confirm"}
              </h3>
              <button
                className="customers-modal__close"
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setCustomerToDelete(null);
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="customers-modal__body">
              <p>{t("confirm_delete_customer")}</p>
              <div
                style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}
              >
                <button
                  className="customers-page__btn customers-page__btn--secondary"
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    setCustomerToDelete(null);
                  }}
                  style={{ flex: 1 }}
                >
                  {t("cancel")}
                </button>
                <button
                  className="customers-page__btn customers-page__btn--danger"
                  onClick={confirmDelete}
                  style={{ flex: 1 }}
                >
                  {t("delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
