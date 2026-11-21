import React from "react";
import { CreditCard, Users, AlertTriangle, Scissors } from "lucide-react";

const ManagerTablesSection = ({
  theme,
  t,
  activeTab,
  showProfit,
  formatPrice,
  paymentMethods,
  staffDetailed,
  remnants,
  deadStock,
}) => {
  return (
    <>
      {(activeTab === "all" || activeTab === "drawer_staff") &&
        (paymentMethods.length > 0 || staffDetailed.length > 0) && (
          <div className="charts-grid" style={{ marginBottom: "24px" }}>
            {paymentMethods.length > 0 && (
              <div className={`chart-box chart-box--${theme}`} style={{ minHeight: "auto" }}>
                <h3 className="chart-box__title dash-icon-title">
                  <CreditCard size={20} />
                  <span>{t("payment_methods_breakdown") || "تراز صندوق شعبه (نقد و کارت‌خوان)"}</span>
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

            {staffDetailed.length > 0 && (
              <div className={`chart-box chart-box--${theme}`} style={{ minHeight: "auto" }}>
                <h3 className="chart-box__title dash-icon-title">
                  <Users size={20} />
                  <span>{t("staff_performance") || "جدول کامل عملکرد و تخفیف فروشندگان شعبه"}</span>
                </h3>
                <p className="dash-guide-text">{t("staff_performance_guide")}</p>
                <div className="stock-table-wrapper">
                  <table className={`stock-table stock-table--${theme}`}>
                    <thead className="stock-table__head">
                      <tr className="stock-table__row">
                        <th className="stock-table__header">{t("staff") || "فروشنده"}</th>
                        <th className="stock-table__header">{t("revenue") || "مبلغ فروش"}</th>
                        {showProfit && (
                          <th className="stock-table__header">{t("profit") || "سود"}</th>
                        )}
                        <th className="stock-table__header">{t("discount") || "تخفیف"}</th>
                        <th className="stock-table__header">{t("meters") || "متراژ"}</th>
                        <th className="stock-table__header">{t("invoices") || "فاکتور"}</th>
                      </tr>
                    </thead>
                    <tbody className="stock-table__body">
                      {staffDetailed.map((st, idx) => (
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

      {(activeTab === "all" || activeTab === "dead_stock") &&
        (remnants.length > 0 || deadStock.length > 0) && (
          <div className="charts-grid" style={{ marginBottom: "24px" }}>
            {remnants.length > 0 && (
              <div className={`chart-box chart-box--${theme}`} style={{ minHeight: "auto" }}>
                <h3 className="chart-box__title dash-icon-title">
                  <Scissors size={20} style={{ color: "#ec4899" }} />
                  <span>{t("branch_remnants_title")}</span>
                </h3>
                <p className="dash-guide-text">{t("branch_remnants_guide")}</p>
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

            {deadStock.length > 0 && (
              <div className={`chart-box chart-box--${theme}`} style={{ minHeight: "auto" }}>
                <h3 className="chart-box__title dash-icon-title">
                  <AlertTriangle size={20} style={{ color: "#f59e0b" }} />
                  <span>{t("dead_stock_analysis") || "طاقه‌های بدون فروش شعبه"}</span>
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

export default ManagerTablesSection;
