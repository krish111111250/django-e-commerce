import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axios';

function OrderListScreen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const user = JSON.parse(userInfo);
            if (user.isAdmin) {
                fetchOrders();
            } else {
                navigate('/');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchOrders = async () => {
        try {
            const { data } = await axiosInstance.get('/api/orders/all/');
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const deliverHandler = async (orderId) => {
        if (window.confirm('Mark this order as Delivered?')) {
            setActionLoading(prev => ({ ...prev, [orderId]: 'deliver' }));
            try {
                await axiosInstance.put(`/api/orders/${orderId}/deliver/`);
                fetchOrders();
            } catch (error) {
                alert('Error updating order');
            } finally {
                setActionLoading(prev => ({ ...prev, [orderId]: null }));
            }
        }
    };

    const shipHandler = async (orderId) => {
        if (window.confirm('Mark this order as Shipped?')) {
            setActionLoading(prev => ({ ...prev, [orderId]: 'ship' }));
            try {
                await axiosInstance.put(`/api/orders/${orderId}/ship/`);
                fetchOrders();
            } catch (err) {
                alert(err.response?.data?.detail || 'Error shipping order');
            } finally {
                setActionLoading(prev => ({ ...prev, [orderId]: null }));
            }
        }
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

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'Pending' || o.status === 'Paid').length,
        shipped: orders.filter(o => o.status === 'Shipped').length,
        delivered: orders.filter(o => o.status === 'Delivered').length,
        revenue: orders.filter(o => o.isPaid).reduce((acc, o) => acc + Number(o.totalPrice), 0).toFixed(2),
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
                :root {
                    --accent: #c8a96e; --accent-light: #e8d5b0;
                    --accent-dim: rgba(200,169,110,0.12);
                    --text: #1a1a1a; --text-muted: #777;
                    --border: #e8e4df; --surface: #ffffff;
                    --surface2: #f8f6f3; --surface3: #f2efe9;
                    --radius: 14px; --radius-sm: 8px;
                    --shadow: 0 2px 16px rgba(0,0,0,0.07);
                }
                .ol-wrap {
                    min-height: 100vh;
                    background: var(--surface2);
                    font-family: 'DM Sans', sans-serif;
                    padding-bottom: 4rem;
                }

                /* Header */
                .ol-header {
                    background: linear-gradient(135deg, #0d0d0d, #1a1612);
                    padding: 2.5rem 1.5rem 2rem;
                    text-align: center;
                    position: relative;
                }
                .ol-header::before {
                    content: '';
                    position: absolute; inset: 0;
                    background: radial-gradient(ellipse 70% 80% at 50% 0%, rgba(200,169,110,0.1) 0%, transparent 70%);
                }
                .ol-eyebrow {
                    font-size: 0.65rem; font-weight: 600; letter-spacing: 0.3em;
                    text-transform: uppercase; color: var(--accent);
                    margin-bottom: 0.4rem; opacity: 0.85; position: relative;
                }
                .ol-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.5rem, 4vw, 2rem);
                    font-weight: 700; color: #fff; margin: 0;
                    position: relative;
                }
                .ol-title span { color: var(--accent); }

                /* Container */
                .ol-container { max-width: 1300px; margin: 0 auto; padding: 2rem 1.5rem; }

                /* Stats row */
                .ol-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .ol-stat-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    padding: 1.1rem 1.25rem;
                    box-shadow: var(--shadow);
                }
                .ol-stat-label {
                    font-size: 0.65rem; font-weight: 600; letter-spacing: 0.15em;
                    text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;
                }
                .ol-stat-value {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.6rem; font-weight: 700; color: var(--text); line-height: 1;
                }
                .ol-stat-value.accent { color: var(--accent); }

                /* Table card */
                .ol-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    overflow: hidden;
                    box-shadow: var(--shadow);
                }
                .ol-card-head {
                    padding: 1.1rem 1.5rem;
                    border-bottom: 1px solid var(--border);
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 0.75rem;
                }
                .ol-card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1rem; font-weight: 600; color: var(--text);
                }
                .ol-count-badge {
                    font-size: 0.75rem; color: var(--text-muted);
                    background: var(--surface2); padding: 3px 12px;
                    border-radius: 20px; border: 1px solid var(--border);
                }

                /* Table */
                .ol-table-wrap { overflow-x: auto; }
                .ol-table {
                    width: 100%; border-collapse: collapse;
                    font-size: 0.855rem;
                }
                .ol-table thead tr {
                    background: var(--surface3);
                    border-bottom: 1px solid var(--border);
                }
                .ol-table th {
                    padding: 0.75rem 1.1rem;
                    font-size: 0.65rem; font-weight: 700;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    color: var(--text-muted); text-align: left;
                    white-space: nowrap;
                }
                .ol-table td {
                    padding: 0.9rem 1.1rem;
                    border-bottom: 1px solid var(--border);
                    color: var(--text); vertical-align: middle;
                }
                .ol-table tbody tr:last-child td { border-bottom: none; }
                .ol-table tbody tr {
                    transition: background 0.15s;
                }
                .ol-table tbody tr:hover { background: var(--surface2); }

                /* Order ID */
                .ol-order-id {
                    font-family: monospace;
                    font-size: 0.72rem;
                    color: var(--text-muted);
                    max-width: 90px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: block;
                }

                /* Price */
                .ol-price {
                    font-family: 'Playfair Display', serif;
                    font-weight: 700; font-size: 0.95rem;
                }

                /* Status/paid badges */
                .ol-badge {
                    display: inline-flex; align-items: center; gap: 4px;
                    padding: 3px 10px; border-radius: 20px;
                    font-size: 0.68rem; font-weight: 700;
                    white-space: nowrap;
                }
                .ol-badge-paid   { background: #d4edda; color: #1a6b30; }
                .ol-badge-unpaid { background: #fde8e8; color: #dc2626; }

                /* Actions */
                .ol-actions { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
                .ol-btn {
                    padding: 0.38rem 0.85rem;
                    border-radius: var(--radius-sm);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.75rem; font-weight: 600;
                    cursor: pointer; border: 1px solid;
                    transition: all 0.15s; white-space: nowrap;
                }
                .ol-btn:disabled { opacity: 0.55; cursor: wait; }
                .ol-btn-view {
                    background: var(--surface2); color: var(--text);
                    border-color: var(--border);
                    text-decoration: none; display: inline-flex; align-items: center; gap: 4px;
                }
                .ol-btn-view:hover { border-color: var(--text); color: var(--text); }
                .ol-btn-ship {
                    background: #dbeafe; color: #0369a1;
                    border-color: #93c5fd;
                }
                .ol-btn-ship:hover { background: #0369a1; color: #fff; border-color: #0369a1; }
                .ol-btn-deliver {
                    background: #d4edda; color: #1a6b30;
                    border-color: #6ee7b7;
                }
                .ol-btn-deliver:hover { background: #16a34a; color: #fff; border-color: #16a34a; }

                /* Empty state */
                .ol-empty {
                    text-align: center; padding: 4rem 2rem;
                    border: 1px dashed var(--border);
                    border-radius: var(--radius);
                    background: var(--surface);
                }
                .ol-empty-icon { font-size: 2.5rem; opacity: 0.35; margin-bottom: 0.75rem; }
                .ol-empty-text { font-size: 0.9rem; color: var(--text-muted); }

                /* Loading */
                .ol-loading {
                    text-align: center; padding: 4rem;
                    color: var(--text-muted); font-size: 0.9rem;
                }

                @media (max-width: 768px) {
                    .ol-container { padding: 1.25rem 1rem; }
                    .ol-table th, .ol-table td { padding: 0.7rem 0.75rem; }
                }
            `}</style>

            <div className="ol-wrap">

                {/* Header */}
                <div className="ol-header">
                    <p className="ol-eyebrow">Admin Panel</p>
                    <h1 className="ol-title">All <span>Orders</span></h1>
                </div>

                <div className="ol-container">

                    {/* Stats */}
                    <div className="ol-stats">
                        <div className="ol-stat-card">
                            <p className="ol-stat-label">Total Orders</p>
                            <p className="ol-stat-value">{stats.total}</p>
                        </div>
                        <div className="ol-stat-card">
                            <p className="ol-stat-label">Pending</p>
                            <p className="ol-stat-value" style={{ color: '#b45309' }}>{stats.pending}</p>
                        </div>
                        <div className="ol-stat-card">
                            <p className="ol-stat-label">Shipped</p>
                            <p className="ol-stat-value" style={{ color: '#0369a1' }}>{stats.shipped}</p>
                        </div>
                        <div className="ol-stat-card">
                            <p className="ol-stat-label">Delivered</p>
                            <p className="ol-stat-value" style={{ color: '#16a34a' }}>{stats.delivered}</p>
                        </div>
                        <div className="ol-stat-card">
                            <p className="ol-stat-label">Revenue</p>
                            <p className="ol-stat-value accent">${stats.revenue}</p>
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="ol-loading">Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <div className="ol-empty">
                            <div className="ol-empty-icon">🛍️</div>
                            <p className="ol-empty-text">No orders found.</p>
                        </div>
                    ) : (
                        <div className="ol-card">
                            <div className="ol-card-head">
                                <h2 className="ol-card-title">Order Management</h2>
                                <span className="ol-count-badge">{orders.length} orders</span>
                            </div>
                            <div className="ol-table-wrap">
                                <table className="ol-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Date</th>
                                            <th>Total</th>
                                            <th>Payment</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => {
                                            const statusStyle = getStatusStyle(order.status);
                                            const isActing = actionLoading[order._id];
                                            return (
                                                <tr key={order._id}>
                                                    <td>
                                                        <span className="ol-order-id" title={order._id}>
                                                            #{order._id}
                                                        </span>
                                                    </td>
                                                    <td style={{ maxWidth: 160 }}>
                                                        <span style={{ display: 'block', fontWeight: 500, fontSize: '0.84rem' }}>
                                                            {order.user?.name || '—'}
                                                        </span>
                                                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                                            {order.user?.email}
                                                        </span>
                                                    </td>
                                                    <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                                        {order.createdAt?.substring(0, 10)}
                                                    </td>
                                                    <td>
                                                        <span className="ol-price">${order.totalPrice}</span>
                                                    </td>
                                                    <td>
                                                        <span className={`ol-badge ${order.isPaid ? 'ol-badge-paid' : 'ol-badge-unpaid'}`}>
                                                            {order.isPaid ? '✓ Paid' : '✕ Unpaid'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="ol-badge" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                                                            {statusStyle.icon} {order.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="ol-actions">
                                                            <Link to={`/order/${order._id}`} className="ol-btn ol-btn-view">
                                                                👁 View
                                                            </Link>
                                                            {order.isPaid &&
                                                             order.status !== 'Shipped' &&
                                                             order.status !== 'Delivered' &&
                                                             order.status !== 'Cancelled' && (
                                                                <button
                                                                    className="ol-btn ol-btn-ship"
                                                                    onClick={() => shipHandler(order._id)}
                                                                    disabled={!!isActing}
                                                                >
                                                                    {isActing === 'ship' ? '...' : '🚚 Ship'}
                                                                </button>
                                                            )}
                                                            {order.status === 'Shipped' && (
                                                                <button
                                                                    className="ol-btn ol-btn-deliver"
                                                                    onClick={() => deliverHandler(order._id)}
                                                                    disabled={!!isActing}
                                                                >
                                                                    {isActing === 'deliver' ? '...' : '✅ Deliver'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default OrderListScreen;