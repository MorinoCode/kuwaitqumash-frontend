import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Camera, Upload, Loader } from 'lucide-react';

const CustomerFormModal = ({
    isOpen,
    formData,
    setFormData,
    idFiles,
    isScanning,
    newCustFrontRef,
    newCustBackRef,
    onClose,
    onFileSelect,
    onSubmit,
    theme
}) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="sales-modal-overlay">
            <div className={`sales-modal sales-modal--large sales-modal--${theme}`}>
                <div className="sales-modal__header">
                    <h3>{t('new_customer_scan')}</h3>
                    <button
                        className="sales-modal__close"
                        onClick={onClose}
                        aria-label={t('close') || 'Close modal'}
                    >
                        <X size={20}/>
                    </button>
                </div>

                <div className="customer-scan-section">
                    <p className="customer-scan__label">{t('upload_civil_id')}</p>
                    <div className="customer-scan__buttons">
                        <input
                            type="file"
                            ref={newCustFrontRef}
                            style={{display:'none'}}
                            accept="image/*"
                            onChange={(e) => onFileSelect(e, 'front')}
                            aria-label={t('upload_front_id') || 'Upload front ID'}
                        />
                        <button
                            type="button"
                            className={`customer-scan-btn ${idFiles.front ? 'customer-scan-btn--done' : ''}`}
                            onClick={() => newCustFrontRef.current?.click()}
                            disabled={isScanning}
                            aria-label={t('scan_front') || 'Scan front ID'}
                        >
                            {isScanning ? <Loader className="sales-spin" size={18}/> : <Camera size={18}/>}
                            {idFiles.front ? t('front_uploaded') : t('scan_front')}
                        </button>

                        <input
                            type="file"
                            ref={newCustBackRef}
                            style={{display:'none'}}
                            accept="image/*"
                            onChange={(e) => onFileSelect(e, 'back')}
                            aria-label={t('upload_back_id') || 'Upload back ID'}
                        />
                        <button
                            type="button"
                            className={`customer-scan-btn ${idFiles.back ? 'customer-scan-btn--done' : ''}`}
                            onClick={() => newCustBackRef.current?.click()}
                            disabled={isScanning}
                            aria-label={t('scan_back') || 'Scan back ID'}
                        >
                            {isScanning ? <Loader className="sales-spin" size={18}/> : <Upload size={18}/>}
                            {idFiles.back ? t('back_uploaded') : t('scan_back')}
                        </button>
                    </div>
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
                        <input
                            className="customer-form__input"
                            placeholder={t('civil_id')}
                            value={formData.civil_id}
                            onChange={e => setFormData({...formData, civil_id: e.target.value})}
                            aria-label={t('civil_id') || 'Civil ID'}
                        />
                    </div>

                    <div className="customer-form__row">
                        <select
                            className="customer-form__input"
                            value={formData.gender}
                            onChange={e => setFormData({...formData, gender: e.target.value})}
                            aria-label={t('gender') || 'Gender'}
                        >
                            <option value="M">{t('male')}</option>
                            <option value="F">{t('female')}</option>
                        </select>
                        <input
                            className="customer-form__input"
                            placeholder={t('nationality')}
                            value={formData.nationality}
                            onChange={e => setFormData({...formData, nationality: e.target.value})}
                            aria-label={t('nationality') || 'Nationality'}
                        />
                    </div>

                    <div className="customer-form__row">
                        <input
                            className="customer-form__input"
                            placeholder={t('birth_date')}
                            value={formData.birth_date}
                            onChange={e => setFormData({...formData, birth_date: e.target.value})}
                            aria-label={t('birth_date') || 'Birth date'}
                        />
                        <input
                            className="customer-form__input"
                            placeholder={t('expiry_date')}
                            value={formData.expiry_date}
                            onChange={e => setFormData({...formData, expiry_date: e.target.value})}
                            aria-label={t('expiry_date') || 'Expiry date'}
                        />
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
                        disabled={isScanning}
                        aria-label={t('save_customer') || 'Save customer'}
                    >
                        {isScanning ? t('wait_ai') : t('save_customer')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CustomerFormModal;
