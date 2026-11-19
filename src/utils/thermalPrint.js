import useTenantStore from "../store/tenantStore";

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatKwd = (amount) => {
  const num = Number.parseFloat(amount);
  return Number.isFinite(num) ? num.toFixed(3) : "0.000";
};

const formatMeters = (value) => {
  const num = Number.parseFloat(value);
  return Number.isFinite(num) ? num.toFixed(2) : "0.00";
};

const RECEIPT_LABELS = {
  en: {
    invoice: "Invoice",
    date: "Date",
    customer: "Customer",
    phone: "Phone",
    branch: "Branch",
    cashier: "Cashier",
    item: "Item",
    qty: "Qty / M",
    total: "Total",
    subtotal: "Subtotal",
    discount: "Discount",
    netTotal: "Net Total (KWD)",
    payments: "Payments",
    thanks: "Thank you for shopping with us!",
    kwd: "KWD",
    meterAbbr: "m",
  },
  fa: {
    invoice: "فاکتور",
    date: "تاریخ",
    customer: "مشتری",
    phone: "تلفن",
    branch: "شعبه",
    cashier: "صندوق‌دار",
    item: "کالا",
    qty: "تعداد / متراژ",
    total: "جمع",
    subtotal: "مجموع اقلام",
    discount: "تخفیف",
    netTotal: "مبلغ نهایی (دینار)",
    payments: "پرداخت‌ها",
    thanks: "از خرید شما سپاسگزاریم!",
    kwd: "د.ک",
    meterAbbr: "متر",
  },
  ar: {
    invoice: "فاتورة",
    date: "التاريخ",
    customer: "العميل",
    phone: "الهاتف",
    branch: "الفرع",
    cashier: "الكاشير",
    item: "الصنف",
    qty: "الكمية / المتر",
    total: "المجموع",
    subtotal: "المجموع الفرعي",
    discount: "الخصم",
    netTotal: "الصافي (د.ك)",
    payments: "المدفوعات",
    thanks: "شكراً لتسوقكم معنا!",
    kwd: "د.ك",
    meterAbbr: "م",
  },
};

