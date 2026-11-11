import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import "./DateRangePicker.css";

const QUICK_RANGES = {
  TODAY: "today",
  LAST_7_DAYS: "last_7_days",
  LAST_30_DAYS: "last_30_days",
  THIS_MONTH: "this_month",
  LAST_MONTH: "last_month",
  CUSTOM: "custom",
};

const DateRangePicker = ({
  onRangeChange,
  defaultRange = QUICK_RANGES.TODAY,
}) => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [selectedRange, setSelectedRange] = useState(defaultRange);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const onRangeChangeRef = useRef(onRangeChange);
  const defaultRangeRef = useRef(defaultRange);
  useEffect(() => { onRangeChangeRef.current = onRangeChange; }, [onRangeChange]);

  const getDateRange = (range) => {
    const today = new Date();
    const start = new Date();
    const end = new Date();

    switch (range) {
      case QUICK_RANGES.TODAY:
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case QUICK_RANGES.LAST_7_DAYS:
        start.setDate(today.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case QUICK_RANGES.LAST_30_DAYS:
        start.setDate(today.getDate() - 30);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case QUICK_RANGES.THIS_MONTH:
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case QUICK_RANGES.LAST_MONTH:
        start.setMonth(today.getMonth() - 1);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(today.getMonth());
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        return null;
    }

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  };

  const handleRangeSelect = (range) => {
    setSelectedRange(range);
    setShowCustomPicker(false);

    if (range === QUICK_RANGES.CUSTOM) {
      setShowCustomPicker(true);
      return;
    }

    const dateRange = getDateRange(range);
    if (dateRange && onRangeChange) {
      onRangeChange(dateRange.start, dateRange.end, range);
    }
  };

  const handleCustomDateSubmit = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      if (onRangeChange) {
        onRangeChange(
          start.toISOString(),
          end.toISOString(),
          QUICK_RANGES.CUSTOM,
        );
      }
      setShowCustomPicker(false);
    }
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (defaultRangeRef.current && defaultRangeRef.current !== QUICK_RANGES.CUSTOM) {
      const dateRange = getDateRange(defaultRangeRef.current);
      if (dateRange && onRangeChangeRef.current) {
        onRangeChangeRef.current(dateRange.start, dateRange.end, defaultRangeRef.current);
      }
    }
  }, []);

  return (
    <div
      className={`date-range-picker date-range-picker--${theme}`}
      dir={i18n.language === "ar" || i18n.language === "fa" ? "rtl" : "ltr"}
    >
      <div className="date-range-picker__quick-selects">
        <button
          className={`date-range-picker__btn ${selectedRange === QUICK_RANGES.TODAY ? "date-range-picker__btn--active" : ""}`}
          onClick={() => handleRangeSelect(QUICK_RANGES.TODAY)}
        >
          {t("today")}
        </button>
        <button
          className={`date-range-picker__btn ${selectedRange === QUICK_RANGES.LAST_7_DAYS ? "date-range-picker__btn--active" : ""}`}
          onClick={() => handleRangeSelect(QUICK_RANGES.LAST_7_DAYS)}
        >
          {t("last_7_days")}
        </button>
        <button
          className={`date-range-picker__btn ${selectedRange === QUICK_RANGES.LAST_30_DAYS ? "date-range-picker__btn--active" : ""}`}
          onClick={() => handleRangeSelect(QUICK_RANGES.LAST_30_DAYS)}
        >
          {t("last_30_days")}
        </button>
        <button
          className={`date-range-picker__btn ${selectedRange === QUICK_RANGES.THIS_MONTH ? "date-range-picker__btn--active" : ""}`}
          onClick={() => handleRangeSelect(QUICK_RANGES.THIS_MONTH)}
        >
          {t("this_month")}
        </button>
        <button
          className={`date-range-picker__btn ${selectedRange === QUICK_RANGES.LAST_MONTH ? "date-range-picker__btn--active" : ""}`}
          onClick={() => handleRangeSelect(QUICK_RANGES.LAST_MONTH)}
        >
          {t("last_month")}
        </button>
        <button
          className={`date-range-picker__btn date-range-picker__btn--custom ${selectedRange === QUICK_RANGES.CUSTOM ? "date-range-picker__btn--active" : ""}`}
          onClick={() => handleRangeSelect(QUICK_RANGES.CUSTOM)}
        >
          <Calendar size={16} />
          {t("custom_range")}
        </button>
      </div>

      {showCustomPicker && (
        <div
          className={`date-range-picker__custom date-range-picker__custom--${theme}`}
        >
          <div className="date-range-picker__custom-inputs">
            <div className="date-range-picker__input-group">
              <label>{t("start_date")}:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={formatDateForInput(new Date())}
              />
            </div>
            <div className="date-range-picker__input-group">
              <label>{t("end_date")}:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={formatDateForInput(new Date())}
                min={startDate}
              />
            </div>
            <button
              className="date-range-picker__apply-btn"
              onClick={handleCustomDateSubmit}
              disabled={!startDate || !endDate}
            >
              {t("apply")}
            </button>
            <button
              className="date-range-picker__cancel-btn"
              onClick={() => {
                setShowCustomPicker(false);
                setStartDate("");
                setEndDate("");
              }}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
