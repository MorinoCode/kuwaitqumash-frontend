import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, Search, Plus, X, Upload, CheckCircle } from 'lucide-react';

const CustomerSelector = ({
    selectedCustomer,
    customerSearch,
    setCustomerSearch,
    customersList,
    showCustDropdown,
    onSearchFocus,
    onSearchBlur,
    onSelectCustomer,
    onClearCustomer,
    onAddCustomer,
    onIdUpload,
    frontInputRef,
    backInputRef
}) => {
    const { t } = useTranslation();

    return (
        <div className="sales-card sales-customer">
            <div className="sales-card__header">
                <h3 className="sales-card__title"><User size={18}/> {t('customer_details')}</h3>
                {selectedCustomer && (
                    <button
                        className="sales-btn-icon sales-btn-icon--danger"
                        onClick={onClearCustomer}
                        aria-label={t('clear_customer') || 'Clear customer'}
                    >
                        <X size={16}/>
                    </button>
                )}
            </div>

            {!selectedCustomer ? (
                <div className="sales-search__wrapper">
                    <Search className="sales-search__icon" size={18}/>
                    <input
                        className="sales-search__input"
                        placeholder={t('search_customer_placeholder')}
                        value={customerSearch}
                        onChange={e => setCustomerSearch(e.target.value)}
                        onFocus={onSearchFocus}
                        onBlur={onSearchBlur}
                        aria-label={t('search_customer') || 'Search customer'}
                    />
                    <button
                        className="sales-btn-add"
                        onClick={onAddCustomer}
                        title={t('add_customer')}
                        aria-label={t('add_customer') || 'Add customer'}
                    >
                        <Plus size={20} />
                    </button>

                    {showCustDropdown && customersList.length > 0 && (
                        <ul className="sales-dropdown" role="listbox">
                            {customersList.map(cust => (
                                <li
                                    key={cust.id}
                                    onClick={() => onSelectCustomer(cust)}
                                    className="sales-dropdown__item"
                                    role="option"
                                >
                                    <div className="sales-dropdown__main">{cust.full_name}</div>
                                    <div className="sales-dropdown__sub">{cust.phone} | {cust.civil_id}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <div className="sales-customer__details">
                    <div className="sales-customer__group">
                        <label>{t('name')}</label>
                        <input
                            className="sales-customer__input"
                            value={selectedCustomer.full_name}
                            readOnly
                            aria-label={t('customer_name') || 'Customer name'}
                        />
                    </div>
                    <div className="sales-customer__group">
                        <label>{t('phone')}</label>
                        <input
                            className="sales-customer__input"
                            value={selectedCustomer.phone}
                            readOnly
                            aria-label={t('customer_phone') || 'Customer phone'}
                        />
                    </div>
                    <div className="sales-customer__group">
                        <label>{t('civil_id')}</label>
                        <input
                            className="sales-customer__input"
                            value={selectedCustomer.civil_id}
                            readOnly
                            aria-label={t('customer_civil_id') || 'Customer civil ID'}
                        />
                    </div>

                    <div className="sales-customer__group sales-customer__group--full">
                        <label>{t('id_cards')}</label>
                        <div className="sales-customer__uploads">
                            <input
                                type="file"
                                ref={frontInputRef}
                                hidden
                                onChange={e => onIdUpload(e, 'front')}
                                accept="image/*"
                                aria-label={t('upload_front_id') || 'Upload front ID'}
                            />
                            <button
                                className={`sales-upload-btn ${selectedCustomer.id_card_front_url ? 'sales-upload-btn--done' : ''}`}
                                onClick={() => frontInputRef.current?.click()}
                                aria-label={t('upload_front_id') || 'Upload front ID'}
                            >
                                {selectedCustomer.id_card_front_url ? <CheckCircle size={14}/> : <Upload size={14}/>} {t('front_id')}
                            </button>

                            <input
                                type="file"
                                ref={backInputRef}
                                hidden
                                onChange={e => onIdUpload(e, 'back')}
                                accept="image/*"
                                aria-label={t('upload_back_id') || 'Upload back ID'}
                            />
                            <button
                                className={`sales-upload-btn ${selectedCustomer.id_card_back_url ? 'sales-upload-btn--done' : ''}`}
                                onClick={() => backInputRef.current?.click()}
                                aria-label={t('upload_back_id') || 'Upload back ID'}
                            >
                                {selectedCustomer.id_card_back_url ? <CheckCircle size={14}/> : <Upload size={14}/>} {t('back_id')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerSelector;