export const buildThermalReceiptHtml = (
  invoice,
  { lang = "ar", storeName = "" } = {},
) => {
  const normalizedLang = String(lang || "ar").slice(0, 2);
  const labels = RECEIPT_LABELS[normalizedLang] || RECEIPT_LABELS.ar;
  const isRtl = normalizedLang === "ar" || normalizedLang === "fa";

  const effectiveStoreName =
    storeName ||
    (typeof useTenantStore !== "undefined" && useTenantStore.getState?.()?.tenantName) ||
    (typeof useTenantStore !== "undefined" && useTenantStore.getState?.()?.tenantId) ||
    invoice?.tenant_name ||
    invoice?.branch?.name ||
    "";

  const items = Array.isArray(invoice?.items) ? invoice.items : [];
  const payments = Array.isArray(invoice?.payments) ? invoice.payments : [];
  const dateStr = invoice?.createdAt || invoice?.created_at
    ? new Date(invoice.createdAt || invoice.created_at).toLocaleString(
        normalizedLang === "ar" ? "ar-KW" : normalizedLang === "fa" ? "fa-IR" : "en-GB",
      )
    : new Date().toLocaleString();

  let calculatedSubtotal = 0;

  const itemRows = items
    .map((item) => {
      const rawName =
        normalizedLang === "ar" && item.item_name_ar
          ? item.item_name_ar
          : item.item_name || item.fabric_type || `#${item.inventory_item_id || ""}`;
      const nameWithColor = item.color ? `${rawName} (${item.color})` : rawName;
      const name = escapeHtml(nameWithColor);

      const metersVal = Number(item.meters_sold ?? item.meters ?? 0);
      const qtyVal = Number(item.quantity_sold ?? item.quantity ?? 1);

      let lineMetric = "";
      if (metersVal > 0) {
        if (qtyVal > 1) {
          lineMetric = `${escapeHtml(qtyVal)}x ${formatMeters(metersVal)}${labels.meterAbbr}`;
        } else {
          lineMetric = `${formatMeters(metersVal)}${labels.meterAbbr}`;
        }
      } else {
        lineMetric = `x${escapeHtml(qtyVal)}`;
      }

      let lineTotalVal = null;
      if (item.total_price != null && !Number.isNaN(Number(item.total_price))) {
        lineTotalVal = Number(item.total_price);
      } else if (item.line_total != null && !Number.isNaN(Number(item.line_total))) {
        lineTotalVal = Number(item.line_total);
      } else if (item.subtotal != null && !Number.isNaN(Number(item.subtotal))) {
        lineTotalVal = Number(item.subtotal);
      } else {
        const unitRate = Number(item.price_per_meter || item.unit_price || 0);
        const basis = metersVal > 0 ? metersVal : qtyVal;
        lineTotalVal = Math.max(0, unitRate * basis - Number(item.discount || 0));
      }

      calculatedSubtotal += lineTotalVal;
      const lineTotalStr = formatKwd(lineTotalVal);

      const unitRate = Number(item.price_per_meter || item.unit_price || 0);
      const rateSubtitle =
        unitRate > 0
          ? `<div class="sub-rate">@ ${formatKwd(unitRate)} /${labels.meterAbbr}</div>`
          : "";

      return `
        <tr>
          <td class="col-item">
            <div class="item-name">${name}</div>
            ${rateSubtitle}
          </td>
          <td class="col-qty">${lineMetric}</td>
          <td class="col-total">${lineTotalStr}</td>
        </tr>`;
    })
    .join("");

  const paymentRows = payments
    .map(
      (p) =>
        `<div class="row"><span>${escapeHtml(p.method || "Cash")}${p.reference_number ? ` (#${escapeHtml(p.reference_number)})` : ""}</span><span>${formatKwd(p.amount)} ${labels.kwd}</span></div>`,
    )
    .join("");

  const discountVal = Number.parseFloat(invoice?.total_discount || 0);
  const netTotalVal = Number.parseFloat(invoice?.total_amount ?? calculatedSubtotal);
  const grossSubtotal = discountVal > 0 ? netTotalVal + discountVal : calculatedSubtotal;

  return `<!DOCTYPE html>
<html lang="${escapeHtml(normalizedLang)}" dir="${isRtl ? "rtl" : "ltr"}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(invoice?.invoice_number || "Receipt")}</title>
  <style>
    @page { size: 80mm auto; margin: 2mm; }
    * { box-sizing: border-box; }
    body {
      width: 74mm;
      margin: 0 auto;
      padding: 4px 2px;
      font-family: 'Cairo', 'Tajawal', Tahoma, Arial, sans-serif;
      font-size: 11px;
      color: #000;
      background: #fff;
    }
    .center { text-align: center; }
    .store { font-size: 15px; font-weight: bold; margin-bottom: 2px; }
    .meta { font-size: 10px; line-height: 1.45; margin-bottom: 6px; }
    .divider { border-top: 1px dashed #000; margin: 6px 0; }
    table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
    th, td { padding: 3px 2px; vertical-align: top; }
    th { border-bottom: 1px solid #000; text-align: start; font-weight: bold; }
    .col-item { width: 48%; word-break: break-word; }
    .col-qty { width: 24%; text-align: center; white-space: nowrap; }
    .col-total { width: 28%; text-align: end; white-space: nowrap; }
    .item-name { font-weight: 500; }
    .sub-rate { font-size: 9px; color: #444; margin-top: 1px; }
    .row { display: flex; justify-content: space-between; margin: 2px 0; }
    .grand { font-size: 13px; font-weight: bold; margin-top: 4px; border-top: 1px solid #000; padding-top: 4px; }
    .footer { margin-top: 10px; text-align: center; font-size: 10px; }
    .brand-tag { font-size: 8px; color: #666; margin-top: 3px; }
    @media print {
      body { width: 74mm; }
    }
  </style>
</head>
<body>
  <div class="center store">${escapeHtml(effectiveStoreName || invoice?.branch?.name || "")}</div>
  ${
    invoice?.branch?.name && invoice.branch.name !== effectiveStoreName
      ? `<div class="center" style="font-size: 10.5px; color: #333; margin-bottom: 2px;">${escapeHtml(invoice.branch.name)}</div>`
      : ""
  }
  <div class="center meta">
    ${invoice?.branch?.location ? `${escapeHtml(invoice.branch.location)}<br/>` : ""}
    ${escapeHtml(labels.invoice)}: <strong>${escapeHtml(invoice?.invoice_number || "-")}</strong><br/>
    ${escapeHtml(labels.date)}: ${escapeHtml(dateStr)}
    ${invoice?.branch?.phone ? `<br/>${escapeHtml(labels.phone)}: ${escapeHtml(invoice.branch.phone)}` : ""}
    ${invoice?.creator?.full_name ? `<br/>${escapeHtml(labels.cashier)}: ${escapeHtml(invoice.creator.full_name)}` : ""}
    ${invoice?.customer?.full_name ? `<br/>${escapeHtml(labels.customer)}: ${escapeHtml(invoice.customer.full_name)}` : ""}
    ${invoice?.customer?.phone ? `<br/>${escapeHtml(labels.phone)}: ${escapeHtml(invoice.customer.phone)}` : ""}
  </div>
  <div class="divider"></div>
  <table>
    <thead>
      <tr>
        <th class="col-item">${escapeHtml(labels.item)}</th>
        <th class="col-qty">${escapeHtml(labels.qty)}</th>
        <th class="col-total">${escapeHtml(labels.total)}</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>
  <div class="divider"></div>
  ${
    discountVal > 0
      ? `
      <div class="row"><span>${escapeHtml(labels.subtotal)}</span><span>${formatKwd(grossSubtotal)} ${labels.kwd}</span></div>
      <div class="row"><span>${escapeHtml(labels.discount)}</span><span>-${formatKwd(discountVal)} ${labels.kwd}</span></div>`
      : ""
  }
  <div class="row grand">
    <span>${escapeHtml(labels.netTotal)}</span>
    <span>${formatKwd(netTotalVal)} ${labels.kwd}</span>
  </div>
  ${paymentRows ? `<div class="divider"></div><div style="font-weight:bold;margin-bottom:2px;">${escapeHtml(labels.payments)}</div>${paymentRows}` : ""}
  <div class="divider"></div>
  <div class="footer">
    ${escapeHtml(labels.thanks)}
    ${effectiveStoreName ? `<div class="brand-tag">${escapeHtml(effectiveStoreName)}</div>` : ""}
  </div>
</body>
</html>`;
};

export const printThermalReceipt = (invoice, options = {}) => {
  if (!invoice || typeof document === "undefined") return false;

  const resolvedOptions = {
    lang: "ar",
    ...options,
  };

  const html = buildThermalReceiptHtml(invoice, resolvedOptions);
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.setAttribute("aria-hidden", "true");

  document.body.appendChild(iframe);

  const cleanup = () => {
    setTimeout(() => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    }, 1000);
  };

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      cleanup();
    }
  };

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();
  } else {
    iframe.srcdoc = html;
  }

  return true;
};
