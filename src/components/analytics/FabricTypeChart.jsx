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

const FABRIC_COLORS = {
  Cotton: "#6366f1",
  Silk: "#8b5cf6",
  Wool: "#0ea5e9",
  Linen: "#14b8a6",
  Polyester: "#f59e0b",
  Viscose: "#ec4899",
  Chiffon: "#22d3ee",
  Crepe: "#a78bfa",
  Satin: "#f472b6",
  Velvet: "#7c3aed",
  Lace: "#94a3b8",
  Denim: "#3b82f6",
  Jersey: "#10b981",
  Organza: "#e879f9",
  Tulle: "#f9a8d4",
  Kashmir: "#fb923c",
};

const FALLBACK_COLORS = [
  "#6366f1",
  "#0ea5e9",
  "#14b8a6",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#22d3ee",
  "#a3e635",
];

const fabricColor = (name) => {
  if (name && FABRIC_COLORS[name]) return FABRIC_COLORS[name];
  const key = String(name || "");
  const hash = key.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
};

const FabricTypeChart = ({ data, comparisonData, theme, metricType, viewType }) => {
  const { t } = useTranslation();
  const isDark = theme === "dark";

  if (!data || data.length === 0)
    return <div className="no-data">No Data Available</div>;

  const dataKey = viewType === "quantity" ? "quantity" : metricType;

  const chartData = [...data]
    .sort((a, b) =>
      String(a.fabric_type || "").localeCompare(
        String(b.fabric_type || ""),
      ),
    )
    .map((d) => {
      const item = { ...d };
      if (comparisonData) {
        const compItem = comparisonData.find(
          (c) => c.fabric_type === d.fabric_type,
        );
        item.compare_value = compItem ? parseFloat(compItem[dataKey]) : 0;
      }
      return item;
    });

  const getChartTitle = () => {
    if (viewType === "quantity") {
      return t("quantity_items") + " - " + (t("fabric_distribution") || "Fabric Distribution");
    }
    return (
      (metricType === "profit" ? t("profit") : t("revenue")) +
      " - " +
      (t("fabric_distribution") || "Fabric Distribution")
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
            <XAxis dataKey="fabric_type" stroke={isDark ? "#888" : "#666"} />
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
                  fill={
                    fabricColor(entry.fabric_type)
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

export default FabricTypeChart;
