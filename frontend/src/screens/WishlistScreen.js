import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axios';

function WishlistScreen() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ text: '', type: '' });
    const [removingId, setRemovingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) { navigate('/login'); return; }
        fetchWishlist();
    }, [navigate]);

    const fetchWishlist = async () => {
        try {
            const { data } = await axiosInstance.get('/api/wishlist/');
            setWishlist(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (text, type = 'info') => {
        setToast({ text, type });
        setTimeout(() => setToast({ text: '', type: '' }), 3000);
    };

    const removeFromWishlist = async (productId) => {
        setRemovingId(productId);
        try {
            await axiosInstance.delete(`/api/wishlist/remove/${productId}/`);
            setWishlist(prev => prev.filter(p => p._id !== productId));
            showToast('Removed from wishlist', 'remove');
        } catch (error) {
            console.error(error);
        } finally {
            setRemovingId(null);
        }
    };

    const addToCart = (product) => {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (cartItems.find(x => x._id === product._id)) {
            showToast('Already in cart!', 'warn');
        } else {
            cartItems.push({ ...product, qty: 1 });
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            showToast(`${product.name} added to cart! 🛒`, 'success');
        }
    };

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
                    --accent: #c8a96e; --accent-light: #e8d5b0;
                    --accent-dim: rgba(200,169,110,0.12);
                    --text: #1a1a1a; --text-muted: #777;
                    --border: #e8e4df; --surface: #ffffff;
                    --surface2: #f8f6f3; --surface3: #f2efe9;
                    --radius: 14px; --radius-sm: 8px;
                    --shadow: 0 2px 16px rgba(0,0,0,0.07);
                    --shadow-hover: 0 12px 40px rgba(0,0,0,0.13);
                }
                .wl-wrap {
                    min-height: 100vh;
                    background: var(--surface2);
                    font-family: 'DM Sans', sans-serif;
                    padding-bottom: 4rem;
                }

                /* Header */
                .wl-header {
                    background: linear-gradient(135deg, #0d0d0d, #1a1612);
                    padding: 2.5rem 1.5rem;
                    text-align: center;
                    position: relative;
                }
                .wl-header::before {
                    content: '';
                    position: absolute; inset: 0;
                    background: radial-gradient(ellipse 70% 80% at 50% 0%, rgba(200,169,110,0.1) 0%, transparent 70%);
                }
                .wl-eyebrow {
                    font-size: 0.65rem; font-weight: 600; letter-spacing: 0.3em;
                    text-transform: uppercase; color: var(--accent);
                    margin-bottom: 0.4rem; opacity: 0.85; position: relative;
                }
                .wl-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.5rem, 4vw, 2rem);
                    font-weight: 700; color: #fff; margin: 0;
                    position: relative;
                }
                .wl-title span { color: var(--accent); }
                .wl-subtitle {
                    font-size: 0.82rem; color: rgba(255,255,255,0.35);
                    margin-top: 0.5rem; position: relative;
                }

                /* Toast */
                .wl-toast {
                    position: fixed; top: 80px; right: 1.5rem;
                    z-index: 9999;
                    padding: 0.7rem 1.2rem;
                    border-radius: var(--radius-sm);
                    font-size: 0.84rem; font-weight: 500;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
                    animation: toastIn 0.25s ease;
                    max-width: 300px;
                }
                @keyframes toastIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .wl-toast.success { background: #d4edda; color: #1a6b30; border: 1px solid #a3d9b3; }
                .wl-toast.warn    { background: #fef3c7; color: #b45309; border: 1px solid #fcd34d; }
                .wl-toast.remove  { background: #fde8e8; color: #dc2626; border: 1px solid #fca5a5; }
                .wl-toast.info    { background: var(--accent-dim); color: #9a7a45; border: 1px solid rgba(200,169,110,0.3); }

                /* Container */
                .wl-container { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; }

                /* Section header */
                .wl-section-head {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem;
                }
                .wl-section-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.3rem; font-weight: 700; color: var(--text);
                }
                .wl-section-title span {
                    display: block;
                    font-size: 0.68rem; font-family: 'DM Sans', sans-serif;
                    font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
                    color: var(--accent); margin-bottom: 0.2rem;
                }
                .wl-count {
                    font-size: 0.8rem; color: var(--text-muted);
                }
                .wl-count strong { color: var(--text); }

                /* Grid */
                .wl-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.5rem;
                }

                /* Card */
                .wl-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    overflow: hidden;
                    display: flex; flex-direction: column;
                    transition: transform 0.3s, box-shadow 0.3s;
                    position: relative;
                }
                .wl-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-hover);
                }

                /* Image */
                .wl-card-img-wrap {
                    position: relative;
                    background: var(--surface3);
                    aspect-ratio: 4/3; overflow: hidden;
                }
                .wl-card-img {
                    width: 100%; height: 100%;
                    object-fit: cover;
                    transition: transform 0.4s;
                }
                .wl-card:hover .wl-card-img { transform: scale(1.04); }
                .wl-img-placeholder {
                    width: 100%; height: 100%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 3rem; color: var(--border);
                    background: linear-gradient(135deg, #f5f3f0, #ece9e3);
                }
                .wl-stock-badge {
                    position: absolute; top: 10px; left: 10px;
                    padding: 3px 10px; border-radius: 20px;
                    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
                }
                .wl-stock-badge.in  { background: #d4edda; color: #1a6b30; }
                .wl-stock-badge.out { background: #fde8e8; color: #9b2226; }

                /* Remove btn on image */
                .wl-remove-img-btn {
                    position: absolute; top: 10px; right: 10px;
                    width: 32px; height: 32px; border-radius: 50%;
                    border: none; background: rgba(255,255,255,0.92);
                    backdrop-filter: blur(4px);
                    color: #dc2626; font-size: 0.85rem;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: all 0.2s;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .wl-remove-img-btn:hover {
                    background: #dc2626; color: #fff; transform: scale(1.1);
                }
                .wl-remove-img-btn:disabled { opacity: 0.5; cursor: wait; }

                /* Body */
                .wl-card-body {
                    padding: 1.1rem 1.2rem 1.3rem;
                    display: flex; flex-direction: column; flex: 1; gap: 0.35rem;
                }
                .wl-card-category {
                    font-size: 0.65rem; font-weight: 600;
                    letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent);
                }
                .wl-card-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.05rem; font-weight: 600; color: var(--text);
                    text-decoration: none; line-height: 1.3;
                    transition: color 0.2s; display: block;
                }
                .wl-card-name:hover { color: var(--accent); }
                .wl-card-desc {
                    font-size: 0.8rem; color: var(--text-muted);
                    line-height: 1.5;
                    display: -webkit-box;
                    -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
                }
                .wl-stars { color: #f59e0b; font-size: 0.78rem; letter-spacing: 1px; }
                .wl-stars-count { font-size: 0.72rem; color: var(--text-muted); margin-left: 4px; }

                /* Footer */
                .wl-card-footer {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-top: auto; padding-top: 0.85rem;
                    border-top: 1px solid var(--border);
                    gap: 0.5rem;
                }
                .wl-price {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.2rem; font-weight: 700; color: var(--text);
                }
                .wl-btn-cart {
                    flex: 1;
                    padding: 0.5rem 0.85rem;
                    background: var(--text); color: #fff;
                    border: none; border-radius: var(--radius-sm);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.78rem; font-weight: 600;
                    cursor: pointer; transition: background 0.2s, transform 0.15s;
                    display: flex; align-items: center; justify-content: center; gap: 5px;
                }
                .wl-btn-cart:hover:not(:disabled) {
                    background: var(--accent); color: #0d0d0d;
                    transform: translateY(-1px);
                }
                .wl-btn-cart:disabled { background: #ddd; color: #999; cursor: not-allowed; }

                /* Empty state */
                .wl-empty {
                    text-align: center; padding: 5rem 2rem;
                    background: var(--surface);
                    border: 1px dashed var(--border);
                    border-radius: var(--radius);
                }
                .wl-empty-heart {
                    font-size: 3rem; opacity: 0.2; margin-bottom: 1rem;
                }
                .wl-empty-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.3rem; color: var(--text); margin-bottom: 0.5rem;
                }
                .wl-empty-text { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem; }
                .wl-empty-btn {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 0.65rem 1.5rem;
                    background: #0d0d0d; color: #fff;
                    border-radius: var(--radius-sm); text-decoration: none;
                    font-size: 0.85rem; font-weight: 600;
                    transition: background 0.2s;
                }
                .wl-empty-btn:hover { background: var(--accent); color: #0d0d0d; }

                /* Loading */
                .wl-loading {
                    text-align: center; padding: 4rem;
                    color: var(--text-muted); font-size: 0.9rem;
                }

                @media (max-width: 768px) {
                    .wl-container { padding: 1.25rem 1rem; }
                    .wl-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
                }
                @media (max-width: 480px) {
                    .wl-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            {/* Toast notification */}
            {toast.text && (
                <div className={`wl-toast ${toast.type}`}>{toast.text}</div>
            )}

            <div className="wl-wrap">

                {/* Header */}
                <div className="wl-header">
                    <p className="wl-eyebrow">Your Saved Items</p>
                    <h1 className="wl-title">My <span>Wishlist</span></h1>
                    {!loading && wishlist.length > 0 && (
                        <p className="wl-subtitle">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
                    )}
                </div>

                <div className="wl-container">

                    {loading ? (
                        <div className="wl-loading">Loading your wishlist...</div>
                    ) : wishlist.length === 0 ? (
                        <div className="wl-empty">
                            <div className="wl-empty-heart">♡</div>
                            <h2 className="wl-empty-title">Your wishlist is empty</h2>
                            <p className="wl-empty-text">Save items you love and find them here anytime.</p>
                            <Link to="/" className="wl-empty-btn">Start Shopping →</Link>
                        </div>
                    ) : (
                        <>
                            <div className="wl-section-head">
                                <h2 className="wl-section-title">
                                    <span>Saved Items</span>
                                    Wishlist
                                </h2>
                                <p className="wl-count">
                                    <strong>{wishlist.length}</strong> item{wishlist.length !== 1 ? 's' : ''}
                                </p>
                            </div>

                            <div className="wl-grid">
                                {wishlist.map(product => {
                                    const imgUrl = getImageUrl(product.image);
                                    return (
                                        <div key={product._id} className="wl-card">

                                            {/* Image */}
                                            <div className="wl-card-img-wrap">
                                                {imgUrl ? (
                                                    <img
                                                        src={imgUrl}
                                                        alt={product.name}
                                                        className="wl-card-img"
                                                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                                    />
                                                ) : null}
                                                <div className="wl-img-placeholder" style={{ display: imgUrl ? 'none' : 'flex' }}>📦</div>

                                                <span className={`wl-stock-badge ${product.stock === 0 ? 'out' : 'in'}`}>
                                                    {product.stock === 0 ? 'Out of Stock' : 'In Stock'}
                                                </span>

                                                <button
                                                    className="wl-remove-img-btn"
                                                    onClick={() => removeFromWishlist(product._id)}
                                                    disabled={removingId === product._id}
                                                    title="Remove from wishlist"
                                                >
                                                    {removingId === product._id ? '…' : '✕'}
                                                </button>
                                            </div>

                                            {/* Body */}
                                            <div className="wl-card-body">
                                                {product.category?.name && (
                                                    <span className="wl-card-category">{product.category.name}</span>
                                                )}

                                                <Link to={`/product/${product._id}`} className="wl-card-name">
                                                    {product.name}
                                                </Link>

                                                {product.description && (
                                                    <p className="wl-card-desc">{product.description}</p>
                                                )}

                                                {product.rating > 0 && (
                                                    <div>
                                                        <span className="wl-stars">
                                                            {'★'.repeat(Math.round(product.rating))}
                                                            {'☆'.repeat(5 - Math.round(product.rating))}
                                                        </span>
                                                        <span className="wl-stars-count">({product.numReviews})</span>
                                                    </div>
                                                )}

                                                <div className="wl-card-footer">
                                                    <span className="wl-price">${product.price}</span>
                                                    <button
                                                        className="wl-btn-cart"
                                                        onClick={() => addToCart(product)}
                                                        disabled={product.stock === 0}
                                                    >
                                                        🛒 {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default WishlistScreen;