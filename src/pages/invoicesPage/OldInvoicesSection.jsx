import React from "react";
import { Download, Loader, Printer, X } from "lucide-react";
import Pagination from "../../components/pagination/Pagination";

export const OldInvoicesTab = ({
  t,
  oldInvoiceDays,
  oldInvoicesCutoff,
  oldInvoicesData,
  oldInvoicesLoading,
  pdfLoadingId,
  thermalLoadingId,
  onDownload,
  onThermalPrint,
  onPageChange,
}) => (
  <>
    <p className="invoices-old-note">
      {t("old_invoices_note", {
        days: oldInvoiceDays,
        date: oldInvoicesCutoff,
      })}
    </p>

    <div className="invoices-table-container">
      <div className="invoices-table-wrapper">
        <table className="invoices-table">
          <thead className="invoices-table__head">
            <tr>
              <th>{t("invoice_no")}</th>
              <th>{t("date")}</th>
              <th>{t("customer")}</th>
              <th>{t("total_amount")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="invoices-table__body">
            {(oldInvoicesData?.data || []).map((inv) => (
              <tr key={inv.id} className="invoices-row">
                <td className="invoices-row__cell invoices-row__no" data-label={t("invoice_no")}>
                  {inv?.invoice_number || "--"}
                </td>
                <td className="invoices-row__cell" data-label={t("date")}>
                  {inv.createdAt ? (
                    <>
                      {new Date(inv.createdAt).toLocaleDateString()}
                      <small className="invoices-row__time">
                        {new Date(inv.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    </>
                  ) : (
                    "--"
                  )}
                </td>
                <td className="invoices-row__cell invoices-row__customer" data-label={t("customer")}>
                  {inv.customer ? inv.customer.full_name : t("unknown")}
                </td>
                <td className="invoices-row__cell invoices-row__amount" data-label={t("total_amount")}>
                  {(parseFloat(inv?.total_amount) || 0).toFixed(3)}{" "}
                  {t("kwd")}
                </td>
                <td className="invoices-row__cell" data-label={t("actions")}>
                  <div className="invoices-actions">
                    <button
                      className="invoices-btn invoices-btn--download"
                      onClick={() => onDownload(inv)}
                      disabled={pdfLoadingId === inv.id}
                      title={t("download_pdf")}
                    >
                      {pdfLoadingId === inv.id ? (
                        <Loader size={16} className="spinner" />
                      ) : (
                        <Download size={16} />
                      )}{" "}
                      PDF
                    </button>
                    <button
                      type="button"
                      className="invoices-btn invoices-btn--thermal"
                      onClick={() => onThermalPrint(inv)}
                      disabled={thermalLoadingId === inv.id}
                      title={t("print_thermal") || "Thermal 80mm"}
                    >
                      {thermalLoadingId === inv.id ? (
                        <Loader size={16} className="spinner" />
                      ) : (
                        <Printer size={16} />
                      )}
                      <span>80mm</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {oldInvoicesLoading && (
              <tr>
                <td colSpan="5" className="invoices-empty">
                  <Loader size={18} className="spinner" />
                </td>
              </tr>
            )}
            {!oldInvoicesLoading &&
              (oldInvoicesData?.data || []).length === 0 && (
                <tr>
                  <td colSpan="5" className="invoices-empty">
                    {t("no_invoices_found")}
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>

    {oldInvoicesData?.pagination?.totalPages > 1 && (
      <Pagination
        currentPage={oldInvoicesData.pagination.currentPage}
        totalPages={oldInvoicesData.pagination.totalPages}
        totalItems={oldInvoicesData.pagination.totalItems}
        itemsPerPage={oldInvoicesData.pagination.itemsPerPage}
        onPageChange={onPageChange}
      />
    )}
  </>
);

export const ExportExcelModal = ({
  t,
  theme,
  isOwner,
  selectedBranchIds,
  excelLoading,
  exportStartDate,
  setExportStartDate,
  exportEndDate,
  setExportEndDate,
  onClose,
  onExport,
}) => (
  <div
    className="old-invoices-modal-overlay"
    onClick={() => !excelLoading && onClose(false)}
  >
    <div
      className={`old-invoices-modal old-invoices-modal--${theme}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="old-invoices-modal__header">
        <h3>{t("export_excel") || "Export to Excel"}</h3>
        <button
          className="old-invoices-modal__close"
          onClick={() => {
            if (!excelLoading) onClose(true);
          }}
          disabled={excelLoading}
        >
          <X size={20} />
        </button>
      </div>
      <div className="old-invoices-modal__body">
        <p className="old-invoices-modal__info">
          {t("select_date_range_export") ||
            "Select date range to export invoices. Leave empty to export all invoices."}
        </p>
        <div className="old-invoices-modal__form-group">
          <label>{t("start_date") || "Start Date"}</label>
          <input
            type="date"
            value={exportStartDate}
            onChange={(e) => setExportStartDate(e.target.value)}
            disabled={excelLoading}
            max={exportEndDate || undefined}
          />
        </div>
        <div className="old-invoices-modal__form-group">
          <label>{t("end_date") || "End Date"}</label>
          <input
            type="date"
            value={exportEndDate}
            onChange={(e) => setExportEndDate(e.target.value)}
            disabled={excelLoading}
            min={exportStartDate || undefined}
          />
        </div>
        {isOwner && selectedBranchIds.length > 0 && (
          <div className="old-invoices-modal__branch-note">
            <p>
              {t("exporting_branches") ||
                "Exporting invoices for selected branches"}
            </p>
          </div>
        )}
      </div>
      <div className="old-invoices-modal__footer">
        <button
          className="old-invoices-modal__cancel"
          onClick={() => onClose(true)}
          disabled={excelLoading}
        >
          {t("cancel") || "Cancel"}
        </button>
        <button
          className="old-invoices-modal__upload"
          onClick={onExport}
          disabled={excelLoading}
        >
          {excelLoading ? (
            <>
              <Loader
                size={16}
                className="spinner"
                style={{ marginRight: 8 }}
              />
              {t("exporting") || "Exporting..."}
            </>
          ) : (
            <>
              <Download size={16} style={{ marginRight: 8 }} />
              {t("export") || "Export"}
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);
