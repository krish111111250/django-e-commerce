import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axios';

function ProductListScreen() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) { navigate('/login'); return; }
        const user = JSON.parse(userInfo);
        if (!user.isAdmin) { navigate('/'); return; }
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axiosInstance.get('/api/products/');
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setDeletingId(id);
            try {
                await axiosInstance.delete(`/api/products/delete/${id}/`);
                fetchProducts();
            } catch (error) {
                alert('Error deleting product.');
            } finally {
                setDeletingId(null);
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm('Create a new sample product?')) {
            setCreating(true);
            try {
                const { data } = await axiosInstance.post('/api/products/create/', {});
                fetchProducts();
                navigate(`/admin/product/${data._id}/edit`);
            } catch (error) {
                alert('Error creating product');
            } finally {
                setCreating(false);
            }
        }
    };

    const getImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith('http')) return img;
        return `https://django-e-commerce-production-f7fc.up.railway.app${img}`;
    };

    const inStock = products.filter(p => (p.countInStock || p.stock || 0) > 0).length;
    const outOfStock = products.length - inStock;

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
                .pl-wrap {
                    min-height: 100vh;
                    background: var(--surface2);
                    font-family: 'DM Sans', sans-serif;
                    padding-bottom: 4rem;
                }

                /* Header */
                .pl-header {
                    background: linear-gradient(135deg, #0d0d0d, #1a1612);
                    padding: 2.5rem 1.5rem 2rem;
                    position: relative;
                }
                .pl-header::before {
                    content: '';
                    position: absolute; inset: 0;
                    background: radial-gradient(ellipse 70% 80% at 50% 0%, rgba(200,169,110,0.1) 0%, transparent 70%);
                }
                .pl-header-inner {
                    max-width: 1300px; margin: 0 auto;
                    display: flex; align-items: flex-end;
                    justify-content: space-between; gap: 1rem;
                    flex-wrap: wrap; position: relative;
                }
                .pl-header-text {}
                .pl-eyebrow {
                    font-size: 0.65rem; font-weight: 600; letter-spacing: 0.3em;
                    text-transform: uppercase; color: var(--accent);
                    margin-bottom: 0.35rem; opacity: 0.85;
                }
                .pl-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.5rem, 4vw, 2rem);
                    font-weight: 700; color: #fff; margin: 0;
                }
                .pl-title span { color: var(--accent); }
                .pl-btn-create {
                    display: flex; align-items: center; gap: 8px;
                    padding: 0.7rem 1.5rem;
                    background: var(--accent);
                    color: #0d0d0d;
                    border: none; border-radius: var(--radius-sm);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.85rem; font-weight: 700;
                    letter-spacing: 0.04em;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.15s;
                    white-space: nowrap;
                }
                .pl-btn-create:hover:not(:disabled) {
                    background: var(--accent-light);
                    transform: translateY(-1px);
                }
                .pl-btn-create:disabled { opacity: 0.6; cursor: wait; }

                /* Container */
                .pl-container { max-width: 1300px; margin: 0 auto; padding: 2rem 1.5rem; }

                /* Stats */
                .pl-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 1rem; margin-bottom: 2rem;
                }
                .pl-stat-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    padding: 1.1rem 1.25rem;
                    box-shadow: var(--shadow);
                }
                .pl-stat-label {
                    font-size: 0.65rem; font-weight: 600; letter-spacing: 0.15em;
                    text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;
                }
                .pl-stat-value {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.6rem; font-weight: 700; color: var(--text); line-height: 1;
                }

                /* Table card */
                .pl-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    overflow: hidden;
                    box-shadow: var(--shadow);
                }
                .pl-card-head {
                    padding: 1.1rem 1.5rem;
                    border-bottom: 1px solid var(--border);
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 0.75rem;
                }
                .pl-card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1rem; font-weight: 600; color: var(--text);
                }
                .pl-count-badge {
                    font-size: 0.75rem; color: var(--text-muted);
                    background: var(--surface2); padding: 3px 12px;
                    border-radius: 20px; border: 1px solid var(--border);
                }

                /* Table */
                .pl-table-wrap { overflow-x: auto; }
                .pl-table { width: 100%; border-collapse: collapse; font-size: 0.855rem; }
                .pl-table thead tr {
                    background: var(--surface3);
                    border-bottom: 1px solid var(--border);
                }
                .pl-table th {
                    padding: 0.75rem 1.1rem;
                    font-size: 0.65rem; font-weight: 700;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    color: var(--text-muted); text-align: left; white-space: nowrap;
                }
                .pl-table td {
                    padding: 0.9rem 1.1rem;
                    border-bottom: 1px solid var(--border);
                    color: var(--text); vertical-align: middle;
                }
                .pl-table tbody tr:last-child td { border-bottom: none; }
                .pl-table tbody tr { transition: background 0.15s; }
                .pl-table tbody tr:hover { background: var(--surface2); }

                /* Product cell */
                .pl-product-cell {
                    display: flex; align-items: center; gap: 0.85rem;
                }
                .pl-thumb {
                    width: 44px; height: 44px;
                    border-radius: var(--radius-sm);
                    object-fit: cover;
                    background: var(--surface3);
                    border: 1px solid var(--border);
                    display: flex; align-items: center; justify-content: center;
                    overflow: hidden; flex-shrink: 0; font-size: 1.1rem;
                    color: var(--border);
                }
                .pl-thumb img { width: 100%; height: 100%; object-fit: cover; }
                .pl-product-name {
                    font-weight: 600; font-size: 0.875rem;
                    color: var(--text); line-height: 1.3;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    max-width: 200px;
                }

                /* ID */
                .pl-id {
                    font-family: monospace; font-size: 0.7rem;
                    color: var(--text-muted); max-width: 80px;
                    overflow: hidden; text-overflow: ellipsis;
                    white-space: nowrap; display: block;
                }

                /* Price */
                .pl-price {
                    font-family: 'Playfair Display', serif;
                    font-weight: 700; font-size: 0.95rem;
                }

                /* Stock badge */
                .pl-badge {
                    display: inline-flex; align-items: center; gap: 4px;
                    padding: 3px 10px; border-radius: 20px;
                    font-size: 0.68rem; font-weight: 700; white-space: nowrap;
                }
                .pl-badge-in  { background: #d4edda; color: #1a6b30; }
                .pl-badge-out { background: #fde8e8; color: #dc2626; }

                /* Actions */
                .pl-actions { display: flex; gap: 6px; align-items: center; }
                .pl-btn {
                    padding: 0.38rem 0.85rem;
                    border-radius: var(--radius-sm);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.75rem; font-weight: 600;
                    cursor: pointer; border: 1px solid;
                    transition: all 0.15s; white-space: nowrap;
                    display: inline-flex; align-items: center; gap: 4px;
                    text-decoration: none;
                }
                .pl-btn:disabled { opacity: 0.55; cursor: wait; }
                .pl-btn-edit {
                    background: var(--accent-dim); color: #9a7a45;
                    border-color: rgba(200,169,110,0.3);
                }
                .pl-btn-edit:hover { background: var(--accent); color: #0d0d0d; border-color: var(--accent); }
                .pl-btn-delete {
                    background: #fef2f2; color: #dc2626;
                    border-color: #fca5a5;
                }
                .pl-btn-delete:hover { background: #dc2626; color: #fff; border-color: #dc2626; }

                /* Empty / Loading */
                .pl-empty {
                    text-align: center; padding: 4rem 2rem;
                    border: 1px dashed var(--border);
                    border-radius: var(--radius); background: var(--surface);
                }
                .pl-empty-icon { font-size: 2.5rem; opacity: 0.35; margin-bottom: 0.75rem; }
                .pl-empty-text { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem; }
                .pl-loading { text-align: center; padding: 4rem; color: var(--text-muted); font-size: 0.9rem; }

                @media (max-width: 768px) {
                    .pl-container { padding: 1.25rem 1rem; }
                    .pl-table th, .pl-table td { padding: 0.7rem 0.75rem; }
                    .pl-product-name { max-width: 130px; }
                }
            `}</style>

            <div className="pl-wrap">

                {/* Header */}
                <div className="pl-header">
                    <div className="pl-header-inner">
                        <div className="pl-header-text">
                            <p className="pl-eyebrow">Admin Panel</p>
                            <h1 className="pl-title">Product <span>Management</span></h1>
                        </div>
                        <button
                            className="pl-btn-create"
                            onClick={createProductHandler}
                            disabled={creating}
                        >
                            {creating ? '⟳ Creating...' : '+ Create Product'}
                        </button>
                    </div>
                </div>

                <div className="pl-container">

                    {/* Stats */}
                    <div className="pl-stats">
                        <div className="pl-stat-card">
                            <p className="pl-stat-label">Total Products</p>
                            <p className="pl-stat-value">{products.length}</p>
                        </div>
                        <div className="pl-stat-card">
                            <p className="pl-stat-label">In Stock</p>
                            <p className="pl-stat-value" style={{ color: '#16a34a' }}>{inStock}</p>
                        </div>
                        <div className="pl-stat-card">
                            <p className="pl-stat-label">Out of Stock</p>
                            <p className="pl-stat-value" style={{ color: '#dc2626' }}>{outOfStock}</p>
                        </div>
                        <div className="pl-stat-card">
                            <p className="pl-stat-label">Categories</p>
                            <p className="pl-stat-value" style={{ color: 'var(--accent)' }}>
                                {new Set(products.map(p => p.category?.name).filter(Boolean)).size}
                            </p>
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="pl-loading">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="pl-empty">
                            <div className="pl-empty-icon">📦</div>
                            <p className="pl-empty-text">No products yet. Create your first one!</p>
                            <button className="pl-btn-create" onClick={createProductHandler} disabled={creating}>
                                + Create Product
                            </button>
                        </div>
                    ) : (
                        <div className="pl-card">
                            <div className="pl-card-head">
                                <h2 className="pl-card-title">All Products</h2>
                                <span className="pl-count-badge">{products.length} products</span>
                            </div>
                            <div className="pl-table-wrap">
                                <table className="pl-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Category</th>
                                            <th>Stock</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(product => {
                                            const stock = product.countInStock ?? product.stock ?? 0;
                                            const imgUrl = getImageUrl(product.image);
                                            return (
                                                <tr key={product._id}>
                                                    <td>
                                                        <span className="pl-id" title={product._id}>
                                                            #{product._id}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="pl-product-cell">
                                                            <div className="pl-thumb">
                                                                {imgUrl
                                                                    ? <img src={imgUrl} alt={product.name} onError={(e) => { e.target.style.display = 'none'; }} />
                                                                    : '📦'
                                                                }
                                                            </div>
                                                            <span className="pl-product-name">{product.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="pl-price">${product.price}</span>
                                                    </td>
                                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                                        {product.category?.name || '—'}
                                                    </td>
                                                    <td>
                                                        <span className={`pl-badge ${stock > 0 ? 'pl-badge-in' : 'pl-badge-out'}`}>
                                                            {stock > 0 ? `✓ ${stock} units` : '✕ Out of Stock'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="pl-actions">
                                                            <Link to={`/admin/product/${product._id}/edit`} className="pl-btn pl-btn-edit">
                                                                ✏️ Edit
                                                            </Link>
                                                            <button
                                                                className="pl-btn pl-btn-delete"
                                                                onClick={() => deleteHandler(product._id)}
                                                                disabled={deletingId === product._id}
                                                            >
                                                                {deletingId === product._id ? '...' : '🗑️ Delete'}
                                                            </button>
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

export default ProductListScreen;