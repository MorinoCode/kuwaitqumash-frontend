import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, ScanLine } from 'lucide-react';

const ItemSelector = ({
    itemSearch,
    setItemSearch,
    inventoryList,
    showItemDropdown,
    onAddToCart,
    onScanClick,
    onAddItemClick,
    onSearchFocus,
    onSearchBlur,
    itemInputRef
}) => {
    const { t, i18n } = useTranslation();

    return (
        <div className="sales-card sales-search">
            <div className="sales-search__wrapper">
                <Search className="sales-search__icon" size={20}/>
                <input 
                    ref={itemInputRef}
                    className="sales-search__input"
                    placeholder={t('scan_barcode_placeholder')} 
                    value={itemSearch}
                    onChange={e => setItemSearch(e.target.value)}
                    onFocus={onSearchFocus}
                    onBlur={onSearchBlur}
                    autoFocus
                    aria-label={t('search_item') || 'Search item'}
                />
                <button
                    type="button"
                    className="sales-search__scan-btn"
                    onClick={onScanClick}
                    title={t('scan_with_camera') || 'Scan with camera'}
                    aria-label={t('scan_with_camera') || 'Scan with camera'}
                >
                    <ScanLine size={18} className="sales-search__scan-icon" />
                </button>
                <button
                    type="button"
                    className="sales-search__add-item-btn"
                    onClick={onAddItemClick}
                    title={t('add_new_item') || 'Add new item to inventory'}
                    aria-label={t('add_new_item') || 'Add new item to inventory'}
                >
                    <Plus size={18} />
                </button>
                {showItemDropdown && inventoryList.length > 0 && (
                    <ul className="sales-dropdown" role="listbox">
                        {inventoryList.map(item => (
                            <li 
                                key={item.id} 
                                onClick={() => onAddToCart(item)} 
                                className="sales-dropdown__item"
                                role="option"
                            >
                                <div className="sales-dropdown__main">
                                    {i18n.language === 'ar' && item.item_name_ar ? item.item_name_ar : item.item_name}
                                </div>
                                <div className="sales-dropdown__sub">
                                    {item.barcode} | {item.weight}g {item.karat ? `| ${item.karat}K` : ''}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ItemSelector;
