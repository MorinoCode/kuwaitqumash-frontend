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

const KARAT_COLORS = {
  "24K": "#FFD700", // Pure gold
  "22K": "#DAA520", // Goldenrod
  "21K": "#B8860B", // Dark goldenrod
  "18K": "#CD7F32", // Bronze
};

const KaratChart = ({ data, comparisonData, theme, metricType, viewType }) => {
  const { t } = useTranslation();
  const isDark = theme === "dark";

  if (!data || data.length === 0)
    return <div className="no-data">No Data Available</div>;

  // Determine which data key to use
  const dataKey = viewType === "quantity" ? "quantity" : metricType;

  // Merge and sort data
  const chartData = [...data]
    .sort((a, b) => {
      const karatA = parseInt(a.karat);
      const karatB = parseInt(b.karat);
      return karatB - karatA;
    })
    .map((d) => {
      const item = { ...d };
      if (comparisonData) {
        const compItem = comparisonData.find((c) => c.karat === d.karat);
        item.compare_value = compItem ? parseFloat(compItem[dataKey]) : 0;
      }
      return item;
    });

  // Get chart title
  const getChartTitle = () => {
    if (viewType === "quantity") {
      return t("quantity_items") + " - " + t("karat_distribution");
    }
    return (
      (metricType === "profit" ? t("profit") : t("revenue")) +
      " - " +
      t("karat_distribution")
    );
  };

  // Get Y-axis label
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
            <XAxis dataKey="karat" stroke={isDark ? "#888" : "#666"} />
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
              dataKey={dataKey}
              radius={[4, 4, 0, 0]}
              name={t("current_period")}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={KARAT_COLORS[entry.karat] || "#B8860B"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default KaratChart;
