import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { useTranslation } from "react-i18next";

const BranchChart = ({
  data,
  comparisonData,
  theme,
  metricType = "revenue",
  viewType = "value",
}) => {
  const { t } = useTranslation();
  const isDark = theme === "dark";

  if (!data || data.length === 0)
    return <div className="no-data">No Data Available</div>;

  const chartData = data.map((d) => {

    let cleanName = d.name.replace(/^KuwaitQumash\s*/i, "");

    const dataKey = viewType === "quantity" ? "quantity" : metricType;

    const item = {
      ...d,
      name: cleanName,
      value: parseFloat(d[dataKey]) || 0,
    };

    if (comparisonData) {
      const compItem = comparisonData.find((c) => c.name === d.name);
      item.compare_value = compItem ? parseFloat(compItem[dataKey]) : 0;
    }

    return item;
  });

  const getChartTitle = () => {
    if (viewType === "quantity") {
      return t("quantity_items") + " - " + t("branch_performance");
    }
    return (
      (metricType === "profit" ? t("profit") : t("revenue")) +
      " - " +
      t("branch_performance")
    );
  };

  const getYAxisLabel = () => {
    return viewType === "quantity" ? t("items_sold") : "KWD";
  };

  return (
    <div className={`chart-container chart-container--${theme}`}>
      <h3 className="chart-title">{getChartTitle()}</h3>
      <div style={{ width: "100%", height: 300, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#333" : "#eee"}
            />
            <XAxis dataKey="name" stroke={isDark ? "#888" : "#666"} />
            <YAxis
              stroke={isDark ? "#888" : "#666"}
              label={{
                value: getYAxisLabel(),
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1a1a1a" : "#fff",
                borderRadius: "8px",
                border: "none",
                color: isDark ? "#ffffff" : "#1f2937",
              }}
              itemStyle={{ color: isDark ? "#ffffff" : "#1f2937" }}
              labelStyle={{ color: isDark ? "#ffffff" : "#1f2937" }}
              cursor={{ fill: isDark ? "#333" : "#f5f5f5" }}
              formatter={(value, name) => {
                const unit = viewType === "quantity" ? t("items") : "KWD";
                return [
                  `${parseFloat(value).toLocaleString()} ${unit}`,
                  name === "compare_value"
                    ? t("previous_period")
                    : metricType === "profit"
                      ? t("profit")
                      : t("revenue"),
                ];
              }}
            />
            {comparisonData && <Legend wrapperStyle={{ paddingTop: "10px" }} />}

            {comparisonData && (
              <Bar
                dataKey="compare_value"
                fill={isDark ? "#444" : "#ccc"}
                radius={[4, 4, 0, 0]}
                name={t("previous_period")}
              />
            )}

            <Bar
              dataKey="value"
              name={t("current_period")}
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === 0 ? "#B8860B" : index === 1 ? "#CD7F32" : "#888"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BranchChart;
