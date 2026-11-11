import React from "react";
import Barcode from "react-barcode";
import { useTranslation } from "react-i18next";
import "./BarcodeLabel.css";

function barcodeValueForCode128(value) {
  const raw = (value || "").toString().trim();
  const asciiOnly = raw.replace(/[^A-Za-z0-9-]/g, "");
  return asciiOnly.length > 0 ? asciiOnly : "NOCODE";
}

export const BarcodeLabel = React.forwardRef(
  ({ item, shopName, showShopName = false }, ref) => {
    const { t, i18n } = useTranslation();

    if (!item) return null;

    const lengthMeters = parseFloat(item.length_m || 0).toFixed(3);
    const itemName =
      i18n.language === "ar" && item.item_name_ar
        ? item.item_name_ar
        : item.item_name || "";
    const barcodeText = item.barcode || "NOCODE";
    const barcodeValue = barcodeValueForCode128(barcodeText);

    return (
      <div ref={ref} className="barcode-label-container">

        <div className="barcode-label__top">
          <span className="barcode-label__item-name-full">{itemName}</span>
        </div>

        <div className="barcode-label__main">

          <div className="barcode-label__left-col">
            {showShopName && shopName && (
              <span className="barcode-label__shop-name">{shopName}</span>
            )}
            <span className="barcode-label__price barcode-label__weight">
              {lengthMeters} {t("m") || "m"}
            </span>
            <div className="barcode-label__details">
              {item.pattern && (
                <span className="barcode-label__detail-item">
                  {item.pattern}K
                </span>
              )}
              {item.country_of_origin && (
                <span className="barcode-label__detail-item barcode-label__country">
                  {item.country_of_origin.substring(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            <div className="barcode-label__meta">
              <span className="barcode-label__type">
                {item.fabric_type}{" "}
                {item.color ? `· ${item.color}` : ""}
              </span>
              {(item.composition || item.pattern) && (
                <span className="barcode-label__category">
                  {item.composition || item.pattern}
                </span>
              )}
            </div>
          </div>

          <div className="barcode-label__right-col">
            <div className="barcode-label__barcode-wrapper">
              <Barcode
                value={barcodeValue}
                width={1}
                height={25}
                fontSize={8}
                format="CODE128"
                displayValue={false}
                margin={0}
                background="transparent"
              />
            </div>
            <span className="barcode-label__code">{barcodeText}</span>
          </div>
        </div>
      </div>
    );
  }
);

BarcodeLabel.displayName = "BarcodeLabel";
