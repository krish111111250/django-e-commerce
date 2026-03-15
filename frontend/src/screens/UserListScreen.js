import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axios';

function UserListScreen() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const user = JSON.parse(userInfo);
            if (user.isAdmin) {
                fetchUsers();
            } else {
                navigate('/');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            const { data } = await axiosInstance.get('/api/auth/users/');
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setDeletingId(id);
            try {
                await axiosInstance.delete(`/api/auth/users/${id}/`);
                fetchUsers();
            } catch (error) {
                alert('Error deleting user');
            } finally {
                setDeletingId(null);
            }
        }
    };

    const adminCount = users.filter(u => u.isAdmin).length;
    const regularCount = users.length - adminCount;

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
                .ul-wrap {
                    min-height: 100vh;
                    background: var(--surface2);
                    font-family: 'DM Sans', sans-serif;
                    padding-bottom: 4rem;
                }

                /* Header */
                .ul-header {
                    background: linear-gradient(135deg, #0d0d0d, #1a1612);
                    padding: 2.5rem 1.5rem 2rem;
                    text-align: center;
                    position: relative;
                }
                .ul-header::before {
                    content: '';
                    position: absolute; inset: 0;
                    background: radial-gradient(ellipse 70% 80% at 50% 0%, rgba(200,169,110,0.1) 0%, transparent 70%);
                }
                .ul-eyebrow {
                    font-size: 0.65rem; font-weight: 600; letter-spacing: 0.3em;
                    text-transform: uppercase; color: var(--accent);
                    margin-bottom: 0.4rem; opacity: 0.85; position: relative;
                }
                .ul-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.5rem, 4vw, 2rem);
                    font-weight: 700; color: #fff; margin: 0;
                    position: relative;
                }
                .ul-title span { color: var(--accent); }

                /* Container */
                .ul-container { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; }

                /* Stats */
                .ul-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 1rem; margin-bottom: 2rem;
                }
                .ul-stat-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    padding: 1.1rem 1.25rem;
                    box-shadow: var(--shadow);
                }
                .ul-stat-label {
                    font-size: 0.65rem; font-weight: 600; letter-spacing: 0.15em;
                    text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;
                }
                .ul-stat-value {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.6rem; font-weight: 700; color: var(--text); line-height: 1;
                }

                /* Table card */
                .ul-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    overflow: hidden;
                    box-shadow: var(--shadow);
                }
                .ul-card-head {
                    padding: 1.1rem 1.5rem;
                    border-bottom: 1px solid var(--border);
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 0.75rem;
                }
                .ul-card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1rem; font-weight: 600; color: var(--text);
                }
                .ul-count-badge {
                    font-size: 0.75rem; color: var(--text-muted);
                    background: var(--surface2); padding: 3px 12px;
                    border-radius: 20px; border: 1px solid var(--border);
                }

                /* Table */
                .ul-table-wrap { overflow-x: auto; }
                .ul-table { width: 100%; border-collapse: collapse; font-size: 0.855rem; }
                .ul-table thead tr {
                    background: var(--surface3);
                    border-bottom: 1px solid var(--border);
                }
                .ul-table th {
                    padding: 0.75rem 1.1rem;
                    font-size: 0.65rem; font-weight: 700;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    color: var(--text-muted); text-align: left; white-space: nowrap;
                }
                .ul-table td {
                    padding: 0.9rem 1.1rem;
                    border-bottom: 1px solid var(--border);
                    color: var(--text); vertical-align: middle;
                }
                .ul-table tbody tr:last-child td { border-bottom: none; }
                .ul-table tbody tr { transition: background 0.15s; }
                .ul-table tbody tr:hover { background: var(--surface2); }

                /* User cell with avatar */
                .ul-user-cell {
                    display: flex; align-items: center; gap: 0.85rem;
                }
                .ul-avatar {
                    width: 36px; height: 36px;
                    border-radius: 50%;
                    background: var(--accent-dim);
                    border: 1px solid rgba(200,169,110,0.3);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Playfair Display', serif;
                    font-size: 0.75rem; font-weight: 700;
                    color: var(--accent); flex-shrink: 0;
                    text-transform: uppercase;
                }
                .ul-avatar.admin-av {
                    background: rgba(200,169,110,0.2);
                    border-color: var(--accent);
                }
                .ul-user-name {
                    font-weight: 600; font-size: 0.875rem; color: var(--text);
                }
                .ul-user-id {
                    font-family: monospace; font-size: 0.68rem;
                    color: var(--text-muted); margin-top: 1px;
                }

                /* Email link */
                .ul-email-link {
                    color: var(--accent); text-decoration: none;
                    font-size: 0.84rem; transition: opacity 0.15s;
                }
                .ul-email-link:hover { opacity: 0.75; text-decoration: underline; }

                /* Role badge */
                .ul-badge {
                    display: inline-flex; align-items: center; gap: 4px;
                    padding: 3px 10px; border-radius: 20px;
                    font-size: 0.68rem; font-weight: 700; white-space: nowrap;
                }
                .ul-badge-admin { background: var(--accent-dim); color: #9a7a45; border: 1px solid rgba(200,169,110,0.3); }
                .ul-badge-user  { background: var(--surface2); color: var(--text-muted); border: 1px solid var(--border); }

                /* Delete btn */
                .ul-btn-delete {
                    padding: 0.38rem 0.9rem;
                    border-radius: var(--radius-sm);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.75rem; font-weight: 600;
                    cursor: pointer;
                    background: #fef2f2; color: #dc2626;
                    border: 1px solid #fca5a5;
                    transition: all 0.15s; white-space: nowrap;
                }
                .ul-btn-delete:hover:not(:disabled) {
                    background: #dc2626; color: #fff; border-color: #dc2626;
                }
                .ul-btn-delete:disabled { opacity: 0.55; cursor: wait; }

                /* Empty / Loading */
                .ul-empty {
                    text-align: center; padding: 4rem 2rem;
                    border: 1px dashed var(--border);
                    border-radius: var(--radius); background: var(--surface);
                }
                .ul-empty-icon { font-size: 2.5rem; opacity: 0.35; margin-bottom: 0.75rem; }
                .ul-empty-text { font-size: 0.9rem; color: var(--text-muted); }
                .ul-loading { text-align: center; padding: 4rem; color: var(--text-muted); font-size: 0.9rem; }

                @media (max-width: 768px) {
                    .ul-container { padding: 1.25rem 1rem; }
                    .ul-table th, .ul-table td { padding: 0.7rem 0.75rem; }
                }
            `}</style>

            <div className="ul-wrap">

                {/* Header */}
                <div className="ul-header">
                    <p className="ul-eyebrow">Admin Panel</p>
                    <h1 className="ul-title">User <span>Management</span></h1>
                </div>

                <div className="ul-container">

                    {/* Stats */}
                    <div className="ul-stats">
                        <div className="ul-stat-card">
                            <p className="ul-stat-label">Total Users</p>
                            <p className="ul-stat-value">{users.length}</p>
                        </div>
                        <div className="ul-stat-card">
                            <p className="ul-stat-label">Admins</p>
                            <p className="ul-stat-value" style={{ color: 'var(--accent)' }}>{adminCount}</p>
                        </div>
                        <div className="ul-stat-card">
                            <p className="ul-stat-label">Regular Users</p>
                            <p className="ul-stat-value" style={{ color: '#0369a1' }}>{regularCount}</p>
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="ul-loading">Loading users...</div>
                    ) : users.length === 0 ? (
                        <div className="ul-empty">
                            <div className="ul-empty-icon">👥</div>
                            <p className="ul-empty-text">No users found.</p>
                        </div>
                    ) : (
                        <div className="ul-card">
                            <div className="ul-card-head">
                                <h2 className="ul-card-title">All Users</h2>
                                <span className="ul-count-badge">{users.length} users</span>
                            </div>
                            <div className="ul-table-wrap">
                                <table className="ul-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td>
                                                    <div className="ul-user-cell">
                                                        <div className={`ul-avatar ${user.isAdmin ? 'admin-av' : ''}`}>
                                                            {getInitials(user.name)}
                                                        </div>
                                                        <div>
                                                            <div className="ul-user-name">{user.name || '—'}</div>
                                                            <div className="ul-user-id">#{user.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <a href={`mailto:${user.email}`} className="ul-email-link">
                                                        {user.email}
                                                    </a>
                                                </td>
                                                <td>
                                                    {user.isAdmin ? (
                                                        <span className="ul-badge ul-badge-admin">✦ Admin</span>
                                                    ) : (
                                                        <span className="ul-badge ul-badge-user">User</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <button
                                                        className="ul-btn-delete"
                                                        onClick={() => deleteHandler(user.id)}
                                                        disabled={deletingId === user.id}
                                                    >
                                                        {deletingId === user.id ? '...' : '🗑️ Delete'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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

export default UserListScreen;