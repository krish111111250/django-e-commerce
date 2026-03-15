import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosInstance from '../axios';

function ProductEditScreen() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!id || id === 'undefined') { navigate('/admin/productlist'); return; }
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const user = JSON.parse(userInfo);
            if (!user.isAdmin) { navigate('/'); return; }
        } else { navigate('/login'); return; }
        fetchProduct();
        fetchCategories();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data } = await axiosInstance.get(`/api/products/${id}/`);
            setName(data.name || '');
            setPrice(data.price || 0);
            setBrand(data.brand || '');
            setDescription(data.description || '');
            setCountInStock(data.countInStock || 0);
            setCategory(data.category?.id || data.category?._id || '');
            setImage(data.image || '');
            setLoading(false);
        } catch {
            setError('Error loading product');
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axiosInstance.get('/api/categories/');
            setCategories(data);
        } catch { console.error('Error loading categories'); }
    };

    const imageChangeHandler = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setImage(URL.createObjectURL(file));
    };

    const uploadImageHandler = async () => {
        if (!imageFile) { alert('Please select an image first!'); return; }
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('product_id', id);
        try {
            setUploading(true);
            await axiosInstance.post('/api/products/upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploading(false);
            await fetchProduct();
        } catch {
            setUploading(false);
            alert('Error uploading image');
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (saving) return;
        try {
            setSaving(true);
            setError('');
            await axiosInstance.put(`/api/products/update/${id}/`, {
    name, price, brand, description, countInStock, stock: countInStock, category,
});
            setSuccess(true);
            setSaving(false);
            setTimeout(() => navigate('/admin/productlist'), 1500);
        } catch (err) {
            setSaving(false);
            setError(err.response?.data?.detail || err.message);
        }
    };

    const getImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith('blob:') || img.startsWith('http')) return img;
        return `http://127.0.0.1:8000${img}`;
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
                    --dark: #0d0d0d;
                    --radius: 14px;
                    --radius-sm: 10px;
                    --shadow: 0 2px 16px rgba(0,0,0,0.07);
                }
                * { box-sizing: border-box; }

                .pe-wrap {
                    min-height: 100vh;
                    background: var(--surface2);
                    font-family: 'DM Sans', sans-serif;
                    padding-bottom: 4rem;
                }

                /* ── HEADER ── */
                .pe-header {
                    background: linear-gradient(135deg, #0d0d0d, #1a1612);
                    padding: 2rem 2rem 1.75rem;
                    position: relative;
                    overflow: hidden;
                }
                .pe-header::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse 70% 80% at 50% 0%, rgba(200,169,110,0.1) 0%, transparent 70%);
                }
                .pe-header-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    position: relative;
                }
                .pe-back-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 0.5rem 1rem;
                    background: rgba(255,255,255,0.07);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 6px;
                    color: rgba(255,255,255,0.6);
                    font-size: 0.8rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.2s;
                    flex-shrink: 0;
                    font-family: 'DM Sans', sans-serif;
                }
                .pe-back-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
                .pe-header-text { flex: 1; }
                .pe-eyebrow {
                    font-size: 0.62rem;
                    font-weight: 600;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    color: var(--accent);
                    opacity: 0.85;
                    margin-bottom: 3px;
                }
                .pe-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #fff;
                    margin: 0;
                }
                .pe-title span { color: var(--accent); }
                .pe-id-badge {
                    font-family: monospace;
                    font-size: 0.7rem;
                    color: rgba(255,255,255,0.25);
                    margin-top: 3px;
                }

                /* ── BODY ── */
                .pe-body {
                    max-width: 1100px;
                    margin: 2rem auto;
                    padding: 0 1.5rem;
                    display: grid;
                    grid-template-columns: 1fr 320px;
                    gap: 1.5rem;
                    align-items: start;
                }

                /* ── CARDS ── */
                .pe-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    overflow: hidden;
                    box-shadow: var(--shadow);
                    margin-bottom: 1.25rem;
                }
                .pe-card:last-child { margin-bottom: 0; }
                .pe-card-head {
                    padding: 1rem 1.4rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: var(--surface2);
                }
                .pe-card-icon {
                    width: 30px; height: 30px;
                    border-radius: 50%;
                    background: var(--accent-dim);
                    border: 1px solid rgba(200,169,110,0.2);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.82rem;
                    flex-shrink: 0;
                }
                .pe-card-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 0.92rem;
                    font-weight: 600;
                    color: var(--text);
                }
                .pe-card-body { padding: 1.25rem 1.4rem; }

                /* ── FIELDS ── */
                .pe-field { margin-bottom: 1.1rem; }
                .pe-field:last-child { margin-bottom: 0; }
                .pe-label {
                    display: block;
                    font-size: 0.67rem;
                    font-weight: 700;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    margin-bottom: 6px;
                }
                .pe-input-wrap { position: relative; }
                .pe-input-icon {
                    position: absolute;
                    left: 12px; top: 50%;
                    transform: translateY(-50%);
                    font-size: 0.82rem;
                    opacity: 0.35;
                    pointer-events: none;
                }
                .pe-input, .pe-select, .pe-textarea {
                    width: 100%;
                    border: 1.5px solid var(--border);
                    border-radius: var(--radius-sm);
                    padding: 0.65rem 0.9rem 0.65rem 2.4rem;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.875rem;
                    color: var(--text);
                    background: var(--surface2);
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                }
                .pe-select, .pe-textarea { padding-left: 0.9rem; }
                .pe-select {
                    appearance: none;
                    -webkit-appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 0.75rem center;
                    background-color: var(--surface2);
                    padding-right: 2.2rem;
                }
                .pe-textarea { padding: 0.65rem 0.9rem; resize: vertical; min-height: 100px; }
                .pe-input:focus, .pe-select:focus, .pe-textarea:focus {
                    border-color: var(--accent);
                    box-shadow: 0 0 0 3px rgba(200,169,110,0.12);
                    background: var(--surface);
                }
                .pe-input::placeholder, .pe-textarea::placeholder { color: #ccc; }

                /* 2-col row */
                .pe-row-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                /* Alerts */
                .pe-alert {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 0.75rem 1rem;
                    border-radius: var(--radius-sm);
                    font-size: 0.82rem;
                    font-weight: 500;
                    margin-bottom: 1rem;
                    animation: fadeIn 0.3s ease;
                }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
                .pe-alert.danger { background: #fef2f2; color: #dc2626; border: 1px solid #fca5a5; }
                .pe-alert.success { background: #d4edda; color: #1a6b30; border: 1px solid #a3d9b1; }

                /* Submit button */
                .pe-btn-submit {
                    width: 100%;
                    padding: 0.88rem;
                    background: var(--dark);
                    color: #fff;
                    border: none;
                    border-radius: var(--radius-sm);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 0.5rem;
                }
                .pe-btn-submit:hover:not(:disabled) {
                    background: var(--accent);
                    color: var(--dark);
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(200,169,110,0.25);
                }
                .pe-btn-submit:disabled { background: #ddd; color: #999; cursor: not-allowed; }
                .pe-spinner {
                    width: 14px; height: 14px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* ── RIGHT PANEL ── */
                /* Image card */
                .pe-img-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    overflow: hidden;
                    box-shadow: var(--shadow);
                    margin-bottom: 1.25rem;
                }
                .pe-img-preview {
                    width: 100%;
                    aspect-ratio: 1;
                    background: var(--surface3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }
                .pe-img-preview img {
                    width: 100%; height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }
                .pe-img-preview:hover img { transform: scale(1.03); }
                .pe-img-placeholder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--border);
                    font-size: 0.8rem;
                }
                .pe-img-placeholder-icon { font-size: 3rem; opacity: 0.4; }
                .pe-img-body { padding: 1.1rem 1.25rem; }
                .pe-file-input-wrap {
                    position: relative;
                    margin-bottom: 0.75rem;
                }
                .pe-file-input {
                    width: 100%;
                    padding: 0.55rem 0.85rem;
                    border: 1.5px dashed var(--border);
                    border-radius: var(--radius-sm);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    background: var(--surface2);
                    cursor: pointer;
                    transition: border-color 0.2s;
                }
                .pe-file-input:hover { border-color: var(--accent); }
                .pe-btn-upload {
                    width: 100%;
                    padding: 0.65rem;
                    background: var(--surface2);
                    color: var(--text);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.82rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }
                .pe-btn-upload:hover:not(:disabled) {
                    border-color: var(--accent);
                    color: #9a7a45;
                    background: var(--accent-dim);
                }
                .pe-btn-upload:disabled { opacity: 0.5; cursor: not-allowed; }

                /* Tips card */
                .pe-tips-card {
                    background: linear-gradient(135deg, var(--dark), #1a1612);
                    border: 1px solid rgba(200,169,110,0.15);
                    border-radius: var(--radius);
                    padding: 1.25rem;
                    box-shadow: var(--shadow);
                }
                .pe-tips-title {
                    font-size: 0.62rem;
                    font-weight: 700;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.3);
                    margin-bottom: 0.85rem;
                }
                .pe-tip {
                    display: flex;
                    gap: 8px;
                    align-items: flex-start;
                    margin-bottom: 0.6rem;
                    font-size: 0.78rem;
                    color: rgba(255,255,255,0.45);
                    line-height: 1.5;
                }
                .pe-tip:last-child { margin-bottom: 0; }
                .pe-tip-icon { font-size: 0.82rem; flex-shrink: 0; margin-top: 1px; }

                /* Loading */
                .pe-loading {
                    min-height: 60vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    gap: 0.75rem;
                    color: var(--text-muted);
                    font-size: 0.875rem;
                }
                .pe-loading-spinner {
                    width: 32px; height: 32px;
                    border: 3px solid var(--border);
                    border-top-color: var(--accent);
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                /* ── RESPONSIVE ── */
                @media (max-width: 860px) {
                    .pe-body { grid-template-columns: 1fr; }
                }
                @media (max-width: 560px) {
                    .pe-body { padding: 1rem; }
                    .pe-row-2 { grid-template-columns: 1fr; }
                    .pe-header-inner { flex-direction: column; align-items: flex-start; }
                }
            `}</style>

            <div className="pe-wrap">

                {/* Header */}
                <div className="pe-header">
                    <div className="pe-header-inner">
                        <Link to="/admin/productlist" className="pe-back-btn">← Back</Link>
                        <div className="pe-header-text">
                            <p className="pe-eyebrow">Admin Panel</p>
                            <h1 className="pe-title">Edit <span>Product</span></h1>
                            <p className="pe-id-badge">ID: #{id}</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="pe-loading">
                        <div className="pe-loading-spinner" />
                        <span>Loading product...</span>
                    </div>
                ) : (
                    <div className="pe-body">

                        {/* ── LEFT — Form ── */}
                        <div>
                            {error && <div className="pe-alert danger">⚠️ {error}</div>}
                            {success && <div className="pe-alert success">✅ Product updated! Redirecting...</div>}

                            <form onSubmit={submitHandler}>

                                {/* Basic Info */}
                                <div className="pe-card">
                                    <div className="pe-card-head">
                                        <div className="pe-card-icon">📝</div>
                                        <span className="pe-card-title">Basic Information</span>
                                    </div>
                                    <div className="pe-card-body">
                                        <div className="pe-field">
                                            <label className="pe-label">Product Name</label>
                                            <div className="pe-input-wrap">
                                                <span className="pe-input-icon">🏷️</span>
                                                <input type="text" className="pe-input" placeholder="Enter product name" value={name} onChange={(e) => setName(e.target.value)} required />
                                            </div>
                                        </div>
                                        <div className="pe-field">
                                            <label className="pe-label">Brand</label>
                                            <div className="pe-input-wrap">
                                                <span className="pe-input-icon">🏢</span>
                                                <input type="text" className="pe-input" placeholder="Brand name" value={brand} onChange={(e) => setBrand(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="pe-field">
                                            <label className="pe-label">Category</label>
                                            <select className="pe-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="pe-field">
                                            <label className="pe-label">Description</label>
                                            <textarea className="pe-textarea" placeholder="Product description..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing & Stock */}
                                <div className="pe-card">
                                    <div className="pe-card-head">
                                        <div className="pe-card-icon">💰</div>
                                        <span className="pe-card-title">Pricing & Stock</span>
                                    </div>
                                    <div className="pe-card-body">
                                        <div className="pe-row-2">
                                            <div className="pe-field">
                                                <label className="pe-label">Price ($)</label>
                                                <div className="pe-input-wrap">
                                                    <span className="pe-input-icon">💵</span>
                                                    <input type="number" className="pe-input" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" />
                                                </div>
                                            </div>
                                            <div className="pe-field">
                                                <label className="pe-label">Stock Qty</label>
                                                <div className="pe-input-wrap">
                                                    <span className="pe-input-icon">📦</span>
                                                    <input type="number" className="pe-input" placeholder="0" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} min="0" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stock status pill */}
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                            <span style={{
                                                padding: '3px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.72rem',
                                                fontWeight: 700,
                                                background: countInStock > 10 ? '#d4edda' : countInStock > 0 ? '#fef3c7' : '#fde8e8',
                                                color: countInStock > 10 ? '#1a6b30' : countInStock > 0 ? '#b45309' : '#dc2626',
                                            }}>
                                                {countInStock > 10 ? '✅ In Stock' : countInStock > 0 ? '⚠️ Low Stock' : '❌ Out of Stock'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="pe-btn-submit" disabled={saving}>
                                    {saving ? <><div className="pe-spinner" /> Saving Changes...</> : '💾 Update Product'}
                                </button>
                            </form>
                        </div>

                        {/* ── RIGHT — Image + Tips ── */}
                        <div>

                            {/* Image card */}
                            <div className="pe-img-card">
                                <div className="pe-card-head" style={{ background: 'var(--surface2)' }}>
                                    <div className="pe-card-icon">🖼️</div>
                                    <span className="pe-card-title">Product Image</span>
                                </div>
                                <div className="pe-img-preview">
                                    {getImageUrl(image) ? (
                                        <img
                                            src={getImageUrl(image)}
                                            alt="product"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div className="pe-img-placeholder">
                                            <span className="pe-img-placeholder-icon">📷</span>
                                            <span>No image yet</span>
                                        </div>
                                    )}
                                </div>
                                <div className="pe-img-body">
                                    <div className="pe-file-input-wrap">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="pe-file-input"
                                            onChange={imageChangeHandler}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="pe-btn-upload"
                                        onClick={uploadImageHandler}
                                        disabled={uploading || !imageFile}
                                    >
                                        {uploading ? <><div className="pe-spinner" style={{ borderTopColor: 'var(--accent)' }} /> Uploading...</> : '⬆️ Upload Image'}
                                    </button>
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="pe-tips-card">
                                <div className="pe-tips-title">💡 Tips</div>
                                {[
                                    ['🖼️', 'Use square images (1:1) for best display'],
                                    ['💰', 'Price changes take effect immediately'],
                                    ['📦', 'Set stock to 0 to mark as out of stock'],
                                    ['🏷️', 'Clear product names help with search'],
                                ].map(([icon, text]) => (
                                    <div key={text} className="pe-tip">
                                        <span className="pe-tip-icon">{icon}</span>
                                        <span>{text}</span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ProductEditScreen;
