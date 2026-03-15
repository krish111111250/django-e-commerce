import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axios';

function ProfileScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [orders, setOrders] = useState([]);
    const [saving, setSaving] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) { navigate('/login'); return; }
        const user = JSON.parse(userInfo);
        if (!user?.name) { navigate('/login'); return; }
        setName(user.name);
        setEmail(user.email);

        const fetchOrders = async () => {
            try {
                const { data } = await axiosInstance.get('/api/orders/myorders/');
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchOrders();
    }, [navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password && password !== confirmPassword) {
            setMessage({ text: 'Passwords do not match', type: 'error' });
            return;
        }
        setSaving(true);
        setMessage({ text: '', type: '' });
        try {
            const { data } = await axiosInstance.put('/api/users/profile/update/', {
                name, email, password: password || undefined
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage({ text: 'Error updating profile. Please try again.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const getStatusConfig = (order) => {
        if (order.isDelivered) return { label: 'Delivered', bg: '#d4edda', color: '#1a6b30', icon: '✅' };
        if (order.status === 'Shipped') return { label: 'Shipped', bg: '#dbeafe', color: '#0369a1', icon: '🚚' };
        if (order.status === 'Cancelled') return { label: 'Cancelled', bg: '#fde8e8', color: '#dc2626', icon: '❌' };
        if (order.isPaid) return { label: 'Paid', bg: '#ede9fe', color: '#7c3aed', icon: '💳' };
        return { label: 'Pending', bg: '#fef3c7', color: '#b45309', icon: '⏳' };
    };

    const totalSpent = orders.filter(o => o.isPaid)
        .reduce((acc, o) => acc + Number(o.totalPrice), 0).toFixed(2);

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

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
                .pf-wrap {
                    min-height: 100vh;
                    background: var(--surface2);
                    font-family: 'DM Sans', sans-serif;
                    padding-bottom: 4rem;
                }

                /* Header */
                .pf-header {
                    background: linear-gradient(135deg, #0d0d0d, #1a1612);
                    padding: 2.5rem 1.5rem 3.5rem;
                    text-align: center;
                    position: relative;
                }
                .pf-header::before {
                    content: '';
                    position: absolute; inset: 0;
                    background: radial-gradient(ellipse 70% 80% at 50% 0%, rgba(200,169,110,0.1) 0%, transparent 70%);
                }
                .pf-avatar {
                    width: 72px; height: 72px;
                    border-radius: 50%;
                    background: var(--accent);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Playfair Display', serif;
                    font-size: 1.6rem; font-weight: 700;
                    color: #0d0d0d;
                    margin: 0 auto 0.85rem;
                    border: 3px solid rgba(200,169,110,0.3);
                    position: relative;
                }
                .pf-header-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem; font-weight: 700;
                    color: #fff; margin-bottom: 0.25rem;
                    position: relative;
                }
                .pf-header-email {
                    font-size: 0.82rem; color: rgba(255,255,255,0.4);
                    position: relative;
                }

                /* Stats strip */
                .pf-stats-strip {
                    max-width: 700px; margin: 0 auto;
                    display: flex; gap: 2rem;
                    justify-content: center;
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(200,169,110,0.15);
                    position: relative;
                }
                .pf-stat { text-align: center; }
                .pf-stat-num {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.35rem; font-weight: 700;
                    color: var(--accent);
                }
                .pf-stat-lbl {
                    font-size: 0.62rem; letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.3); margin-top: 2px;
                }

                /* Tabs */
                .pf-tabs {
                    display: flex; gap: 8px;
                    margin-bottom: 0;
                }
                .pf-tab {
                    padding: 0.6rem 1.5rem;
                    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
                    font-size: 0.82rem; font-weight: 600;
                    cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                    white-space: nowrap;
                }
                .pf-tab.active {
                    background: var(--surface);
                    color: var(--text);
                    border-color: var(--border);
                    border-bottom-color: var(--surface);
                    position: relative;
                    z-index: 1;
                    margin-bottom: -1px;
                }
                .pf-tab.inactive {
                    background: var(--surface3);
                    color: var(--text-muted);
                    border-color: var(--border);
                }
                .pf-tab.inactive:hover {
                    background: var(--surface2);
                    color: var(--text);
                }

                /* Container */
                .pf-container {
                    max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem 3rem;
                }
                .pf-panel {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 0 var(--radius) var(--radius) var(--radius);
                    box-shadow: var(--shadow);
                    overflow: hidden;
                }

                /* Profile form */
                .pf-form-wrap { padding: 2rem; }
                .pf-section-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.1rem; font-weight: 600; color: var(--text);
                    margin-bottom: 1.5rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid var(--border);
                    display: flex; align-items: center; gap: 8px;
                }
                .pf-form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.25rem;
                }
                .pf-form-group { display: flex; flex-direction: column; gap: 6px; }
                .pf-form-group.full { grid-column: 1 / -1; }
                .pf-label {
                    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em;
                    text-transform: uppercase; color: var(--text-muted);
                }
                .pf-input {
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    padding: 0.65rem 0.9rem;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.875rem; color: var(--text);
                    background: var(--surface2); outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .pf-input:focus {
                    border-color: var(--accent);
                    box-shadow: 0 0 0 3px rgba(200,169,110,0.12);
                    background: var(--surface);
                }
                .pf-divider {
                    grid-column: 1 / -1;
                    height: 1px; background: var(--border);
                    margin: 0.25rem 0;
                }
                .pf-alert {
                    grid-column: 1 / -1;
                    padding: 0.7rem 1rem;
                    border-radius: var(--radius-sm);
                    font-size: 0.84rem;
                    display: flex; align-items: center; gap: 8px;
                }
                .pf-alert.success { background: #d4edda; color: #1a6b30; border: 1px solid #a3d9b3; }
                .pf-alert.error   { background: #fde8e8; color: #dc2626; border: 1px solid #fca5a5; }
                .pf-btn-save {
                    grid-column: 1 / -1;
                    padding: 0.75rem 2rem;
                    background: #0d0d0d; color: #fff;
                    border: none; border-radius: var(--radius-sm);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.875rem; font-weight: 700;
                    cursor: pointer; transition: background 0.2s, transform 0.15s;
                    letter-spacing: 0.04em; width: fit-content;
                }
                .pf-btn-save:hover:not(:disabled) {
                    background: var(--accent); color: #0d0d0d;
                    transform: translateY(-1px);
                }
                .pf-btn-save:disabled { opacity: 0.6; cursor: wait; }

                /* Orders tab */
                .pf-orders-wrap { padding: 1.5rem 2rem 2rem; }
                .pf-orders-head {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 1.25rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid var(--border);
                    flex-wrap: wrap; gap: 0.5rem;
                }

                /* Order cards list */
                .pf-order-row {
                    display: grid;
                    grid-template-columns: 90px 1fr auto auto auto;
                    gap: 0.75rem 1.25rem;
                    align-items: center;
                    padding: 0.9rem 0;
                    border-bottom: 1px solid var(--border);
                    transition: background 0.15s;
                }
                .pf-order-row:last-child { border-bottom: none; }
                .pf-order-id {
                    font-family: monospace; font-size: 0.7rem;
                    color: var(--text-muted); overflow: hidden;
                    text-overflow: ellipsis; white-space: nowrap;
                }
                .pf-order-date { font-size: 0.8rem; color: var(--text-muted); }
                .pf-order-price {
                    font-family: 'Playfair Display', serif;
                    font-size: 1rem; font-weight: 700; color: var(--text);
                    white-space: nowrap;
                }
                .pf-order-badge {
                    display: inline-flex; align-items: center; gap: 4px;
                    padding: 3px 10px; border-radius: 20px;
                    font-size: 0.68rem; font-weight: 700; white-space: nowrap;
                }
                .pf-order-btn {
                    padding: 0.38rem 0.85rem;
                    border: 1px solid var(--border);
                    background: var(--surface2);
                    color: var(--text);
                    border-radius: var(--radius-sm);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.75rem; font-weight: 600;
                    cursor: pointer; transition: all 0.15s;
                    text-decoration: none; display: inline-block;
                    white-space: nowrap;
                }
                .pf-order-btn:hover { border-color: var(--text); color: var(--text); }

                /* Empty orders */
                .pf-orders-empty {
                    text-align: center; padding: 3rem 1rem;
                    color: var(--text-muted);
                }
                .pf-orders-empty-icon { font-size: 2.5rem; opacity: 0.3; margin-bottom: 0.75rem; }
                .pf-orders-empty-text { font-size: 0.875rem; margin-bottom: 1.25rem; }
                .pf-orders-empty-link {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 0.6rem 1.4rem;
                    background: #0d0d0d; color: #fff;
                    border-radius: var(--radius-sm);
                    text-decoration: none; font-size: 0.82rem; font-weight: 600;
                    transition: background 0.2s;
                }
                .pf-orders-empty-link:hover { background: var(--accent); color: #0d0d0d; }

                @media (max-width: 700px) {
                    .pf-form-grid { grid-template-columns: 1fr; }
                    .pf-form-group.full { grid-column: 1; }
                    .pf-btn-save { grid-column: 1; width: 100%; }
                    .pf-alert { grid-column: 1; }
                    .pf-divider { grid-column: 1; }
                    .pf-order-row { grid-template-columns: 1fr 1fr; }
                    .pf-order-id { grid-column: 1 / -1; }
                    .pf-stats-strip { gap: 1.25rem; }
                    .pf-container { padding: 0 1rem 2rem; }
                    .pf-form-wrap, .pf-orders-wrap { padding: 1.25rem; }
                }
            `}</style>

            <div className="pf-wrap">

                {/* Header */}
                <div className="pf-header">
                    <div className="pf-avatar">{initials}</div>
                    <h1 className="pf-header-name">{name}</h1>
                    <p className="pf-header-email">{email}</p>
                    <div className="pf-stats-strip">
                        <div className="pf-stat">
                            <div className="pf-stat-num">{orders.length}</div>
                            <div className="pf-stat-lbl">Orders</div>
                        </div>
                        <div className="pf-stat">
                            <div className="pf-stat-num">${totalSpent}</div>
                            <div className="pf-stat-lbl">Total Spent</div>
                        </div>
                        <div className="pf-stat">
                            <div className="pf-stat-num">
                                {orders.filter(o => o.isDelivered).length}
                            </div>
                            <div className="pf-stat-lbl">Delivered</div>
                        </div>
                    </div>
                </div>

                {/* Container + Tabs */}
                <div className="pf-container">
                    <div className="pf-tabs">
                        <button
                            className={`pf-tab ${activeTab === 'profile' ? 'active' : 'inactive'}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            👤 Profile
                        </button>
                        <button
                            className={`pf-tab ${activeTab === 'orders' ? 'active' : 'inactive'}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            🛍️ My Orders {orders.length > 0 && `(${orders.length})`}
                        </button>
                    </div>
                    <div className="pf-panel">

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="pf-form-wrap">
                                <h2 className="pf-section-title">👤 Personal Information</h2>
                                <form onSubmit={submitHandler}>
                                    <div className="pf-form-grid">

                                        {message.text && (
                                            <div className={`pf-alert ${message.type}`}>
                                                {message.type === 'success' ? '✅' : '⚠️'} {message.text}
                                            </div>
                                        )}

                                        <div className="pf-form-group">
                                            <label className="pf-label">Full Name</label>
                                            <input
                                                className="pf-input"
                                                type="text"
                                                required
                                                placeholder="Your name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>

                                        <div className="pf-form-group">
                                            <label className="pf-label">Email Address</label>
                                            <input
                                                className="pf-input"
                                                type="email"
                                                required
                                                placeholder="your@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>

                                        <div className="pf-divider" />

                                        <div className="pf-form-group full" style={{ marginBottom: '0.25rem' }}>
                                            <label className="pf-label" style={{ color: 'var(--accent)', opacity: 0.8 }}>
                                                Change Password — leave blank to keep current
                                            </label>
                                        </div>

                                        <div className="pf-form-group">
                                            <label className="pf-label">New Password</label>
                                            <input
                                                className="pf-input"
                                                type="password"
                                                placeholder="New password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>

                                        <div className="pf-form-group">
                                            <label className="pf-label">Confirm Password</label>
                                            <input
                                                className="pf-input"
                                                type="password"
                                                placeholder="Confirm new password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="pf-btn-save"
                                            disabled={saving}
                                        >
                                            {saving ? '⟳ Saving...' : '✓ Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="pf-orders-wrap">
                                <div className="pf-orders-head">
                                    <h2 className="pf-section-title" style={{ margin: 0, border: 'none', paddingBottom: 0 }}>
                                        🛍️ Order History
                                    </h2>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                        {orders.length} order{orders.length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                {loadingOrders ? (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '2rem 0', textAlign: 'center' }}>
                                        Loading orders...
                                    </p>
                                ) : orders.length === 0 ? (
                                    <div className="pf-orders-empty">
                                        <div className="pf-orders-empty-icon">🛍️</div>
                                        <p className="pf-orders-empty-text">You haven't placed any orders yet.</p>
                                        <Link to="/" className="pf-orders-empty-link">Start Shopping →</Link>
                                    </div>
                                ) : (
                                    orders.map(order => {
                                        const statusCfg = getStatusConfig(order);
                                        return (
                                            <div key={order._id} className="pf-order-row">
                                                <span className="pf-order-id" title={order._id}>
                                                    #{order._id}
                                                </span>
                                                <span className="pf-order-date">
                                                    {order.createdAt?.substring(0, 10)}
                                                </span>
                                                <span className="pf-order-price">
                                                    ${order.totalPrice}
                                                </span>
                                                <span
                                                    className="pf-order-badge"
                                                    style={{ background: statusCfg.bg, color: statusCfg.color }}
                                                >
                                                    {statusCfg.icon} {statusCfg.label}
                                                </span>
                                                <Link to={`/order/${order._id}`} className="pf-order-btn">
                                                    Details →
                                                </Link>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfileScreen;