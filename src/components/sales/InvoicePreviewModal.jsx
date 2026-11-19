import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle, Printer, MessageCircle, Loader, Edit2 } from 'lucide-react';
import { printThermalReceipt } from '../../utils/thermalPrint';
import useTenantStore from '../../store/tenantStore';

const InvoicePreviewModal = ({
    isOpen,
    lastInvoice,
    waConnected,
    waStep,
    waCustomPhone,
    waSending,
    printPdfLoading,
    onClose,
    onOpenPDF,
    onPrintThermal,
    onSendWa,
    onEditPhone,
    onCancelEditPhone
}) => {
    const { t } = useTranslation();

    if (!isOpen || !lastInvoice) return null;

    return (
        <div className="sales-modal-overlay">
            <div className="sales-modal">
                <div className="sales-modal__header">
                    <h2>{t('invoice_created')}</h2>
                    <button
                        className="sales-modal__close"
                        onClick={onClose}
                        aria-label={t('close') || 'Close modal'}
                    >
                        <X size={24}/>
                    </button>
                </div>

                <div className="sales-modal__body">
                    <div className="sales-modal__success">
                        <CheckCircle size={48} color="#10b981" style={{margin:'0 auto'}}/>
                        <p>{t('transaction_saved_msg', { number: lastInvoice.invoice_number })}</p>
                    </div>

                    {waConnected && lastInvoice?.customer && (
                        <div className="sales-modal__customer-info">
                            <div className="sales-modal__customer-phone-section">
                                <label className="sales-modal__phone-label">
                                    {t('customer_phone') || 'Customer Phone'}:
                                </label>
                                {waStep === 'input' ? (
                                    <div className="sales-modal__wa-input-wrapper">
                                        <input
                                            type="tel"
                                            className="sales-modal__wa-input"
                                            placeholder={t('phone_placeholder') || 'e.g. 96512345678'}
                                            value={waCustomPhone}
                                            onChange={(e) => onEditPhone(e.target.value)}
                                            disabled={waSending}
                                            autoFocus
                                            aria-label={t('phone_number') || 'Phone number'}
                                        />
                                        <button
                                            type="button"
                                            className="sales-modal__wa-edit-btn"
                                            onClick={onCancelEditPhone}
                                            disabled={waSending}
                                            title={t('cancel') || 'Cancel'}
                                            aria-label={t('cancel') || 'Cancel'}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="sales-modal__phone-display">
                                        <span className="sales-modal__phone-value">
                                            {lastInvoice.customer.phone || t('no_phone') || 'No phone number'}
                                        </span>
                                        {lastInvoice.customer.phone && (
                                            <button
                                                type="button"
                                                className="sales-modal__phone-edit-btn"
                                                onClick={() => onEditPhone(lastInvoice.customer.phone || '')}
                                                title={t('edit_phone') || 'Edit phone number'}
                                                aria-label={t('edit_phone') || 'Edit phone number'}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {waStep === 'input' && (
                        <div className="sales-modal__wa-flow">
                            <div className="sales-modal__wa-btns">
                                <button
                                    type="button"
                                    className="sales-btn sales-btn--secondary"
                                    onClick={onCancelEditPhone}
                                    disabled={waSending}
                                    aria-label={t('cancel') || 'Cancel'}
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    type="button"
                                    className="sales-btn sales-btn--primary"
                                    onClick={() => onSendWa(waCustomPhone.trim())}
                                    disabled={waSending || !waCustomPhone.trim()}
                                    aria-label={t('send_whatsapp') || 'Send WhatsApp'}
                                >
                                    {waSending ? (
                                        <>
                                            <Loader size={16} className="sales-spin" style={{marginRight:6}}/>
                                            {t('sending') || 'Sending...'}
                                        </>
                                    ) : (
                                        <>
                                            <MessageCircle size={16} style={{marginRight:6}}/>
                                            {t('send_whatsapp')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="sales-modal__actions">
                        <button
                            className="sales-btn sales-btn--secondary"
                            onClick={onClose}
                            aria-label={t('close') || 'Close'}
                        >
                            {t('close')}
                        </button>
                        <button
                            className="sales-btn sales-btn--primary"
                            onClick={onOpenPDF}
                            disabled={printPdfLoading}
                            aria-label={t('print_pdf') || 'Print PDF'}
                        >
                            {printPdfLoading ? (
                                <Loader className="sales-spin" size={18} style={{marginRight:8}}/>
                            ) : (
                                <Printer size={18} style={{marginRight:8}}/>
                            )}
                            {t('print_pdf')}
                        </button>
                        <button
                            type="button"
                            className="sales-btn sales-btn--secondary sales-btn--thermal"
                            onClick={() =>
                                onPrintThermal
                                    ? onPrintThermal(lastInvoice)
                                    : printThermalReceipt(lastInvoice, {
                                        lang: "ar",
                                        storeName: useTenantStore.getState().tenantName || lastInvoice?.branch?.name || "",
                                      })
                            }
                            aria-label={t('print_thermal') || 'Thermal 80mm'}
                        >
                            <Printer size={18} style={{marginRight:8}}/>
                            {t('print_thermal') || 'Thermal 80mm'}
                        </button>
                        {waConnected && waStep === null && (
                            <button
                                type="button"
                                className="sales-btn sales-btn--wa"
                                onClick={() => {
                                    if (lastInvoice?.customer?.phone) {
                                        onSendWa(lastInvoice.customer.phone);
                                    } else {
                                        onEditPhone('');
                                    }
                                }}
                                title={t('send_whatsapp') || 'Send via WhatsApp'}
                                aria-label={t('send_whatsapp') || 'Send via WhatsApp'}
                            >
                                <MessageCircle size={18} style={{marginRight:8}}/>
                                {t('send_whatsapp')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePreviewModal;
