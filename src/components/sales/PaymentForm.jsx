import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';

const PaymentForm = ({
    grandTotal,
    totalPaid,
    remaining,
    payments,
    onUpdatePayment,
    onAddPayment,
    onRemovePayment,
    formatPrice
}) => {
    const { t } = useTranslation();

    return (
        <div className="sales-card sales-payment">
            <div className="sales-payment__total">
                <span className="sales-payment__label">{t('grand_total')}</span>
                <div className="sales-payment__amount">
                    {formatPrice(grandTotal)} <small>{t('kwd')}</small>
                </div>
            </div>

            <div className="sales-payment__list">
                {payments.map((p, idx) => (
                    <div key={idx} className="sales-payment__row">
                        <select
                            className="sales-payment__select"
                            value={p.method}
                            onChange={e => onUpdatePayment(idx, 'method', e.target.value)}
                            aria-label={`${t('payment_method')} ${idx + 1}`}
                        >
                            <option value="Cash">{t('cash')}</option>
                            <option value="K-Net">{t('knet')}</option>
                            <option value="Visa/Master">{t('visa_master')}</option>
                            <option value="Link">{t('link')}</option>
                        </select>
                        <div className="sales-payment__input-wrapper">
                            <input
                                type="number"
                                step="0.001"
                                min="0"
                                className="sales-payment__input"
                                placeholder={t('amount')}
                                value={p.amount}
                                onChange={e => onUpdatePayment(idx, 'amount', e.target.value)}
                                aria-label={`${t('amount')} for ${t(p.method.toLowerCase()) || p.method}`}
                            />
                            <span className="sales-payment__suffix">{t('kwd')}</span>
                        </div>
                        {payments.length > 1 && (
                            <button
                                className="sales-btn-icon"
                                onClick={() => onRemovePayment(idx)}
                                title={t('remove_payment') || 'Remove payment'}
                                aria-label={`${t('remove_payment')} ${idx + 1}`}
                            >
                                <X size={16}/>
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button
                className="sales-btn sales-btn--dashed"
                onClick={onAddPayment}
                aria-label={t('add_payment_method') || 'Add payment method'}
            >
                <Plus size={16}/> {t('add_payment_method')}
            </button>

            <div className="sales-payment__summary">
                <div className="sales-summary-row sales-summary-row--settled">
                    <span>{t('paid')}:</span>
                    <span>{totalPaid.toFixed(3)} {t('kwd')}</span>
                </div>
                <div className={`sales-summary-row sales-summary-row--remaining ${remaining > 0.01 ? 'due' : 'settled'}`}>
                    <span>{t('balance')}:</span>
                    <span>{formatPrice(remaining)} {t('kwd')}</span>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;
