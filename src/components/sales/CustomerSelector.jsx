import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, Search, Plus, X } from 'lucide-react';

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
    onAddCustomer
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
                                    <div className="sales-dropdown__sub">{cust.phone} | {cust.type}</div>
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
                        <label>{t('gender')}</label>
                        <input
                            className="sales-customer__input"
                            value={selectedCustomer.gender === 'F' ? t('female') : t('male')}
                            readOnly
                            aria-label={t('gender') || 'Gender'}
                        />
                    </div>
                    <div className="sales-customer__group">
                        <label>{t('type')}</label>
                        <input
                            className="sales-customer__input"
                            value={selectedCustomer.type || 'Regular'}
                            readOnly
                            aria-label={t('customer_type') || 'Customer type'}
                        />
                    </div>
                    <div className="sales-customer__group sales-customer__group--full">
                        <label>{t('address')}</label>
                        <input
                            className="sales-customer__input"
                            value={selectedCustomer.address || '-'}
                            readOnly
                            aria-label={t('address') || 'Address'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerSelector;
