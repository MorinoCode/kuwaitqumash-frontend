import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
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
import { Users, Search, Plus, Edit, Trash2, X, Loader } from "lucide-react";

const emptyForm = {
  full_name: "",
  phone: "",
  gender: "M",
  address: "",
  type: "Regular",
  notes: "",
};

const CustomerRow = React.memo(({ customer, onRowClick, onEdit, onDelete, t }) => (
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
    <td className="customers-table__cell" data-label={t("gender")}>
      {customer.gender === "F" ? t("female") : t("male")}
    </td>
    <td className="customers-table__cell" data-label={t("address")}>
      {customer.address || "-"}
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
));

CustomerRow.displayName = "CustomerRow";

const CustomersPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const { activeBranchId, activeBranchName: branchNameFromStore } =
    useBranchStore();
  const activeBranchName = branchNameFromStore || t("all_branches");

  const [prevBranchId, setPrevBranchId] = useState(activeBranchId);
  if (prevBranchId !== activeBranchId) {
    setPrevBranchId(activeBranchId);
    setCurrentPage(1);
  }

  const customerFilters = {
    search: searchTerm.trim() || undefined,
    branch_id:
      user?.role === "store_owner" && activeBranchId
        ? activeBranchId
        : undefined,
    page: currentPage,
    limit: 20,
  };

  const {
    data: customersData,
    isLoading: customersLoading,
    refetch: refetchCustomers,
  } = useCustomers(customerFilters);
  const customers = useMemo(() => customersData?.data || [], [customersData?.data]);
  const loading = customersLoading;
  const pagination = customersData?.pagination || {
    currentPage,
    totalPages: 1,
    totalItems: customers.length,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();

  const isSaving =
    createCustomerMutation.isPending || updateCustomerMutation.isPending;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSave = async (e) => {
    e.preventDefault();

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

    const data = {
      full_name: formData.full_name.trim().substring(0, 255),
      phone: normalizeToLatinDigits(formData.phone || "")
        .trim()
        .substring(0, 50),
      gender: formData.gender || "M",
      type: formData.type || "Regular",
      address: formData.address ? formData.address.trim().substring(0, 500) : "",
      notes: formData.notes ? formData.notes.trim().substring(0, 2000) : "",
    };

    if (activeBranchId) data.branch_id = activeBranchId;

    try {
      if (selectedCustomer) {
        await updateCustomerMutation.mutateAsync({
          id: selectedCustomer.id,
          data,
        });
      } else {
        await createCustomerMutation.mutateAsync(data);
      }

      setIsFormOpen(false);
      setFormData(emptyForm);
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
      setIsConfirmModalOpen(false);
    }
  };

  const openEdit = (customer, e) => {
    e.stopPropagation();
    setSelectedCustomer(customer);
    setFormData({
      full_name: customer.full_name || "",
      phone: customer.phone || "",
      gender: customer.gender || "M",
      address: customer.address || "",
      type: customer.type || "Regular",
      notes: customer.notes || "",
    });
    setIsFormOpen(true);
  };

  const renderCustomerFields = () => (
    <>
      <input
        className="customers-form__input"
        placeholder={t("full_name")}
        required
        value={formData.full_name}
        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
      />

      <div className="customers-form__row">
        <input
          className="customers-form__input"
          placeholder={t("phone")}
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <select
          className="customers-form__input"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
        >
          <option value="M">{t("male")}</option>
          <option value="F">{t("female")}</option>
        </select>
      </div>

      <input
        className="customers-form__input"
        placeholder={t("address")}
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />

      <select
        className="customers-form__input"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
      >
        <option value="Regular">{t("regular_customer", "Regular")}</option>
        <option value="VIP">VIP</option>
        <option value="Wholesaler">
          {t("wholesaler_customer", "Wholesaler")}
        </option>
      </select>

      <textarea
        className="customers-form__input customers-form__input--textarea"
        placeholder={t("notes")}
        rows="2"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
      />
    </>
  );

  return (
    <div
      className={`customers-page customers-page--${theme}`}
      dir={i18n.language === "ar" || i18n.language === "fa" ? "rtl" : "ltr"}
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
              setFormData(emptyForm);
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
            onChange={handleSearchChange}
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
                <th>{t("gender")}</th>
                <th>{t("address")}</th>
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
                      <td colSpan="6" className="customers-table__empty">
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
                {selectedCustomer ? t("edit_customer") : t("new_customer")}
              </h3>
              <button
                className="customers-modal__close"
                onClick={() => setIsFormOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="customers-form">
              {renderCustomerFields()}

              <button
                type="submit"
                className="customers-page__btn customers-page__btn--submit"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader className="customers-spin" size={18} />
                    {t("saving") || "Saving..."}
                  </>
                ) : (
                  t("save_customer")
                )}
              </button>
            </form>
          </div>
        </div>
      )}

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
