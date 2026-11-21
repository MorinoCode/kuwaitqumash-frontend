import React from "react";
import { CreditCard, Users, AlertTriangle, Scissors } from "lucide-react";

const OwnerTablesSection = ({
  activeTab,
  theme,
  t,
  showProfit,
  formatPrice,
  paymentMethods,
  staffPerformance,
  topItemsFull,
  deadStock,
  remnants,
  exportTopItemsCSV,
}) => {
  return (
    <>
      {(activeTab === "all" || activeTab === "drawer_staff") &&
        (paymentMethods.length > 0 || staffPerformance.length > 0) && (
          <div className="charts-grid" style={{ marginBottom: "24px" }}>
            {paymentMethods.length > 0 && (
              <div className={`chart-box chart-box--${theme}`} style={{ minHeight: "auto" }}>
                <h3 className="chart-box__title dash-icon-title">
                  <CreditCard size={20} />
                  <span>{t("payment_methods_breakdown") || "تفکیک صندوق و روش‌های دریافت پول"}</span>
                </h3>
                <p className="dash-guide-text">{t("payment_methods_guide")}</p>
                <div className="dash-pm-list">
                  {paymentMethods.map((pm, idx) => (
                    <div key={idx} className="dash-pm-row">
                      <div className="dash-pm-info">
                        <span className="dash-pm-name">{pm.method}</span>
                        <span className="dash-pm-tx">
                          {pm.transactions} {t("invoices") || "فاکتور"}
                        </span>
                      </div>
                      <div className="dash-pm-bar-wrap">
                        <div
                          className="dash-pm-bar"
                          style={{
                            width: `${Math.min(100, Math.max(4, pm.percentage || 0))}%`,
                          }}
                        />
                      </div>
                      <div className="dash-pm-values">
                        <span className="dash-pm-amount">
                          {formatPrice(pm.amount)} {t("kwd")}
                        </span>
                        <span className="dash-pm-pct">
                          {(pm.percentage || 0).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {staffPerformance.length > 0 && (
              <div className={`chart-box chart-box--${theme}`} style={{ minHeight: "auto" }}>
                <h3 className="chart-box__title dash-icon-title">
                  <Users size={20} />
                  <span>{t("staff_performance") || "عملکرد، سود و تخفیف فروشندگان"}</span>
                </h3>
                <p className="dash-guide-text">{t("staff_performance_guide")}</p>
                <div className="stock-table-wrapper">
                  <table className={`stock-table stock-table--${theme}`}>
                    <thead className="stock-table__head">
                      <tr className="stock-table__row">
                        <th className="stock-table__header">{t("staff") || "فروشنده"}</th>
                        <th className="stock-table__header">{t("revenue") || "مبلغ فروش"}</th>
                        {showProfit && (
                          <th className="stock-table__header">{t("profit") || "سود خالص"}</th>
                        )}
                        <th className="stock-table__header">{t("discount") || "تخفیف داده‌شده"}</th>
                        <th className="stock-table__header">{t("meters") || "متراژ"}</th>
                        <th className="stock-table__header">{t("invoices") || "فاکتور"}</th>
                      </tr>
                    </thead>
                    <tbody className="stock-table__body">
                      {staffPerformance.map((st, idx) => (
                        <tr
                          key={st.user_id || idx}
                          className={`stock-table__row stock-table__row--${theme}`}
                        >
                          <td className="stock-table__cell">
                            {idx < 3 && (
                              <span className="dash-rank-badge">#{idx + 1}</span>
                            )}
                            {st.name}
                          </td>
                          <td className="stock-table__cell" style={{ color: "var(--brand)", fontWeight: 700 }}>
                            {formatPrice(st.revenue)} {t("kwd")}
                          </td>
                          {showProfit && (
                            <td className="stock-table__cell" style={{ color: "var(--green)", fontWeight: 700 }}>
                              {formatPrice(st.profit)} {t("kwd")}
                            </td>
                          )}
                          <td className="stock-table__cell">
                            {formatPrice(st.total_discount || 0)} {t("kwd")}
                          </td>
                          <td className="stock-table__cell">
                            {parseFloat(st.meters || 0).toFixed(2)} {t("m") || "m"}
                          </td>
                          <td className="stock-table__cell">{st.transactions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      {(activeTab === "all" || activeTab === "top_fabrics") &&
        topItemsFull.length > 0 && (
          <div
            className={`content-panel content-panel--${theme}`}
            style={{ minHeight: "auto", marginBottom: "24px" }}
          >
            <div className="dash-panel-header">
              <div>
                <h3 className="content-panel__title" style={{ marginBottom: "4px" }}>
                  {t("top_performing_items") || "جدول کامل پرفروش‌ترین طاقه‌ها و پیش‌بینی اتمام موجودی"}
                </h3>
                <p className="dash-guide-text" style={{ marginBottom: 0 }}>
                  {t("top_items_guide")}
                </p>
              </div>
              <button
                type="button"
                onClick={exportTopItemsCSV}
                className="dash-csv-btn"
              >
                Excel / CSV
              </button>
            </div>
            <div className="stock-table-wrapper">
              <table className={`stock-table stock-table--${theme}`}>
                <thead className="stock-table__head">
                  <tr className="stock-table__row">
                    <th className="stock-table__header">{t("item_name")}</th>
                    <th className="stock-table__header">{t("pattern_or_color") || "طرح / رنگ"}</th>
                    <th className="stock-table__header">{t("fabric_type")}</th>
                    <th className="stock-table__header">{t("revenue")}</th>
                    {showProfit && (
                      <>
                        <th className="stock-table__header">{t("profit")}</th>
                        <th className="stock-table__header">{t("profit_margin_col") || "درصد سود"}</th>
                      </>
                    )}
                    <th className="stock-table__header">{t("meters_sold") || "متراژ فروش"}</th>
                    <th className="stock-table__header">{t("current_stock") || "موجودی فعلی و وضعیت"}</th>
                  </tr>
                </thead>
                <tbody className="stock-table__body">
                  {topItemsFull.map((item, idx) => {
                    const rev = parseFloat(item.revenue || 0);
                    const prof = parseFloat(item.profit || 0);
                    const margin =
                      item.profit_margin !== undefined
                        ? parseFloat(item.profit_margin)
                        : rev > 0
                          ? (prof / rev) * 100
                          : 0;
                    return (
                      <tr
                        key={item.id || idx}
                        className={`stock-table__row stock-table__row--${theme}`}
                      >
                        <td className="stock-table__cell">
                          {idx < 3 && (
                            <span className="dash-rank-badge">#{idx + 1}</span>
                          )}
                          {item.name}
                        </td>
                        <td className="stock-table__cell">
                          {item.category || item.pattern || item.color || "-"}
                        </td>
                        <td className="stock-table__cell">
                          <span className="dash-fabric-pill">{item.fabric_type || "-"}</span>
                        </td>
                        <td className="stock-table__cell" style={{ color: "var(--brand)", fontWeight: 700 }}>
                          {formatPrice(rev)} {t("kwd")}
                        </td>
                        {showProfit && (
                          <>
                            <td className="stock-table__cell" style={{ color: "var(--green)", fontWeight: 700 }}>
                              {formatPrice(prof)} {t("kwd")}
                            </td>
                            <td className="stock-table__cell">
                              <span
                                className={`dash-margin-pill ${
                                  margin >= 30
                                    ? "dash-margin-pill--high"
                                    : margin >= 15
                                      ? "dash-margin-pill--mid"
                                      : "dash-margin-pill--low"
                                }`}
                              >
                                {margin.toFixed(1)}%
                              </span>
                            </td>
                          </>
                        )}
                        <td className="stock-table__cell">
                          {parseFloat(item.meters || 0).toFixed(2)} {t("m") || "m"}
                        </td>
                        <td className="stock-table__cell">
                          <strong>{parseFloat(item.stock_meters || 0).toFixed(2)} m</strong>
                          {item.days_until_stockout !== null &&
                            item.days_until_stockout !== undefined &&
                            item.days_until_stockout <= 14 && (
                              <span className="dash-stockout-warn">
                                {item.days_until_stockout === 0
                                  ? t("out_of_stock_now")
                                  : t("days_until_stockout_badge", {
                                      days: item.days_until_stockout,
                                    })}
                              </span>
                            )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {(activeTab === "all" || activeTab === "dead_stock") &&
        (deadStock.length > 0 || remnants.length > 0) && (
          <div className="charts-grid" style={{ marginBottom: "24px" }}>
            {deadStock.length > 0 && (
              <div className={`chart-box chart-box--${theme}`} style={{ minHeight: "auto" }}>
                <h3 className="chart-box__title dash-icon-title">
                  <AlertTriangle size={20} style={{ color: "#f59e0b" }} />
                  <span>{t("dead_stock_analysis") || "طاقه‌های بدون فروش (خواب سرمایه)"}</span>
                </h3>
                <p className="dash-guide-text">{t("dead_stock_guide")}</p>
                <div className="stock-table-wrapper">
                  <table className={`stock-table stock-table--${theme}`}>
                    <thead className="stock-table__head">
                      <tr className="stock-table__row">
                        <th className="stock-table__header">{t("item_name")}</th>
                        <th className="stock-table__header">{t("fabric_type")}</th>
                        <th className="stock-table__header">{t("stock_meters") || "متراژ موجود"}</th>
                        <th className="stock-table__header">{t("days_in_stock") || "ماندگاری"}</th>
                        <th className="stock-table__header">{t("tied_capital") || "سرمایه قفل‌شده"}</th>
                      </tr>
                    </thead>
                    <tbody className="stock-table__body">
                      {deadStock.map((item) => (
                        <tr
                          key={item.id}
                          className={`stock-table__row stock-table__row--${theme}`}
                        >
                          <td className="stock-table__cell">{item.name}</td>
                          <td className="stock-table__cell">
                            <span className="dash-fabric-pill">{item.fabric_type}</span>
                          </td>
                          <td className="stock-table__cell">
                            {parseFloat(item.stock_meters || 0).toFixed(2)} m
                          </td>
                          <td className="stock-table__cell">
                            {item.days_in_stock} {t("days") || "روز"}
                          </td>
                          <td className="stock-table__cell" style={{ color: "#f59e0b", fontWeight: 700 }}>
                            {formatPrice(item.tied_capital)} {t("kwd")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {remnants.length > 0 && (
              <div className={`chart-box chart-box--${theme}`} style={{ minHeight: "auto" }}>
                <h3 className="chart-box__title dash-icon-title">
                  <Scissors size={20} style={{ color: "#ec4899" }} />
                  <span>{t("remnants_title")}</span>
                </h3>
                <p className="dash-guide-text">{t("remnants_guide")}</p>
                <div className="stock-table-wrapper">
                  <table className={`stock-table stock-table--${theme}`}>
                    <thead className="stock-table__head">
                      <tr className="stock-table__row">
                        <th className="stock-table__header">{t("item_name")}</th>
                        <th className="stock-table__header">{t("fabric_type")}</th>
                        <th className="stock-table__header">{t("pattern_or_color") || "طرح / رنگ"}</th>
                        <th className="stock-table__header">{t("stock_meters") || "متراژ باقیمانده"}</th>
                      </tr>
                    </thead>
                    <tbody className="stock-table__body">
                      {remnants.map((item) => (
                        <tr
                          key={item.id}
                          className={`stock-table__row stock-table__row--${theme}`}
                        >
                          <td className="stock-table__cell">{item.name}</td>
                          <td className="stock-table__cell">
                            <span className="dash-fabric-pill">{item.fabric_type}</span>
                          </td>
                          <td className="stock-table__cell">
                            {item.pattern !== "-" ? item.pattern : item.color}
                          </td>
                          <td className="stock-table__cell" style={{ color: "#ec4899", fontWeight: 700 }}>
                            {parseFloat(item.stock_meters || 0).toFixed(2)} m
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
    </>
  );
};

export default OwnerTablesSection;
