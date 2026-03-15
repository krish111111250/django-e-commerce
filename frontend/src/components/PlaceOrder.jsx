import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axios';

function PlaceOrder() {
    const navigate = useNavigate();

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));
    const paymentMethod = JSON.parse(localStorage.getItem('paymentMethod'));
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const itemsPrice = cartItems.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.qty || 1), 0
    );
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.082 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userInfo) navigate('/login');
        else if (!shippingAddress) navigate('/shipping');
        else if (!paymentMethod) navigate('/payment');
    }, [navigate]);

    const placeOrderHandler = async () => {
        if (loading) return;
        try {
            setLoading(true);
            setError('');
            const { data } = await axiosInstance.post('/api/orders/add/', {
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            });
            localStorage.removeItem('cartItems');
            navigate(`/order/${data._id}`);
        } catch (err) {
            setLoading(false);
            if (err.response?.status === 401) {
                alert("Session expired. Please login again.");
                localStorage.removeItem('userInfo');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError(err.response?.data?.detail || err.message);
            }
        }
    };

    const getImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith('http')) return img;
        return `http://127.0.0.1:8000${img}`;
    };

    const steps = ['Login', 'Shipping', 'Payment', 'Place Order'];

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

                .po-wrap {
                    min-height: 100vh;
                    background: var(--surface2);
                    font-family: 'DM Sans', sans-serif;
                    padding-bottom: 4rem;
                }

                /* ── HEADER ── */
                .po-header {
                    background: linear-gradient(135deg, #0d0d0d, #1a1612);
                    padding: 2.5rem 1.5rem 2rem;
                    text-align: center;
                    position: relative;
                }
                .po-header::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse 70% 80% at 50% 0%, rgba(200,169,110,0.1) 0%, transparent 70%);
                }
                .po-header-eyebrow {
                    font-size: 0.65rem;
                    font-weight: 600;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    color: var(--accent);
                    margin-bottom: 0.4rem;
                    opacity: 0.85;
                    position: relative;
                }
                .po-header-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.5rem, 4vw, 2rem);
                    font-weight: 700;
                    color: #fff;
                    margin: 0 0 1.75rem;
                    position: relative;
                }
                .po-header-title span { color: var(--accent); }

                /* ── STEPPER ── */
                .po-stepper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0;
                    position: relative;
                    max-width: 480px;
                    margin: 0 auto;
                }
                .po-step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    position: relative;
                    flex: 1;
                }
                .po-step-circle {
                    width: 32px; height: 32px;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border: 2px solid;
                    position: relative;
                    z-index: 1;
                    transition: all 0.2s;
                }
                .po-step-circle.done {
                    background: var(--accent);
                    border-color: var(--accent);
                    color: #0d0d0d;
                }
                .po-step-circle.active {
                    background: #fff;
                    border-color: #fff;
                    color: #0d0d0d;
                }
                .po-step-circle.pending {
                    background: transparent;
                    border-color: rgba(255,255,255,0.25);
                    color: rgba(255,255,255,0.35);
                }
                .po-step-label {
                    font-size: 0.62rem;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    white-space: nowrap;
                }
                .po-step-label.done { color: var(--accent); }
                .po-step-label.active { color: #fff; }
                .po-step-label.pending { color: rgba(255,255,255,0.3); }

                .po-step-line {
                    flex: 1;
                    height: 2px;
                    background: rgba(255,255,255,0.15);
                    margin-bottom: 22px;
                    position: relative;
                }
                .po-step-line.done { background: var(--accent); opacity: 0.6; }

                /* ── CONTAINER ── */
                .po-container {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 2rem 1.5rem;
                }
                .po-layout {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 1.75rem;
                    align-items: start;
                }

                /* ── LEFT PANEL ── */
                .po-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    overflow: hidden;
                    box-shadow: var(--shadow);
                    margin-bottom: 1.25rem;
                }
                .po-card:last-child { margin-bottom: 0; }
                .po-card-head {
                    padding: 1rem 1.4rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .po-card-icon {
                    width: 30px; height: 30px;
                    border-radius: 50%;
                    background: var(--accent-dim);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.85rem;
                    flex-shrink: 0;
                }
                .po-card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: var(--text);
                }
                .po-card-body { padding: 1rem 1.4rem; }

                /* Info rows */
                .po-info-row {
                    display: flex;
                    gap: 8px;
                    font-size: 0.875rem;
                    color: var(--text);
                    line-height: 1.5;
                }
                .po-info-label {
                    font-weight: 600;
                    color: var(--text-muted);
                    font-size: 0.72rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    min-width: 80px;
                    padding-top: 2px;
                }

                /* Payment badge */
                .po-payment-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 5px 14px;
                    background: var(--surface3);
                    border: 1px solid var(--border);
                    border-radius: 20px;
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: var(--text);
                }

                /* Order items */
                .po-item {
                    display: grid;
                    grid-template-columns: 52px 1fr auto;
                    gap: 0.85rem;
                    align-items: center;
                    padding: 0.75rem 0;
                    border-bottom: 1px solid var(--border);
                }
                .po-item:last-child { border-bottom: none; }
                .po-item-img {
                    width: 52px; height: 52px;
                    border-radius: var(--radius-sm);
                    object-fit: cover;
                    background: var(--surface3);
                    border: 1px solid var(--border);
                    display: flex; align-items: center; justify-content: center;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                .po-item-img img { width: 100%; height: 100%; object-fit: cover; }
                .po-item-img-placeholder { font-size: 1.2rem; color: var(--border); }
                .po-item-name {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text);
                    text-decoration: none;
                    transition: color 0.2s;
                    display: block;
                    line-height: 1.3;
                }
                .po-item-name:hover { color: var(--accent); }
                .po-item-qty { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }
                .po-item-price {
                    font-family: 'Playfair Display', serif;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: var(--text);
                    white-space: nowrap;
                    text-align: right;
                }

                /* ── ORDER SUMMARY ── */
                .po-summary {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    overflow: hidden;
                    box-shadow: var(--shadow);
                    position: sticky;
                    top: 90px;
                }
                .po-summary-head {
                    background: linear-gradient(135deg, #0d0d0d, #1a1612);
                    padding: 1.1rem 1.4rem;
                    position: relative;
                }
                .po-summary-head::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse 80% 100% at 50% 0%, rgba(200,169,110,0.12) 0%, transparent 70%);
                }
                .po-summary-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #fff;
                    position: relative;
                }
                .po-summary-body { padding: 1.1rem 1.4rem; }
                .po-summary-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem 0;
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    border-bottom: 1px solid var(--border);
                }
                .po-summary-row:last-of-type { border-bottom: none; }
                .po-summary-row.total {
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--text);
                    padding: 0.85rem 0 0.25rem;
                    margin-top: 0.25rem;
                    border-top: 2px solid var(--border);
                    border-bottom: none;
                }
                .po-total-price {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.35rem;
                    color: var(--text);
                }
                .po-free-badge {
                    font-size: 0.72rem;
                    background: #d4edda;
                    color: #1a6b30;
                    padding: 2px 8px;
                    border-radius: 20px;
                    font-weight: 600;
                }
                .po-free-ship-banner {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--accent-dim);
                    border: 1px solid var(--accent-light);
                    border-radius: var(--radius-sm);
                    padding: 0.55rem 0.85rem;
                    font-size: 0.76rem;
                    color: #8a6a30;
                    font-weight: 500;
                    margin-bottom: 0.6rem;
                }

                .po-summary-footer { padding: 0 1.4rem 1.4rem; display: flex; flex-direction: column; gap: 0.6rem; }

                .po-alert {
                    padding: 0.65rem 1rem;
                    border-radius: var(--radius-sm);
                    font-size: 0.82rem;
                    background: #fef2f2;
                    color: #dc2626;
                    border: 1px solid #fca5a5;
                    margin-bottom: 0.75rem;
                }

                .po-btn-place {
                    width: 100%;
                    padding: 0.9rem;
                    background: #0d0d0d;
                    color: #fff;
                    border: none;
                    border-radius: var(--radius-sm);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.15s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                .po-btn-place:hover:not(:disabled) {
                    background: var(--accent);
                    color: #0d0d0d;
                    transform: translateY(-1px);
                }
                .po-btn-place:disabled { background: #ddd; color: #999; cursor: not-allowed; }

                .po-btn-back {
                    width: 100%;
                    padding: 0.72rem;
                    background: var(--surface2);
                    color: var(--text-muted);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.82rem;
                    font-weight: 500;
                    cursor: pointer;
                    text-decoration: none;
                    text-align: center;
                    transition: all 0.2s;
                    display: block;
                }
                .po-btn-back:hover { border-color: var(--text); color: var(--text); }

                /* spinner */
                .po-spinner {
                    width: 16px; height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                    flex-shrink: 0;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* ── RESPONSIVE ── */
                @media (max-width: 900px) {
                    .po-layout { grid-template-columns: 1fr; }
                    .po-summary { position: static; }
                }
                @media (max-width: 600px) {
                    .po-container { padding: 1rem; }
                    .po-stepper { gap: 0; }
                    .po-step-label { display: none; }
                }
            `}</style>

            <div className="po-wrap">

                {/* Header + Stepper */}
                <div className="po-header">
                    <p className="po-header-eyebrow">Almost There</p>
                    <h1 className="po-header-title">Review & <span>Place Order</span></h1>

                    <div className="po-stepper">
                        {steps.map((step, i) => {
                            const status = i < 3 ? 'done' : i === 3 ? 'active' : 'pending';
                            return (
                                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                    <div className="po-step" style={{ flex: 'none' }}>
                                        <div className={`po-step-circle ${status}`}>
                                            {status === 'done' ? '✓' : i + 1}
                                        </div>
                                        <span className={`po-step-label ${status}`}>{step}</span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className={`po-step-line ${i < 3 ? 'done' : ''}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="po-container">
                    <div className="po-layout">

                        {/* ── LEFT ── */}
                        <div>

                            {/* Shipping */}
                            <div className="po-card">
                                <div className="po-card-head">
                                    <div className="po-card-icon">📦</div>
                                    <h3 className="po-card-title">Shipping Address</h3>
                                </div>
                                <div className="po-card-body">
                                    <div className="po-info-row">
                                        <span className="po-info-label">Address</span>
                                        <span>
                                            {shippingAddress?.address}, {shippingAddress?.city},{' '}
                                            {shippingAddress?.postalCode}, {shippingAddress?.country}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment */}
                            <div className="po-card">
                                <div className="po-card-head">
                                    <div className="po-card-icon">💳</div>
                                    <h3 className="po-card-title">Payment Method</h3>
                                </div>
                                <div className="po-card-body">
                                    <span className="po-payment-badge">
                                        {paymentMethod === 'PayPal' ? '🅿️' : '💳'} {paymentMethod}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="po-card">
                                <div className="po-card-head">
                                    <div className="po-card-icon">🛒</div>
                                    <h3 className="po-card-title">Order Items</h3>
                                </div>
                                <div className="po-card-body">
                                    {cartItems.length === 0 ? (
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Your cart is empty.</p>
                                    ) : (
                                        cartItems.map((item, index) => {
                                            const imgUrl = getImageUrl(item.image);
                                            return (
                                                <div key={index} className="po-item">
                                                    <div className="po-item-img">
                                                        {imgUrl ? (
                                                            <img src={imgUrl} alt={item.name}
                                                                onError={(e) => { e.target.style.display = 'none'; }}
                                                            />
                                                        ) : (
                                                            <span className="po-item-img-placeholder">📦</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Link to={`/product/${item._id}`} className="po-item-name">
                                                            {item.name}
                                                        </Link>
                                                        <p className="po-item-qty">Qty: {item.qty || 1} × ${item.price}</p>
                                                    </div>
                                                    <div className="po-item-price">
                                                        ${(Number(item.qty || 1) * Number(item.price)).toFixed(2)}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* ── RIGHT — Summary ── */}
                        <div className="po-summary">
                            <div className="po-summary-head">
                                <h3 className="po-summary-title">Order Summary</h3>
                            </div>
                            <div className="po-summary-body">
                                {shippingPrice === 0 && (
                                    <div className="po-free-ship-banner">
                                        🎉 You qualify for <strong>FREE shipping!</strong>
                                    </div>
                                )}
                                <div className="po-summary-row">
                                    <span>Items</span>
                                    <span>${itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="po-summary-row">
                                    <span>Shipping</span>
                                    {shippingPrice === 0
                                        ? <span className="po-free-badge">FREE</span>
                                        : <span>${shippingPrice}</span>
                                    }
                                </div>
                                <div className="po-summary-row">
                                    <span>Tax (8.2%)</span>
                                    <span>${taxPrice}</span>
                                </div>
                                <div className="po-summary-row total">
                                    <span>Total</span>
                                    <span className="po-total-price">${totalPrice}</span>
                                </div>
                            </div>

                            <div className="po-summary-footer">
                                {error && <div className="po-alert">⚠️ {error}</div>}
                                <button
                                    className="po-btn-place"
                                    disabled={cartItems.length === 0 || loading}
                                    onClick={placeOrderHandler}
                                >
                                    {loading ? (
                                        <><div className="po-spinner" /> Placing Order...</>
                                    ) : (
                                        '🎯 Place Order'
                                    )}
                                </button>
                                <Link to="/cart" className="po-btn-back">← Back to Cart</Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default PlaceOrder;
