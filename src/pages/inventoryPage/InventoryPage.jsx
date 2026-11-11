import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import { FABRIC_TYPES } from "../../utils/inventoryCategories";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";

import InventoryItemRow from "../../components/inventoryItem/InventoryItem";
import { BarcodeLabel } from "../../components/barcode/BarcodeLabel";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import AddItemModal from "../../components/addItemModal/AddItemModal";
import Pagination from "../../components/pagination/Pagination";
import useBranchStore from "../../store/branchStore";
import useTenantStore from "../../store/tenantStore";
import {
  useInventory,
  useDeleteInventoryItem,
} from "../../hooks/useInventory";
import { useBranches } from "../../hooks/useBranches";
import "./InventoryPage.css";
import {
  Plus,
  Search,
  ScanLine,
  X,
  Printer,
  Gem,
  Trash2,
  Edit,
} from "lucide-react";
import BranchSelector from "../../components/analytics/BranchSelector";

const InventoryPage = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 50,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterPattern, setFilterPattern] = useState("All");
  const [filterMetal, setFilterMetal] = useState("All");
  const [filterCountry, setFilterCountry] = useState("All");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  // Tab: In Stock (default) | Sold out | Old Gold
  const [inventoryTab, setInventoryTab] = useState("in_stock");

  // Multi-branch selection
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);

  // Use Zustand for branch (sync sidebar with page branch selection)
  const {
    activeBranchId,
    activeBranchName: branchNameFromStore,
    setActiveBranch,
  } = useBranchStore();
  const activeBranchName = (branchNameFromStore || t("main_branch")).replace(
    /^KuwaitQumash\s+/i,
    "",
  );

  // Check user role
  const isOwner = user?.role === "store_owner";

  // Use React Query hooks
  const { data: branches = [], isLoading: branchesLoading } = useBranches();

  // Fetch custom options for filters

  // Use React Query for inventory
  const inventoryFilters = {
    branch_ids:
      isOwner && selectedBranchIds.length > 0
        ? selectedBranchIds.join(",")
        : undefined,
    branch_id: !isOwner ? activeBranchId : undefined,
    search: searchTerm || undefined,
    fabric_type: filterMetal !== "All" ? filterMetal : undefined,
    pattern: filterPattern !== "All" ? filterPattern : undefined,
    country_of_origin: filterCountry !== "All" ? filterCountry : undefined,
    status: inventoryTab === "sold_out" ? "Sold" : undefined,
    page: pagination.currentPage,
    limit: 50,
  };

  const { data: inventoryData, isLoading: loading } =
    useInventory(inventoryFilters);
  const items = useMemo(() => inventoryData?.data || [], [inventoryData?.data]);


  // Get unique categories from inventory items (includes both default and custom categories)
  // This ensures we show all categories that exist in the current tenant's inventory
  const uniquePatterns = useMemo(() => {
    const patterns = new Set();
    items.forEach((item) => {
      if (item.pattern) patterns.add(item.pattern);
    });
    return Array.from(patterns).sort();
  }, [items]);

  // Update pagination from API response
  useEffect(() => {
    if (inventoryData?.pagination) {
      setPagination(inventoryData.pagination);
    }
  }, [inventoryData]);

  // Use mutation for delete
  const deleteItemMutation = useDeleteInventoryItem();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printItem, setPrintItem] = useState(null);
  const printRef = useRef(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handlePrintConfirm = useReactToPrint({
    contentRef: printRef,
    onBeforeGetContent: () => {
      // Ensure printItem is loaded before printing
      if (!printItem) {
        toast.error(t("print_error") || "Print failed. Please try again.");
        return Promise.resolve();
      }
      if (!printRef.current) {
        toast.error(t("print_error") || "Print failed. Please try again.");
        return Promise.resolve();
      }
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsPrintModalOpen(false);
    },
    onPrintError: () => {
      toast.error(t("print_error") || "Print failed. Please try again.");
    },
    pageStyle: `
            @page { 
                size: 55mm 18mm; 
                margin: 0; 
            }
            body { 
                margin: 0; 
                padding: 0;
            }
            @media print {
                body * {
                    visibility: hidden;
                }
                .barcode-label-container,
                .barcode-label-container * {
                    visibility: visible;
                }
                .barcode-label-container {
                    position: absolute;
                    left: 0;
                    top: 0;
                }
            }
        `,
  });

  const searchInputRef = useRef(null);

  // activeBranchId and activeBranchName are now from Zustand store (defined above)
  // isOwner is defined above (before inventoryFilters)

  // When owner changes branch selection on this page, sync sidebar so Items tab shows same branch
  const handleBranchSelectionChange = useCallback(
    (newIds) => {
      setSelectedBranchIds(newIds);
      if (newIds.length === 1 && branches.length > 0) {
        const branch = branches.find((b) => b.id === newIds[0]);
        if (branch) setActiveBranch(branch);
      }
    },
    [branches, setActiveBranch],
  );

  // Initialize branches selection - only active branch on first load
  useEffect(() => {
    // Wait for branches to load before initializing
    if (!user || branchesLoading || branches.length === 0) return;

    // Only initialize once when selectedBranchIds is empty (first load)
    if (selectedBranchIds.length === 0) {
      // Always start with active branch, even for owners
      if (activeBranchId) {
        setSelectedBranchIds([parseInt(activeBranchId)]);
      } else if (branches.length > 0) {
        // Fallback: select first branch if no activeBranchId
        setSelectedBranchIds([branches[0].id]);
      }
    }
  }, [user?.id, branches, branchesLoading, activeBranchId, selectedBranchIds.length, user]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);


  // Inventory is now fetched via React Query hook - no need for fetchInventory function

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (tab) => {
    setInventoryTab(tab);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePrintRequest = (item) => {
    setPrintItem(item);
    setIsPrintModalOpen(true);
  };

  const handleAddItemSuccess = () => {
    // No need to manually refetch - optimistic update handles it
    // React Query will automatically update the UI
    setItemToEdit(null);
  };

  const handleEditItem = async (item) => {
    // Fetch full item details if needed (to get all fields like stones, etc.)
    try {
      // Use the item from the list, or fetch full details if needed
      // For now, use the item directly as it should have all necessary fields
      setItemToEdit(item);
      setIsAddModalOpen(true);
    } catch {
      toast.error(t("failed_to_load_item") || "Failed to load item details");
    }
  };

  const handleDeleteItem = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };


  const confirmDeleteItem = () => {
    if (itemToDelete) {
      deleteItemMutation.mutate(itemToDelete);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  // Line value: billable meters x price per meter x rolls
  const calculateLivePrice = useCallback((item) => {
    const meters = parseFloat(item.length_m ?? item.meters) || 0;
    const price = parseFloat(item.price_per_meter) || 0;
    const quantity = parseInt(item.quantity) || 1;
    return (meters * price * quantity).toFixed(3);
  }, []);

  const calculateProfit = useCallback((item) => {
    const meters = parseFloat(item.length_m ?? item.meters) || 0;
    const quantity = parseInt(item.quantity) || 1;
    const sell = parseFloat(item.price_per_meter) || 0;
    const cost = parseFloat(item.cost_per_meter) || 0;
    return ((sell - cost) * meters * quantity).toFixed(3);
  }, []);

  // Memoize filtered items to avoid recalculating on every render
  // Filter items by price (frontend filtering for price is needed because it requires live rates)
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const itemValue = parseFloat(calculateLivePrice(item)) || 0;
      const matchesMinPrice =
        !priceMin || itemValue >= parseFloat(priceMin || 0);
      const matchesMaxPrice =
        !priceMax || itemValue <= parseFloat(priceMax || 0);
      return matchesMinPrice && matchesMaxPrice;
    });
  }, [items, priceMin, priceMax, calculateLivePrice]);

  // Memoize total meters in stock
  const totalMeters = useMemo(() => {
    return filteredItems
      .reduce((acc, item) => {
        const meters = parseFloat(item.length_m) || 0;
        const quantity = parseInt(item.quantity) || 1;
        return acc + meters * quantity;
      }, 0)
      .toFixed(3);
  }, [filteredItems]);

  // Memoize total value calculation
  const totalValue = useMemo(() => {
    return filteredItems
      .reduce((acc, item) => {
        const livePrice = parseFloat(calculateLivePrice(item)) || 0;
        return acc + livePrice;
      }, 0)
      .toFixed(3);
  }, [filteredItems, calculateLivePrice]);

  // Old Gold stats (when Old Gold tab is active)

  const displayStats = {
    items: pagination.totalItems || filteredItems.length,
    meters: totalMeters,
    value: totalValue,
  };

  return (
    <div className={`inventory-page inventory-page--${theme}`}>
      <header className="inventory-page__header">
        <div className="inventory-page__header-titles">
          <h1 className="inventory-page__title">{t("branch_inventory")}</h1>
          {isOwner ? (
            <div className="inventory-branch-filter">
              <BranchSelector
                branches={branches}
                selectedBranches={selectedBranchIds}
                onSelectionChange={handleBranchSelectionChange}
              />
            </div>
          ) : (
            <p className="inventory-page__subtitle">{activeBranchName}</p>
          )}
        </div>

        <div className="inventory-page__stats-container">
          <div className="inventory-stat">
            <span>{t("items")}:</span> <strong>{displayStats.items}</strong>
          </div>
          <div className="inventory-stat">
            <span>{t("total_meters") || "Total meters"}:</span>{" "}
            <strong>
              {displayStats.meters} {t("g")}
            </strong>
          </div>
          <div className="inventory-stat inventory-stat--gold">
            <span>{t("market_value")}:</span>{" "}
            <strong>
              {displayStats.value} {t("kwd")}
            </strong>
          </div>
        </div>

        <div className="inventory-page__actions">
          {(
            <button
              className="inventory-btn inventory-btn--primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={18} /> <span>{t("add_item")}</span>
            </button>
          )}
        </div>
      </header>

      {/* Tabs: Items (In Stock) | Sold out */}
      <div className={`inventory-tabs inventory-tabs--${theme}`}>
        <button
          type="button"
          className={`inventory-tabs__tab ${inventoryTab === "in_stock" ? "inventory-tabs__tab--active" : ""}`}
          onClick={() => handleTabChange("in_stock")}
        >
          {t("items")}
        </button>
        <button
          type="button"
          className={`inventory-tabs__tab ${inventoryTab === "sold_out" ? "inventory-tabs__tab--active" : ""}`}
          onClick={() => handleTabChange("sold_out")}
        >
          {t("sold_out_items")}
        </button>
        
      </div>

      {(
        <>
          <div className="inventory-controls">
            <div className="inventory-controls__top">
              <div className="inventory-search">
                <Search size={18} className="inventory-search__icon" />
                <input
                  ref={searchInputRef}
                  className="inventory-search__input"
                  type="text"
                  placeholder={t("search_placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ScanLine
                  size={16}
                  className="inventory-search__scan-icon"
                  title={t("ready_scanner")}
                />
              </div>

              <div className="inventory-price-filter">
                <input
                  className="inventory-price-filter__input"
                  type="number"
                  placeholder={t("min_price")}
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                />
                <span className="inventory-price-filter__separator">-</span>
                <input
                  className="inventory-price-filter__input"
                  type="number"
                  placeholder={t("max_price")}
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                />
              </div>
            </div>

            <div className="inventory-controls__bottom">
              <div className="inventory-select-box">
                <select
                  className="inventory-select"
                  onChange={(e) => setFilterMetal(e.target.value)}
                  value={filterMetal}
                >
                  <option value="All">
                    {t("all_fabrics") || "All fabrics"}
                  </option>
                  {FABRIC_TYPES.map((fabric) => (
                    <option key={fabric.value} value={fabric.value}>
                      {i18n.language === "ar" ? fabric.labelAr : fabric.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="inventory-select-box">
                <select
                  className="inventory-select"
                  onChange={(e) => setFilterPattern(e.target.value)}
                  value={filterPattern}
                >
                  <option value="All">{t("all_categories")}</option>
                  <option value="Ring">{t("rings")}</option>
                  <option value="Necklace">{t("necklaces")}</option>
                  <option value="Bracelet">{t("bracelets")}</option>
                  <option value="Set">{t("sets")}</option>
                  <option value="Earring">{t("earrings")}</option>
                  <option value="Bangle">{t("bangles")}</option>
                  <option value="Pendant">{t("pendants")}</option>
                  {/* Custom categories from inventory items */}
                  {uniqueCategories
                    .filter(
                      (cat) =>
                        ![
                          "Ring",
                          "Necklace",
                          "Bracelet",
                          "Set",
                          "Earring",
                          "Bangle",
                          "Pendant",
                        ].includes(cat),
                    )
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>
              <div className="inventory-select-box">
                <select
                  className="inventory-select"
                  onChange={(e) => setFilterCountry(e.target.value)}
                  value={filterCountry}
                >
                  <option value="All">{t("all_countries")}</option>
                  <option value="Kuwait">{t("kuwait")}</option>
                  <option value="Italy">{t("italy")}</option>
                  <option value="India">{t("india")}</option>
                  <option value="UAE">{t("uae")}</option>
                  <option value="Turkey">{t("turkey")}</option>
                  <option value="Bahrain">{t("bahrain")}</option>
                  <option value="Singapore">{t("singapore")}</option>
                  <option value="Saudi Arabia">{t("saudi_arabia")}</option>
                  <option value="Other">{t("other")}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="inventory-table-container">
            {/* Desktop Table View */}
            <div className="inventory-table-wrapper">
              <table className="inventory-table">
                <thead className="inventory-table__head">
                  <tr>
                    <th>{t("item_details")}</th>
                    <th>{t("fabric_type")}</th>
                    <th>{t("pattern") || "Pattern"}</th>
                    <th>{t("length_m") || "Length (m)"}</th>
                    <th>{t("qty")}</th>
                    <th>{t("buy_price")}</th>
                    <th>{t("live_value")}</th>
                    <th>{t("profit")}</th>
                    <th>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody className="inventory-table__body">
                  {filteredItems.map((item) => (
                    <InventoryItemRow
                      key={item.id}
                      item={item}
                      calculateLivePrice={calculateLivePrice}
                      calculateProfit={calculateProfit}
                      onDelete={handleDeleteItem}
                      onPrint={handlePrintRequest}
                      onEdit={handleEditItem}
                      theme={theme}
                    />
                  ))}
                </tbody>
              </table>
              {filteredItems.length === 0 && !loading && (
                <div className="inventory-empty-state">
                  {t("no_items_found")}
                </div>
              )}
            </div>

            {/* Mobile Card View */}
            <div className="inventory-mobile-list">
              {filteredItems.length === 0 && !loading ? (
                <div className="inventory-empty-state">
                  {t("no_items_found")}
                </div>
              ) : (
                filteredItems.map((item) => {
                  const livePrice = calculateLivePrice(item);
                  const profit = calculateProfit(item);
                  const isProfitPositive = parseFloat(profit) >= 0;

                  return (
                    <div key={item.id} className="inventory-mobile-card">
                      <div className="inventory-mobile-card__header">
                        <div className="inventory-mobile-card__info">
                          <div className="inventory-mobile-card__name">
                            {item.item_name}
                          </div>
                          <div className="inventory-mobile-card__meta">
                            <span>{item.barcode}</span>
                            <span>•</span>
                            <span>{item.composition || item.pattern || "-"}</span>
                          </div>
                        </div>
                        <div className="inventory-mobile-card__actions">
                          <button
                            className="inventory-mobile-card__action-btn"
                            onClick={() => handlePrintRequest(item)}
                            title={t("print_barcode")}
                          >
                            <Printer size={16} />
                          </button>
                          <button
                            className="inventory-mobile-card__action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditItem(item);
                            }}
                            title={t("edit")}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="inventory-mobile-card__action-btn inventory-mobile-card__action-btn--delete"
                            onClick={() => handleDeleteItem(item.id)}
                            title={t("delete")}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="inventory-mobile-card__details">
                        <div className="inventory-mobile-card__detail-item">
                          <span className="inventory-mobile-card__detail-label">
                            {t("fabric_type")}
                          </span>
                          <span className="inventory-mobile-card__detail-value">
                            {item.fabric_type} {item.composition ? `- ${item.composition}` : ""}
                          </span>
                        </div>
                        <div className="inventory-mobile-card__detail-item">
                          <span className="inventory-mobile-card__detail-label">
                            {t("pattern") || "Pattern"}
                          </span>
                          <span className="inventory-mobile-card__detail-value">
                            {[item.pattern, item.color].filter(Boolean).join(" / ") || "-"}
                          </span>
                        </div>
                        <div className="inventory-mobile-card__detail-item">
                          <span className="inventory-mobile-card__detail-label">
                            {t("length_m") || "Length"}
                          </span>
                          <span className="inventory-mobile-card__detail-value">
                            {item.length_m ?? 0} m
                          </span>
                        </div>
                        <div className="inventory-mobile-card__detail-item">
                          <span className="inventory-mobile-card__detail-label">
                            {t("qty")}
                          </span>
                          <span className="inventory-mobile-card__detail-value">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="inventory-mobile-card__detail-item">
                          <span className="inventory-mobile-card__detail-label">
                            {t("buy_price")}
                          </span>
                          <span className="inventory-mobile-card__detail-value">
                            {(parseFloat(item.cost_per_meter) || 0).toFixed(
                              3,
                            )}
                          </span>
                        </div>
                        <div className="inventory-mobile-card__detail-item">
                          <span className="inventory-mobile-card__detail-label">
                            {t("live_value")}
                          </span>
                          <span className="inventory-mobile-card__detail-value inventory-mobile-card__detail-value--gold">
                            {livePrice || "0.000"}
                          </span>
                        </div>
                        <div className="inventory-mobile-card__detail-item">
                          <span className="inventory-mobile-card__detail-label">
                            {t("profit")}
                          </span>
                          <span
                            className={`inventory-mobile-card__detail-value inventory-mobile-card__detail-value--profit ${isProfitPositive ? "inventory-mobile-card__detail-value--pos" : "inventory-mobile-card__detail-value--neg"}`}
                          >
                            {profit || "0.000"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {/* Pagination - only for inventory tabs */}
      {!loading && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setItemToEdit(null);
        }}
        onSuccess={handleAddItemSuccess}
        activeBranchId={activeBranchId}
        itemToEdit={itemToEdit}
      />

      {isPrintModalOpen && printItem && (
        <div className="inventory-modal-overlay">
          <div
            className={`inventory-modal inventory-modal--${theme} inventory-modal--small`}
          >
            <div className="inventory-modal__header">
              <h2 className="inventory-modal__title">{t("print_preview")}</h2>
              <button
                className="inventory-modal__close"
                onClick={() => setIsPrintModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="inventory-modal__body inventory-modal__body--center">
              <div className="print-preview-area">
                <BarcodeLabel
                  item={printItem}
                  shopName={useTenantStore.getState().tenantName || ""}
                  showShopName={false}
                />
              </div>
              {/* Hidden Component for ReactToPrint - Must always render when modal is open */}
              <div
                style={{
                  position: "absolute",
                  left: "-9999px",
                  top: "-9999px",
                  visibility: "hidden",
                  width: "55mm",
                  height: "18mm",
                }}
              >
                <BarcodeLabel
                  ref={printRef}
                  item={printItem}
                  shopName={useTenantStore.getState().tenantName || ""}
                  showShopName={false}
                />
              </div>
              <button
                className="inventory-btn inventory-btn--primary"
                onClick={(e) => {
                  e.preventDefault();
                  if (!printItem) {
                    toast.error(
                      t("print_error") || "Print failed. Item not loaded.",
                    );
                    return;
                  }
                  if (!printRef.current) {
                    toast.error(
                      t("print_error") ||
                        "Print preview not ready. Please try again.",
                    );
                    return;
                  }
                  handlePrintConfirm();
                }}
              >
                <Printer size={18} /> {t("print") || "Print"}
              </button>
            </div>
          </div>
        </div>
      )}

            {/* Delete Confirmation Modal (Items) */}
      {isDeleteModalOpen && (
        <div className="inventory-modal-overlay">
          <div className={`inventory-modal inventory-modal--${theme}`}>
            <div className="inventory-modal__header">
              <h3 className="inventory-modal__title">
                {t("confirm") || "Confirm"}
              </h3>
              <button
                className="inventory-modal__close"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setItemToDelete(null);
                }}
              >
                <X size={24} />
              </button>
            </div>
            <div className="inventory-modal__body">
              <p>
                {t("confirm_delete_item") ||
                  "Are you sure you want to delete this item?"}
              </p>
              <div
                style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}
              >
                <button
                  className="inventory-btn inventory-btn--secondary"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setItemToDelete(null);
                  }}
                  style={{ flex: 1 }}
                >
                  {t("cancel") || "Cancel"}
                </button>
                <button
                  className="inventory-btn inventory-btn--danger"
                  onClick={confirmDeleteItem}
                  style={{ flex: 1 }}
                >
                  {t("delete") || "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
