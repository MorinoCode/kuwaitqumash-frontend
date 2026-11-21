import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useBranchStore from "../../store/branchStore";
import { useBranches } from "../../hooks/useBranches";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import BranchSelector from "../../components/analytics/BranchSelector";
import Pagination from "../../components/pagination/Pagination";
import "./RefundsPage.css";
import { RotateCcw, Download, Loader, Plus, Search, Calendar, X } from "lucide-react";

const RefundsPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { activeBranchId } = useBranchStore();
  const { data: branches = [], isLoading: branchesLoading } = useBranches();
  const isOwner = user?.role === "store_owner";

  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfLoadingId, setPdfLoadingId] = useState(null);
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });
  const branchesInitialized = useRef(false);

  const fetchRefunds = useCallback(
    async (pageNum = 1) => {
      setLoading(true);
      try {
        const params = { page: pageNum, limit: 20 };
        if (!isOwner && activeBranchId) {
          params.branch_id = activeBranchId;
        } else if (isOwner && selectedBranchIds?.length > 0) {
          params.branch_ids = selectedBranchIds.join(",");
        }
        if (debouncedSearchTerm.trim()) params.search = debouncedSearchTerm.trim();
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        const res = await api.get("/refunds", { params });
        const data = res.data?.data || res.data || [];
        setRefunds(Array.isArray(data) ? data : []);
        const pg = res.data?.pagination || {};
        setPagination({
          currentPage: pg.page || 1,
          totalPages: Math.max(1, Math.ceil((pg.totalItems || 0) / (pg.limit || 20))),
          totalItems: pg.totalItems || 0,
          itemsPerPage: pg.limit || 20,
        });
      } catch (err) {
        toast.error(err.response?.data?.message || t("failed_to_load_refunds") || "Failed to load refunds");
        setRefunds([]);
      } finally {
        setLoading(false);
      }
    },
    [isOwner, selectedBranchIds, activeBranchId, debouncedSearchTerm, startDate, endDate, t]
  );

  useEffect(() => {
    if (isOwner && branches.length > 0 && !branchesInitialized.current) {
      setSelectedBranchIds(branches.map((b) => b.id));
      branchesInitialized.current = true;
    } else if (!isOwner && activeBranchId) {
      const id = parseInt(activeBranchId, 10);
      if (!isNaN(id)) setSelectedBranchIds([id]);
    }
  }, [isOwner, branches.length, activeBranchId, branches]);

  useEffect(() => {
    if (!isOwner && !activeBranchId) return;
    if (isOwner && branchesLoading) return;
    if (isOwner && branches.length > 0 && selectedBranchIds.length === 0) return;
    fetchRefunds(page);
  }, [fetchRefunds, page, branchesLoading, branches.length, isOwner, selectedBranchIds.length, activeBranchId]);

  const handleFilterApply = () => {
    setPage(1);
    fetchRefunds(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setPage(1);
    fetchRefunds(1);
  };

  const handleDownloadPDF = async (refund) => {
    if (!refund?.id) return;
    setPdfLoadingId(refund.id);
    try {
      const res = await api.get(`/refunds/${refund.id}/pdf`, { responseType: "blob" });
      const cnNum = refund.credit_note_number || refund.refund_number || `refund-${refund.id}`;
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `credit-note-${cnNum}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(t("pdf_downloaded_successfully") || "PDF downloaded successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || t("failed_to_download_pdf") || "Failed to download PDF");
    } finally {
      setPdfLoadingId(null);
    }
  };

  return (
    <div className={`refunds-page refunds-page--${theme}`} dir={i18n.language === "ar" || i18n.language === "fa" ? "rtl" : "ltr"}>
      <header className="refunds-header">
        <div className="refunds-header__titles">
          <h1 className="refunds-title">
            <RotateCcw size={24} className="refunds-icon" /> {t("refunds") || "Refunds"}
          </h1>
          <p className="refunds-subtitle">{t("refunds_subtitle") || "View refund history and download Credit Note PDFs"}</p>
          {isOwner && (
            <div className="refunds-branch-select">
              <BranchSelector
                branches={branches}
                selectedBranches={selectedBranchIds}
                onSelectionChange={setSelectedBranchIds}
              />
            </div>
          )}
        </div>
        <button
          type="button"
          className="refunds-btn refunds-btn--new"
          onClick={() => navigate("/refund")}
        >
          <Plus size={18} />
          + {t("refunds") || "Refunds"}
        </button>
      </header>

      <div className="refunds-controls">
        <div className="refunds-search">
          <Search size={18} className="refunds-search__icon" />
          <input
            className="refunds-search__input"
            placeholder={t("search_refunds_placeholder") || "Search Credit Note, Invoice #..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilterApply()}
          />
        </div>
        <div className="refunds-filter">
          <Calendar size={18} className="refunds-filter__icon" />
          <input
            type="date"
            className="refunds-filter__input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate || undefined}
          />
          <span className="refunds-filter__separator">-</span>
          <input
            type="date"
            className="refunds-filter__input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || undefined}
          />
          {(searchTerm || startDate || endDate) && (
            <button type="button" className="refunds-filter__clear" onClick={handleClearFilters}>
              <X size={16} />
            </button>
          )}
        </div>
        <button
          type="button"
          className="refunds-btn refunds-btn--filter"
          onClick={handleFilterApply}
        >
          {t("filter") || "Filter"}
        </button>
      </div>

      <div className="refunds-table-container">
        {loading ? (
          <div className="refunds-loading">
            <Loader size={32} className="refunds-spinner" />
            <span>{t("loading") || "Loading..."}</span>
          </div>
        ) : refunds.length === 0 ? (
          <div className="refunds-empty">
            <RotateCcw size={48} />
            <p>{t("no_refunds_yet") || "No refunds yet"}</p>
            <p className="refunds-empty-hint">{t("refunds_empty_hint") || "Refunds will appear here after processing"}</p>
            <button className="refunds-btn refunds-btn--primary" onClick={() => navigate("/refund")}>
              {t("go_to_refund") || "Go to Refund"}
            </button>
          </div>
        ) : (
          <>
            <table className="refunds-table">
              <thead className="refunds-table__head">
                <tr>
                  <th>{t("credit_note") || "Credit Note"}</th>
                  <th>{t("invoice_number") || "Invoice #"}</th>
                  <th>{t("date") || "Date"}</th>
                  <th>{t("amount") || "Amount"}</th>
                  <th>{t("created_by") || "Created by"}</th>
                  <th>{t("actions") || "Actions"}</th>
                </tr>
              </thead>
              <tbody className="refunds-table__body">
                {refunds.map((r) => (
                  <tr key={r.id} className="refunds-row">
                    <td className="refunds-row__cell refunds-row__cn">
                      {r.credit_note_number || r.refund_number || `#${r.id}`}
                    </td>
                    <td className="refunds-row__cell">
                      {r.invoice?.invoice_number || "--"}
                    </td>
                    <td className="refunds-row__cell">
                      {r.createdAt ? (
                        <>
                          {new Date(r.createdAt).toLocaleDateString()}
                          <small className="refunds-row__time">
                            {new Date(r.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </small>
                        </>
                      ) : (
                        "--"
                      )}
                    </td>
                    <td className="refunds-row__cell refunds-row__amount">
                      {(parseFloat(r.total_amount) || 0).toFixed(3)} {t("kwd")}
                    </td>
                    <td className="refunds-row__cell">{r.creator?.full_name || "--"}</td>
                    <td className="refunds-row__cell">
                      <button
                        type="button"
                        className="refunds-btn refunds-btn--download"
                        onClick={() => handleDownloadPDF(r)}
                        disabled={pdfLoadingId === r.id}
                        title={t("download_credit_note") || "Download Credit Note PDF"}
                      >
                        {pdfLoadingId === r.id ? (
                          <Loader size={16} className="spinner" />
                        ) : (
                          <Download size={16} />
                        )}{" "}
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={(p) => { setPage(p); fetchRefunds(p); }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RefundsPage;
