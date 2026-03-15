import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axios';

function OrderScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [paying, setPaying] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) { navigate('/login'); return; }
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const { data } = await axiosInstance.get(`/api/orders/${id}/`);
            setOrder(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error loading order');
        } finally {
            setLoading(false);
        }
    };

    const payHandler = async () => {
        if (!window.confirm('Mark this order as paid?')) return;
        setPaying(true);
        try {
            await axiosInstance.put(`/api/orders/${id}/pay/`);
            fetchOrder();
        } catch (err) {
            alert(err.response?.data?.detail || 'Error processing payment');
        } finally {
            setPaying(false);
        }
    };

    const cancelHandler = async () => {
        if (!window.confirm('Cancel this order?')) return;
        setCancelling(true);
        try {
            await axiosInstance.put(`/api/orders/${id}/cancel/`);
            fetchOrder();
        } catch (err) {
            alert(err.response?.data?.detail || 'Error cancelling order');
        } finally {
            setCancelling(false);
        }
    };

    const getImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith('http')) return img;
        return `http://127.0.0.1:8000${img}`;
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return { bg: '#d4edda', color: '#1a6b30', icon: '✅' };
            case 'Shipped':   return { bg: '#dbeafe', color: '#0369a1', icon: '🚚' };
            case 'Paid':      return { bg: '#ede9fe', color: '#7c3aed', icon: '💳' };
            case 'Cancelled': return { bg: '#fde8e8', color: '#dc2626', icon: '❌' };
            default:          return { bg: '#fef3c7', color: '#b45309', icon: '⏳' };
        }
    };

    const steps = ['Processing', 'Paid', 'Shipped', 'Delivered'];
    const getStepIndex = (status) => {
        if (status === 'Cancelled') return -1;
        return steps.indexOf(status);
    };

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', color: '#777' }}>
            Loading order...
        </div>
    );

    if (error) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', color: '#dc2626' }}>
            {error}
        </div>
    );

    if (!order) return null;

    const statusStyle = getStatusStyle(order.status);
    const stepIndex = getStepIndex(order.status);
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const isAdmin = userInfo?.isAdmin;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
                :root {
                    --accent: #c8a96e; --accent-dim: rgba(200,169,110,0.12);
                    --text: #1a1a1a; --text-muted: #777;
                    --border: #e8e4df; --surface: #fff;
                    --surface2: #f8f6f3; --surface3: #f2efe9;
                    --radius: 14px; --radius-sm: 8px;
                    --shadow: 0 2px 16px rgba(0,0,0,0.07);
                }
                * { box-sizing: border-box; }
                .os-wrap { min-height: 100vh; background: var(--surface2); font-family: 'DM Sans', sans-serif; padding-bottom: 4rem; }
                .os-header { background: linear-gradient(135deg, #0d0d0d, #1a1612); padding: 2rem 1.5rem; position: relative; overflow: hidden; }
                .os-header::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 70% 80% at 50% 0%, rgba(200,169,110,0.1) 0%, transparent 70%); }
                .os-header-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; gap: 1rem; position: relative; }
                .os-back { display: inline-flex; align-items: center; gap: 6px; padding: 0.5rem 1rem; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: rgba(255,255,255,0.6); font-size: 0.8rem; font-weight: 500; text-decoration: none; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
                .os-back:hover { background: rgba(255,255,255,0.12); color: #fff; }
                .os-eyebrow { font-size: 0.62rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--accent); opacity: 0.85; margin-bottom: 3px; }
                .os-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; color: #fff; margin: 0; }
                .os-title span { color: var(--accent); }
                .os-body { max-width: 1100px; margin: 2rem auto; padding: 0 1.5rem; display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem; align-items: start; }
                .os-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); margin-bottom: 1.25rem; }
                .os-card:last-child { margin-bottom: 0; }
                .os-card-head { padding: 1rem 1.4rem; border-bottom: 1px solid var(--border); background: var(--surface2); display: flex; align-items: center; gap: 10px; }
                .os-card-icon { width: 30px; height: 30px; border-radius: 50%; background: var(--accent-dim); border: 1px solid rgba(200,169,110,0.2); display: flex; align-items: center; justify-content: center; font-size: 0.82rem; flex-shrink: 0; }
                .os-card-title { font-family: 'Playfair Display', serif; font-size: 0.92rem; font-weight: 600; color: var(--text); }
                .os-card-body { padding: 1.25rem 1.4rem; }
                .os-status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 20px; font-size: 0.78rem; font-weight: 700; }
                .os-timeline { display: flex; align-items: center; justify-content: space-between; padding: 1rem 0; }
                .os-step { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; position: relative; }
                .os-step:not(:last-child)::after { content: ''; position: absolute; top: 14px; left: 55%; width: 90%; height: 2px; background: var(--border); z-index: 0; }
                .os-step.active:not(:last-child)::after { background: var(--accent); }
                .os-step-dot { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--border); background: var(--surface); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; z-index: 1; transition: all 0.3s; }
                .os-step.active .os-step-dot { background: var(--accent); border-color: var(--accent); color: #fff; }
                .os-step.done .os-step-dot { background: #16a34a; border-color: #16a34a; color: #fff; }
                .os-step-label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); text-align: center; }
                .os-step.active .os-step-label, .os-step.done .os-step-label { color: var(--text); }
                .os-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .os-info-block { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1rem 1.1rem; }
                .os-info-label { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 5px; }
                .os-info-value { font-size: 0.875rem; color: var(--text); font-weight: 500; }
                .os-item { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 0; border-bottom: 1px solid var(--border); }
                .os-item:last-child { border-bottom: none; }
                .os-item-img { width: 56px; height: 56px; border-radius: var(--radius-sm); object-fit: cover; background: var(--surface3); flex-shrink: 0; }
                .os-item-img-placeholder { width: 56px; height: 56px; border-radius: var(--radius-sm); background: var(--surface3); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
                .os-item-name { font-weight: 600; font-size: 0.875rem; color: var(--text); flex: 1; }
                .os-item-meta { font-size: 0.78rem; color: var(--text-muted); margin-top: 2px; }
                .os-item-price { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 0.95rem; color: var(--text); white-space: nowrap; }
                .os-summary-row { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; font-size: 0.875rem; color: var(--text-muted); border-bottom: 1px solid var(--border); }
                .os-summary-row:last-child { border-bottom: none; }
                .os-summary-total { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 0 0; font-weight: 700; color: var(--text); }
                .os-total-price { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: var(--accent); }
                .os-btn { width: 100%; padding: 0.85rem; border: none; border-radius: var(--radius-sm); font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: all 0.2s; margin-bottom: 0.75rem; display: flex; align-items: center; justify-content: center; gap: 8px; }
                .os-btn:last-child { margin-bottom: 0; }
                .os-btn-pay { background: #0d0d0d; color: #fff; }
                .os-btn-pay:hover:not(:disabled) { background: var(--accent); color: #0d0d0d; }
                .os-btn-cancel { background: var(--surface2); color: #dc2626; border: 1px solid #fca5a5; }
                .os-btn-cancel:hover:not(:disabled) { background: #fde8e8; }
                .os-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                @media (max-width: 860px) { .os-body { grid-template-columns: 1fr; } }
                @media (max-width: 560px) { .os-body { padding: 1rem; } .os-info-grid { grid-template-columns: 1fr; } }
            `}</style>

            <div className="os-wrap">
                <div className="os-header">
                    <div className="os-header-inner">
                        <Link to="/profile" className="os-back">← Back</Link>
                        <div style={{ flex: 1 }}>
                            <p className="os-eyebrow">Order Details</p>
                            <h1 className="os-title">Order <span>#{order._id}</span></h1>
                        </div>
                        <span className="os-status-pill" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                            {statusStyle.icon} {order.status}
                        </span>
                    </div>
                </div>

                <div className="os-body">
                    <div>
                        {/* Timeline */}
                        <div className="os-card">
                            <div className="os-card-head">
                                <div className="os-card-icon">📍</div>
                                <span className="os-card-title">Order Progress</span>
                            </div>
                            <div className="os-card-body">
                                {order.status === 'Cancelled' ? (
                                    <div style={{ textAlign: 'center', padding: '1rem', color: '#dc2626', fontWeight: 600 }}>
                                        ❌ This order has been cancelled
                                    </div>
                                ) : (
                                    <div className="os-timeline">
                                        {steps.map((step, i) => (
                                            <div key={step} className={`os-step ${i < stepIndex ? 'done' : i === stepIndex ? 'active' : ''}`}>
                                                <div className="os-step-dot">
                                                    {i < stepIndex ? '✓' : i + 1}
                                                </div>
                                                <span className="os-step-label">{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Info */}
                        <div className="os-card">
                            <div className="os-card-head">
                                <div className="os-card-icon">📋</div>
                                <span className="os-card-title">Order Information</span>
                            </div>
                            <div className="os-card-body">
                                <div className="os-info-grid">
                                    <div className="os-info-block">
                                        <p className="os-info-label">Order Date</p>
                                        <p className="os-info-value">{order.createdAt?.substring(0, 10)}</p>
                                    </div>
                                    <div className="os-info-block">
                                        <p className="os-info-label">Payment Method</p>
                                        <p className="os-info-value">{order.paymentMethod}</p>
                                    </div>
                                    <div className="os-info-block">
                                        <p className="os-info-label">Shipping Address</p>
                                        <p className="os-info-value">
                                            {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.country}
                                        </p>
                                    </div>
                                    <div className="os-info-block">
                                        <p className="os-info-label">Paid At</p>
                                        <p className="os-info-value">{order.isPaid ? order.paidAt?.substring(0, 10) : 'Not paid yet'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="os-card">
                            <div className="os-card-head">
                                <div className="os-card-icon">🛍️</div>
                                <span className="os-card-title">Order Items</span>
                            </div>
                            <div className="os-card-body">
                                {order.orderItems?.map(item => (
                                    <div key={item._id} className="os-item">
                                        {getImageUrl(item.image) ? (
                                            <img src={getImageUrl(item.image)} alt={item.name} className="os-item-img" />
                                        ) : (
                                            <div className="os-item-img-placeholder">📦</div>
                                        )}
                                        <div style={{ flex: 1 }}>
                                            <p className="os-item-name">{item.name}</p>
                                            <p className="os-item-meta">Qty: {item.qty} × ${item.price}</p>
                                        </div>
                                        <span className="os-item-price">${(item.qty * item.price).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right — Summary */}
                    <div>
                        <div className="os-card">
                            <div className="os-card-head">
                                <div className="os-card-icon">💰</div>
                                <span className="os-card-title">Order Summary</span>
                            </div>
                            <div className="os-card-body">
                                <div className="os-summary-row">
                                    <span>Subtotal</span>
                                    <span>${(Number(order.totalPrice) - Number(order.taxPrice) - Number(order.shippingPrice)).toFixed(2)}</span>
                                </div>
                                <div className="os-summary-row">
                                    <span>Shipping</span>
                                    <span>${order.shippingPrice}</span>
                                </div>
                                <div className="os-summary-row">
                                    <span>Tax</span>
                                    <span>${order.taxPrice}</span>
                                </div>
                                <div className="os-summary-total">
                                    <span>Total</span>
                                    <span className="os-total-price">${order.totalPrice}</span>
                                </div>

                                {!order.isPaid && order.status !== 'Cancelled' && (
                                    <button className="os-btn os-btn-pay" onClick={payHandler} disabled={paying} style={{ marginTop: '1rem' }}>
                                        {paying ? 'Processing...' : '💳 Pay Now'}
                                    </button>
                                )}

                                {order.status !== 'Cancelled' && order.status !== 'Delivered' && order.status !== 'Shipped' && (
                                    <button className="os-btn os-btn-cancel" onClick={cancelHandler} disabled={cancelling}>
                                        {cancelling ? 'Cancelling...' : '✕ Cancel Order'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderScreen;
