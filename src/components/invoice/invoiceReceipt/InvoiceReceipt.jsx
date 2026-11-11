import React from 'react';
import './InvoiceReceipt.css';

export const InvoiceReceipt = React.forwardRef(({ data }, ref) => {
  if (!data) return null;

  const { invoice_number, createdAt, customer, items, total_amount, payments, user } = data;
  
  const totalMeters = items.reduce(
    (sum, item) => sum + (parseFloat(item.meters) || 0) * (parseInt(item.quantity, 10) || 1),
    0,
  );
  
  // ⭐ FIX: Ensure Image URLs are absolute for the browser to load them correctly
  const API_URL = 'http://localhost:5000'; 
  
  const getFullImgUrl = (url) => {
      if (!url) return null;
      if (url.startsWith('http')) return url; // Cloudinary or absolute
      return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`; // Localhost
  };

  const idFront = getFullImgUrl(customer.id_card_front_url);
  const idBack = getFullImgUrl(customer.id_card_back_url);

  return (
    <div className="invoice-print-container" ref={ref}>
      <div className="invoice-box">
        
        <div className="invoice-header">
          <h1 className="invoice-title">Sell Invoice</h1>
          <p style={{margin:0, fontSize:12}}>{user?.branch?.name || "Main Branch"}</p>
        </div>

        <div className="invoice-info-grid">
          <div className="info-row">
            <div className="info-cell label">Invoice No</div>
            <div className="info-cell value">{invoice_number}</div>
            <div className="info-cell label">Date</div>
            <div className="info-cell value">{new Date(createdAt).toLocaleString()}</div>
          </div>

          <div className="info-row">
            <div className="info-cell label">Name</div>
            <div className="info-cell value wide">{customer.full_name}</div>
            <div className="info-cell label">Phone</div>
            <div className="info-cell value">{customer.phone}</div>
          </div>

          <div className="info-row">
            <div className="info-cell label">Address</div>
            <div className="info-cell value wide">{customer.address || "N/A"}</div>
            <div className="info-cell label">Civil ID</div>
            <div className="info-cell value">{customer.civil_id}</div>
          </div>
        </div>

        <table className="invoice-receipt-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Fabric</th>
              <th>Price/m</th>
              <th>Discount</th>
              <th>Meters</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.item_name}</td>
                <td>1</td>
                <td>{item.fabric_type || "-"}</td>
                <td>{parseFloat(item.price_per_meter).toFixed(3)}</td>
                <td>{parseFloat(item.discount || 0).toFixed(3)}</td>
                <td>{parseFloat(item.meters || 0).toFixed(3)}</td>
                <td>{parseFloat(item.total_price).toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-totals">
          <div className="total-box"><span>Total meters</span><strong>{totalMeters.toFixed(3)} m</strong></div>
          <div className="total-box main-total"><span>NET TOTAL</span><strong>{parseFloat(total_amount).toFixed(3)} KD</strong></div>
        </div>

        <div className="payment-breakdown" style={{marginTop:10, fontSize:11}}>
            <strong>Payment: </strong>
            {payments && payments.map((p, i) => (
                <span key={i} style={{marginRight:10}}>{p.method}: {parseFloat(p.amount).toFixed(3)} KD</span>
            ))}
        </div>

        {/* KYC Section */}
        <div className="kyc-container" dir="rtl">
          <table className="kyc-table">
            <tbody>
              <tr>
                <td className="kyc-header-cell">سبب الشراء</td>
                <td colSpan="2"><div className="kyc-check-item"><div className="kyc-box"></div><span>استثمار</span></div></td>
                <td><div className="kyc-check-item"><div className="kyc-box"></div><span>ادخار</span></div></td>
                <td><div className="kyc-check-item"><div className="kyc-box"></div><span>هديه</span></div></td>
                <td><div className="kyc-check-item"><div className="kyc-box"></div><span>أخرى</span></div></td>
              </tr>
              <tr>
                <td className="kyc-header-cell">مصدر الاموال</td>
                <td><div className="kyc-check-item"><div className="kyc-box"></div><span>راتب</span></div></td>
                <td><div className="kyc-check-item"><div className="kyc-box"></div><span>نهاية الخدمة</span></div></td>
                <td><div className="kyc-check-item"><div className="kyc-box"></div><span>ادخار تجاري</span></div></td>
                <td><div className="kyc-check-item"><div className="kyc-box"></div><span>قرض / تمويل</span></div></td>
                <td><div className="kyc-check-item"><div className="kyc-box"></div><span>أخرى</span></div></td>
              </tr>
              <tr>
                <td className="kyc-header-cell">الوظيفه</td>
                <td colSpan="2" className="kyc-blank-cell"></td>
                <td colSpan="2" className="kyc-header-cell" style={{textAlign: 'center'}}>هل انت او اي من اقاربك معرض سياسيا</td>
                <td>
                  <div className="kyc-inline-checks">
                    <div className="kyc-check-item"><div className="kyc-box"></div><span>لا</span></div>
                    <div className="kyc-check-item"><div className="kyc-box"></div><span>نعم</span></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="kyc-signatures">
            <div className="kyc-sig-block">
              <span className="kyc-sig-label">توقيع العميل</span>
            </div>
            <div className="kyc-sig-block">
              <span className="kyc-sig-label">اسم البائع/ 1.</span>
              <div className="kyc-seller-name">{user?.full_name || "Admin"}</div>
            </div>
          </div>
        </div>

        {/* ID Cards Section */}
        {(idFront || idBack) && (
            <div className="id-card-section">
                {idFront && (
                    <img 
                        src={idFront} 
                        alt="ID Front" 
                        className="customer-id-img" 
                        loading="lazy"
                        onError={(e) => e.target.style.display = 'none'} 
                    />
                )}
                {idBack && (
                    <img 
                        src={idBack} 
                        alt="ID Back" 
                        className="customer-id-img" 
                        loading="lazy"
                        onError={(e) => e.target.style.display = 'none'} 
                    />
                )}
            </div>
        )}

      </div>
    </div>
  );
});