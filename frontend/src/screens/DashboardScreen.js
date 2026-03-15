import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axios';

function DashboardScreen() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.isAdmin) navigate('/login');
        else fetchStats();
    }, [navigate]);

    const fetchStats = async () => {
        try {
            const { data } = await axiosInstance.get('/api/dashboard/');
            setStats(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
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
                    --dark: #0d0d0d;
                    --radius: 14px;
                    --radius-sm: 10px;
                    --shadow: 0 2px 16px rgba(0,0,0,0.07);
                }
                * { box-sizing: border-box; }

                .db-wrap {
                    min-height: 100vh;
                    background: var(--surface2);
                    font-family: 'DM Sans', sans-serif;
                    padding-bottom: 4rem;
                }

                /* ── HEADER ── */
                .db-header {
                    background: linear-gradient(135deg, #0d0d0d, #1a1612);
                    padding: 2.25rem 2rem 2rem;
                    position: relative;
                    overflow: hidden;
                }
                .db-header::before {
                    content: '';
                    position: absolute; inset: 0;
                    background: radial-gradient(ellipse 70% 80% at 50% 0%, rgba(200,169,110,0.1) 0%, transparent 70%);
                }
                .db-header-inner {
                    max-width: 1280px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: relative;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .db-header-left {}
                .db-eyebrow {
                    font-size: 0.62rem;
                    font-weight: 600;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    color: var(--accent);
                    opacity: 0.85;
                    margin-bottom: 4px;
                }
                .db-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.4rem, 3vw, 1.9rem);
                    font-weight: 700;
                    color: #fff;
                    margin: 0 0 3px;
                }
                .db-title span { color: var(--accent); }
                .db-subtitle {
                    font-size: 0.78rem;
                    color: rgba(255,255,255,0.35);
                }
                .db-header-actions {
                    display: flex;
                    gap: 0.65rem;
                    flex-wrap: wrap;
                }
                .db-nav-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.78rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.2s;
                    letter-spacing: 0.02em;
                }
                .db-nav-btn.light {
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.65);
                }
                .db-nav-btn.light:hover { background: rgba(255,255,255,0.14); color: #fff; }
                .db-nav-btn.gold {
                    background: var(--accent);
                    border: 1px solid var(--accent);
                    color: #0d0d0d;
                }
                .db-nav-btn.gold:hover { background: var(--accent-light); }

                /* ── BODY ── */
                .db-body {
                    max-width: 1280px;
                    margin: 2rem auto;
                    padding: 0 1.5rem;
                }

                /* ── SECTION LABEL ── */
                .db-section-label {
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    margin-bottom: 0.85rem;
                    margin-top: 0.25rem;
                }

                /* ── STAT CARDS ROW ── */
                .db-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                .db-stat-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 1.25rem 1.4rem;
                    box-shadow: var(--shadow);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .db-stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.1); }
                .db-stat-icon {
                    width: 46px; height: 46px;
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.3rem;
                    flex-shrink: 0;
                }
                .db-stat-icon.blue   { background: rgba(59,130,246,0.1); }
                .db-stat-icon.green  { background: rgba(16,185,129,0.1); }
                .db-stat-icon.gold   { background: var(--accent-dim); }
                .db-stat-icon.purple { background: rgba(139,92,246,0.1); }
                .db-stat-num {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: var(--text);
                    line-height: 1;
                }
                .db-stat-label {
                    font-size: 0.7rem;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    margin-top: 3px;
                }

                /* ── ORDER STATUS ROW ── */
                .db-status-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .db-status-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 1.1rem 1.4rem;
                    box-shadow: var(--shadow);
                    display: flex;
                    align-items: center;
                    gap: 0.85rem;
                }
                .db-status-dot {
                    width: 10px; height: 10px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }
                .db-status-dot.green  { background: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.15); }
                .db-status-dot.blue   { background: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
                .db-status-dot.amber  { background: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,0.15); }
                .db-status-num {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: var(--text);
                    line-height: 1;
                }
                .db-status-lbl {
                    font-size: 0.7rem;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    margin-top: 2px;
                }

                /* ── BOTTOM GRID ── */
                .db-bottom-grid {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 1.25rem;
                    align-items: start;
                }

                /* ── TABLE CARD ── */
                .db-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    overflow: hidden;
                    box-shadow: var(--shadow);
                }
                .db-card-head {
                    padding: 1rem 1.4rem;
                    border-bottom: 1px solid var(--border);
                    background: var(--surface2);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .db-card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: var(--text);
                    display: flex;
                    align-items: center;
                    gap: 7px;
                }
                .db-view-all {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--accent);
                    text-decoration: none;
                    transition: opacity 0.2s;
                    letter-spacing: 0.03em;
                }
                .db-view-all:hover { opacity: 0.7; color: var(--accent); }
                .db-card-body { padding: 0; }

                /* Table */
                .db-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.82rem;
                }
                .db-table thead tr {
                    background: var(--surface2);
                    border-bottom: 1px solid var(--border);
                }
                .db-table th {
                    padding: 0.65rem 1.2rem;
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    text-align: left;
                    white-space: nowrap;
                }
                .db-table td {
                    padding: 0.8rem 1.2rem;
                    border-bottom: 1px solid var(--border);
                    color: var(--text);
                    vertical-align: middle;
                }
                .db-table tbody tr:last-child td { border-bottom: none; }
                .db-table tbody tr:hover { background: var(--surface2); }
                .db-order-link {
                    font-weight: 600;
                    color: var(--accent);
                    text-decoration: none;
                    font-family: monospace;
                    font-size: 0.82rem;
                }
                .db-order-link:hover { text-decoration: underline; color: var(--accent); }
                .db-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 2px 9px;
                    border-radius: 20px;
                    font-size: 0.67rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    white-space: nowrap;
                }
                .db-badge.paid     { background: #d4edda; color: #1a6b30; }
                .db-badge.unpaid   { background: #fde8e8; color: #dc2626; }
                .db-badge.done     { background: #dbeafe; color: #1d4ed8; }
                .db-badge.pending  { background: #fef3c7; color: #b45309; }

                /* ── LOW STOCK CARD ── */
                .db-stock-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0.75rem 1.2rem;
                    border-bottom: 1px solid var(--border);
                    gap: 0.75rem;
                    font-size: 0.82rem;
                }
                .db-stock-item:last-child { border-bottom: none; }
                .db-stock-name {
                    font-weight: 500;
                    color: var(--text);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 170px;
                }
                .db-stock-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 2px 9px;
                    border-radius: 20px;
                    font-size: 0.65rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    white-space: nowrap;
                    flex-shrink: 0;
                }
                .db-stock-badge.out  { background: #fde8e8; color: #dc2626; }
                .db-stock-badge.low  { background: #fef3c7; color: #b45309; }
                .db-stock-all-good {
                    padding: 2rem 1.2rem;
                    text-align: center;
                    color: #10b981;
                    font-size: 0.85rem;
                    font-weight: 500;
                }
                .db-card-footer {
                    padding: 0.85rem 1.2rem;
                    border-top: 1px solid var(--border);
                    background: var(--surface2);
                }
                .db-footer-link {
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: var(--accent);
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    transition: opacity 0.2s;
                }
                .db-footer-link:hover { opacity: 0.7; color: var(--accent); }

                /* ── LOADING ── */
                .db-loading {
                    min-height: 60vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    gap: 0.75rem;
                    color: var(--text-muted);
                    font-size: 0.875rem;
                }
                .db-spinner {
                    width: 32px; height: 32px;
                    border: 3px solid var(--border);
                    border-top-color: var(--accent);
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* ── RESPONSIVE ── */
                @media (max-width: 1024px) {
                    .db-stats-grid { grid-template-columns: repeat(2, 1fr); }
                    .db-bottom-grid { grid-template-columns: 1fr; }
                }
                @media (max-width: 640px) {
                    .db-stats-grid { grid-template-columns: repeat(2, 1fr); }
                    .db-status-grid { grid-template-columns: 1fr; }
                    .db-body { padding: 1rem; }
                    .db-header { padding: 1.5rem 1rem; }
                }
                @media (max-width: 420px) {
                    .db-stats-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="db-wrap">

                {/* ── HEADER ── */}
                <div className="db-header">
                    <div className="db-header-inner">
                        <div className="db-header-left">
                            <p className="db-eyebrow">Admin Panel</p>
                            <h1 className="db-title">Store <span>Dashboard</span></h1>
                            <p className="db-subtitle">Welcome back, Admin! Here's what's happening.</p>
                        </div>
                        <div className="db-header-actions">
                            <Link to="/admin/userlist"    className="db-nav-btn light">👥 Users</Link>
                            <Link to="/admin/productlist" className="db-nav-btn light">📦 Products</Link>
                            <Link to="/admin/orderlist"   className="db-nav-btn gold">🛒 Orders</Link>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="db-loading">
                        <div className="db-spinner" />
                        <span>Loading dashboard...</span>
                    </div>
                ) : (
                    <div className="db-body">

                        {/* ── TOP STATS ── */}
                        <p className="db-section-label">Overview</p>
                        <div className="db-stats-grid" style={{ marginBottom: '1.25rem' }}>
                            {[
                                { icon: '👥', color: 'blue',   num: stats?.totalUsers,    label: 'Total Users' },
                                { icon: '💰', color: 'green',  num: `$${stats?.totalRevenue}`, label: 'Total Revenue' },
                                { icon: '📦', color: 'gold',   num: stats?.totalOrders,   label: 'Total Orders' },
                                { icon: '🛍️', color: 'purple', num: stats?.totalProducts, label: 'Products' },
                            ].map(({ icon, color, num, label }) => (
                                <div key={label} className="db-stat-card">
                                    <div className={`db-stat-icon ${color}`}>{icon}</div>
                                    <div>
                                        <div className="db-stat-num">{num}</div>
                                        <div className="db-stat-label">{label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── ORDER STATUS ── */}
                        <p className="db-section-label">Order Status</p>
                        <div className="db-status-grid">
                            {[
                                { dot: 'green', num: stats?.paidOrders,      label: 'Paid Orders' },
                                { dot: 'blue',  num: stats?.deliveredOrders, label: 'Delivered' },
                                { dot: 'amber', num: stats?.pendingOrders,   label: 'Pending' },
                            ].map(({ dot, num, label }) => (
                                <div key={label} className="db-status-card">
                                    <div className={`db-status-dot ${dot}`} />
                                    <div>
                                        <div className="db-status-num">{num}</div>
                                        <div className="db-status-lbl">{label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── BOTTOM ── */}
                        <div className="db-bottom-grid">

                            {/* Recent Orders */}
                            <div className="db-card">
                                <div className="db-card-head">
                                    <span className="db-card-title">🕐 Recent Orders</span>
                                    <Link to="/admin/orderlist" className="db-view-all">View All →</Link>
                                </div>
                                <div className="db-card-body">
                                    <table className="db-table">
                                        <thead>
                                            <tr>
                                                <th>Order</th>
                                                <th>User</th>
                                                <th>Total</th>
                                                <th>Paid</th>
                                                <th>Delivered</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats?.recentOrders?.map(order => (
                                                <tr key={order.id}>
                                                    <td>
                                                        <Link to={`/order/${order.id}`} className="db-order-link">
                                                            #{order.id}
                                                        </Link>
                                                    </td>
                                                    <td>{order.user}</td>
                                                    <td style={{ fontWeight: 600 }}>${order.total}</td>
                                                    <td>
                                                        <span className={`db-badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
                                                            {order.isPaid ? '✓ Paid' : '✗ Unpaid'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`db-badge ${order.isDelivered ? 'done' : 'pending'}`}>
                                                            {order.isDelivered ? '✓ Done' : '⏳ Pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Low Stock */}
                            <div className="db-card">
                                <div className="db-card-head">
                                    <span className="db-card-title">⚠️ Low Stock</span>
                                </div>
                                <div className="db-card-body">
                                    {stats?.lowStock?.length === 0 ? (
                                        <div className="db-stock-all-good">
                                            ✅ All products well stocked!
                                        </div>
                                    ) : (
                                        stats?.lowStock?.map(product => (
                                            <div key={product.id} className="db-stock-item">
                                                <span className="db-stock-name">{product.name}</span>
                                                <span className={`db-stock-badge ${product.stock === 0 ? 'out' : 'low'}`}>
                                                    {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="db-card-footer">
                                    <Link to="/admin/productlist" className="db-footer-link">
                                        Manage Products →
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default DashboardScreen;
