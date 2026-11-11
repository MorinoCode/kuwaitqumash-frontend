import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, User } from 'lucide-react';

const CustomerFormModal = ({
    isOpen,
    formData,
    setFormData,
    onClose,
    onSubmit,
    isSaving,
    theme
}) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="sales-modal-overlay">
            <div className={`sales-modal sales-modal--large sales-modal--${theme}`}>
                <div className="sales-modal__header">
                    <h3>{t('new_customer')}</h3>
                    <button
                        className="sales-modal__close"
                        onClick={onClose}
                        aria-label={t('close') || 'Close modal'}
                    >
                        <X size={20}/>
                    </button>
                </div>

                <form onSubmit={onSubmit} className="customer-form">
                    <input
                        className="customer-form__input"
                        placeholder={t('full_name')}
                        required
                        value={formData.full_name}
                        onChange={e => setFormData({...formData, full_name: e.target.value})}
                        aria-label={t('full_name') || 'Full name'}
                        aria-required="true"
                    />

                    <div className="customer-form__row">
                        <input
                            className="customer-form__input"
                            placeholder={t('phone')}
                            required
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            aria-label={t('phone') || 'Phone'}
                            aria-required="true"
                        />
                        <select
                            className="customer-form__input"
                            value={formData.gender}
                            onChange={e => setFormData({...formData, gender: e.target.value})}
                            aria-label={t('gender') || 'Gender'}
                        >
                            <option value="M">{t('male')}</option>
                            <option value="F">{t('female')}</option>
                        </select>
                    </div>

                    <input
                        className="customer-form__input"
                        placeholder={t('address')}
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        aria-label={t('address') || 'Address'}
                    />

                    <select
                        className="customer-form__input"
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}
                        aria-label={t('customer_type') || 'Customer type'}
                    >
                        <option value="Regular">{t('regular_customer', 'Regular')}</option>
                        <option value="VIP">VIP</option>
                        <option value="Wholesaler">{t('wholesaler_customer', 'Wholesaler')}</option>
                    </select>

                    <textarea
                        className="customer-form__input customer-form__input--textarea"
                        placeholder={t('notes')}
                        rows="2"
                        value={formData.notes}
                        onChange={e => setFormData({...formData, notes: e.target.value})}
                        aria-label={t('notes') || 'Notes'}
                    />

                    <button
                        type="submit"
                        className="sales-btn sales-btn--primary"
                        disabled={isSaving}
                        aria-label={t('save_customer') || 'Save customer'}
                    >
                        {isSaving ? (
                            <>
                                <User size={16}/> {t('saving')}
                            </>
                        ) : t('save_customer')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CustomerFormModal;
