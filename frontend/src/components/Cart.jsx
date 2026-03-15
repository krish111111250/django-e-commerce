import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCart);
  }, []);

  const removeFromCart = (id) => {
    const newCart = cartItems.filter(item => item._id !== id);
    setCartItems(newCart);
    localStorage.setItem('cartItems', JSON.stringify(newCart));
  };

  const updateQty = (id, qty) => {
    const newCart = cartItems.map(item =>
      item._id === id ? { ...item, qty: Number(qty) } : item
    );
    setCartItems(newCart);
    localStorage.setItem('cartItems', JSON.stringify(newCart));
  };

  const checkoutHandler = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) navigate('/login');
    else navigate('/shipping');
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + Number(item.price) * Number(item.qty || 1), 0).toFixed(2);
  const totalItems = cartItems.reduce((acc, item) => acc + Number(item.qty || 1), 0);

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    return `https://django-e-commerce-production-f7fc.up.railway.app${img}`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --accent: #c8a96e;
          --accent-light: #e8d5b0;
          --accent-dim: rgba(200,169,110,0.12);
          --text: #1a1a1a;
          --text-muted: #777;
          --border: #e8e4df;
          --surface: #ffffff;
          --surface2: #f8f6f3;
          --surface3: #f2efe9;
          --radius: 14px;
          --radius-sm: 8px;
          --shadow: 0 2px 16px rgba(0,0,0,0.07);
        }

        .cart-wrap {
          min-height: 100vh;
          background: var(--surface2);
          font-family: 'DM Sans', sans-serif;
          padding-bottom: 4rem;
        }

        /* ── PAGE HEADER ── */
        .cart-header {
          background: linear-gradient(135deg, #0d0d0d, #1a1612);
          padding: 2.5rem 1.5rem;
          text-align: center;
          position: relative;
        }
        .cart-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 80% at 50% 0%, rgba(200,169,110,0.1) 0%, transparent 70%);
        }
        .cart-header-eyebrow {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.4rem;
          opacity: 0.85;
        }
        .cart-header-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem, 4vw, 2.2rem);
          font-weight: 700;
          color: #fff;
          margin: 0;
          position: relative;
        }
        .cart-header-title span {
          color: var(--accent);
        }

        /* ── CONTAINER ── */
        .cart-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        /* ── EMPTY STATE ── */
        .cart-empty {
          text-align: center;
          padding: 5rem 2rem;
          background: var(--surface);
          border: 1px dashed var(--border);
          border-radius: var(--radius);
        }
        .cart-empty-icon { font-size: 3.5rem; margin-bottom: 1rem; opacity: 0.35; }
        .cart-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          color: var(--text);
          margin-bottom: 0.5rem;
        }
        .cart-empty-text { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem; }
        .cart-empty-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0.65rem 1.5rem;
          background: #0d0d0d;
          color: #fff;
          border-radius: var(--radius-sm);
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          transition: background 0.2s;
        }
        .cart-empty-btn:hover { background: var(--accent); color: #0d0d0d; }

        /* ── LAYOUT ── */
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 1.75rem;
          align-items: start;
        }

        /* ── ITEMS LIST ── */
        .cart-items-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow);
        }
        .cart-items-head {
          padding: 1.1rem 1.4rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .cart-items-head-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text);
        }
        .cart-items-head-count {
          font-size: 0.78rem;
          color: var(--text-muted);
          background: var(--surface2);
          padding: 3px 10px;
          border-radius: 20px;
          border: 1px solid var(--border);
        }

        /* ── SINGLE ITEM ROW ── */
        .cart-item {
          display: grid;
          grid-template-columns: 72px 1fr auto auto auto;
          gap: 1rem;
          align-items: center;
          padding: 1rem 1.4rem;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }
        .cart-item:last-child { border-bottom: none; }
        .cart-item:hover { background: var(--surface2); }

        /* Item image */
        .cart-item-img {
          width: 72px; height: 72px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          background: var(--surface3);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .cart-item-img img {
          width: 100%; height: 100%;
          object-fit: cover;
        }
        .cart-item-img-placeholder { font-size: 1.5rem; color: var(--border); }

        /* Item name */
        .cart-item-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text);
          text-decoration: none;
          transition: color 0.2s;
          display: block;
          line-height: 1.3;
        }
        .cart-item-name:hover { color: var(--accent); }
        .cart-item-unit {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 3px;
        }

        /* Price */
        .cart-item-price {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 700;
          color: var(--text);
          white-space: nowrap;
          min-width: 70px;
          text-align: right;
        }
        .cart-item-price-unit {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 400;
          text-align: right;
        }

        /* Qty */
        .cart-qty-select {
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 0.4rem 0.6rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          color: var(--text);
          background: var(--surface2);
          outline: none;
          min-width: 60px;
          transition: border-color 0.2s;
          cursor: pointer;
        }
        .cart-qty-select:focus { border-color: var(--accent); }

        /* Remove btn */
        .cart-remove-btn {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1px solid #fca5a5;
          background: #fef2f2;
          color: #dc2626;
          font-size: 0.9rem;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .cart-remove-btn:hover {
          background: #dc2626;
          color: #fff;
          border-color: #dc2626;
          transform: scale(1.1);
        }

        /* ── ORDER SUMMARY ── */
        .cart-summary {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow);
          position: sticky;
          top: 90px;
        }
        .cart-summary-head {
          padding: 1.1rem 1.4rem;
          border-bottom: 1px solid var(--border);
          background: linear-gradient(135deg, #0d0d0d, #1a1612);
          position: relative;
        }
        .cart-summary-head::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 100% at 50% 0%, rgba(200,169,110,0.12) 0%, transparent 70%);
        }
        .cart-summary-title {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          position: relative;
        }
        .cart-summary-body { padding: 1.25rem 1.4rem; }

        .cart-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.55rem 0;
          font-size: 0.875rem;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border);
        }
        .cart-summary-row:last-of-type { border-bottom: none; }
        .cart-summary-row.total {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text);
          padding: 0.85rem 0 0.5rem;
          margin-top: 0.25rem;
          border-top: 2px solid var(--border);
          border-bottom: none;
        }
        .cart-summary-total-price {
          font-family: 'Playfair Display', serif;
          font-size: 1.35rem;
          color: var(--text);
        }
        .cart-free-ship {
          font-size: 0.72rem;
          background: #d4edda;
          color: #1a6b30;
          padding: 2px 8px;
          border-radius: 20px;
          font-weight: 600;
        }
        .cart-summary-footer { padding: 0 1.4rem 1.4rem; display: flex; flex-direction: column; gap: 0.6rem; }

        .cart-btn-checkout {
          width: 100%;
          padding: 0.85rem;
          background: #0d0d0d;
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .cart-btn-checkout:hover:not(:disabled) {
          background: var(--accent);
          color: #0d0d0d;
          transform: translateY(-1px);
        }
        .cart-btn-checkout:disabled { background: #ddd; color: #999; cursor: not-allowed; }

        .cart-btn-continue {
          width: 100%;
          padding: 0.75rem;
          background: var(--surface2);
          color: var(--text-muted);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          text-decoration: none;
          text-align: center;
          transition: all 0.2s;
          display: block;
        }
        .cart-btn-continue:hover { border-color: var(--text); color: var(--text); background: var(--surface); }

        .cart-free-ship-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--accent-dim);
          border: 1px solid var(--accent-light);
          border-radius: var(--radius-sm);
          padding: 0.6rem 1rem;
          font-size: 0.78rem;
          color: #8a6a30;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .cart-layout { grid-template-columns: 1fr; }
          .cart-summary { position: static; }
        }
        @media (max-width: 600px) {
          .cart-item {
            grid-template-columns: 56px 1fr;
            grid-template-rows: auto auto;
            gap: 0.5rem 0.75rem;
          }
          .cart-item-img { width: 56px; height: 56px; grid-row: 1 / 3; }
          .cart-item-price { text-align: left; grid-column: 2; }
          .cart-qty-select { grid-column: 2; width: fit-content; }
          .cart-remove-btn { position: absolute; right: 1rem; }
          .cart-item { position: relative; }
          .cart-container { padding: 1rem; }
        }
      `}</style>

      <div className="cart-wrap">

        {/* Header */}
        <div className="cart-header">
          <p className="cart-header-eyebrow">Your Selection</p>
          <h1 className="cart-header-title">
            Shopping <span>Cart</span>
          </h1>
        </div>

        <div className="cart-container">

          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <h2 className="cart-empty-title">Your cart is empty</h2>
              <p className="cart-empty-text">Looks like you haven't added anything yet.</p>
              <Link to="/" className="cart-empty-btn">← Continue Shopping</Link>
            </div>
          ) : (
            <div className="cart-layout">

              {/* Items */}
              <div className="cart-items-card">
                <div className="cart-items-head">
                  <span className="cart-items-head-title">Order Items</span>
                  <span className="cart-items-head-count">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
                </div>

                {cartItems.map((item) => {
                  const imgUrl = getImageUrl(item.image);
                  const lineTotal = (Number(item.price) * Number(item.qty || 1)).toFixed(2);
                  return (
                    <div key={item._id} className="cart-item">

                      {/* Image */}
                      <div className="cart-item-img">
                        {imgUrl ? (
                          <img src={imgUrl} alt={item.name}
                            onError={(e) => { e.target.style.display='none'; }}
                          />
                        ) : (
                          <span className="cart-item-img-placeholder">📦</span>
                        )}
                      </div>

                      {/* Name */}
                      <div>
                        <Link to={`/product/${item._id}`} className="cart-item-name">
                          {item.name}
                        </Link>
                        <p className="cart-item-unit">${item.price} / unit</p>
                      </div>

                      {/* Qty */}
                      <select
                        className="cart-qty-select"
                        value={item.qty || 1}
                        onChange={(e) => updateQty(item._id, e.target.value)}
                      >
                        {[...Array(10).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>{x + 1}</option>
                        ))}
                      </select>

                      {/* Line total */}
                      <div className="cart-item-price">
                        ${lineTotal}
                        <span className="cart-item-price-unit">subtotal</span>
                      </div>

                      {/* Remove */}
                      <button className="cart-remove-btn" onClick={() => removeFromCart(item._id)} title="Remove">
                        ✕
                      </button>

                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="cart-summary">
                <div className="cart-summary-head">
                  <h3 className="cart-summary-title">Order Summary</h3>
                </div>
                <div className="cart-summary-body">
                  {Number(totalPrice) > 100 && (
                    <div className="cart-free-ship-banner">
                      🎉 You qualify for <strong>FREE shipping!</strong>
                    </div>
                  )}
                  <div className="cart-summary-row">
                    <span>Items ({totalItems})</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="cart-summary-row">
                    <span>Shipping</span>
                    {Number(totalPrice) > 100
                      ? <span className="cart-free-ship">FREE</span>
                      : <span>$10.00</span>
                    }
                  </div>
                  <div className="cart-summary-row">
                    <span>Tax (8.2%)</span>
                    <span>${(0.082 * Number(totalPrice)).toFixed(2)}</span>
                  </div>
                  <div className="cart-summary-row total">
                    <span>Total</span>
                    <span className="cart-summary-total-price">
                      ${(Number(totalPrice) + (Number(totalPrice) > 100 ? 0 : 10) + 0.082 * Number(totalPrice)).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="cart-summary-footer">
                  <button
                    className="cart-btn-checkout"
                    onClick={checkoutHandler}
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout →
                  </button>
                  <Link to="/" className="cart-btn-continue">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;
