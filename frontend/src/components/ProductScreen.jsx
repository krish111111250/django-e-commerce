import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axios';

function ProductScreen() {
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState('');
    const [activeTab, setActiveTab] = useState('reviews');

    const { id } = useParams();
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchProduct(); }, [id]);

    const fetchProduct = async () => {
        try {
            const { data } = await axiosInstance.get(`/api/products/${id}/`);
            setProduct(data);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    const getImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith('blob:') || img.startsWith('http')) return img;
        return `https://django-e-commerce-production-f7fc.up.railway.app${img}`;
    };

    const addToCartHandler = () => {
        if (!userInfo) { navigate('/login'); return; }
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (cartItems.find(x => x._id === product._id)) { alert("Already in cart!"); return; }
        cartItems.push({ ...product, qty: 1 });
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        if (window.confirm("Added to Cart! Go to Cart?")) navigate('/cart');
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setReviewError('');
        try {
            await axiosInstance.post(`/api/products/${id}/reviews/`, { rating, comment });
            setRating(0); setComment('');
            fetchProduct();
        } catch (error) {
            setReviewError(error.response?.data?.detail || error.message);
        }
    };

    const updateReviewHandler = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/api/products/${id}/reviews/update/`, { rating: editRating, comment: editComment });
            setEditMode(false);
            fetchProduct();
        } catch (error) {
            alert(error.response?.data?.detail || 'Error updating review');
        }
    };

    const deleteReviewHandler = async () => {
        if (window.confirm('Delete your review?')) {
            try {
                await axiosInstance.delete(`/api/products/${id}/reviews/delete/`);
                fetchProduct();
            } catch (error) {
                alert(error.response?.data?.detail || 'Error deleting review');
            }
        }
    };

    if (!product) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.3 }}>⟳</div>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>Loading product...</p>
            </div>
        </div>
    );

    const userReview = userInfo && product.reviews
        ? product.reviews.find(r => r.name === userInfo.username || r.name === userInfo.email)
        : null;

    const imgUrl = getImageUrl(product.image);

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
                    --shadow: 0 2px 20px rgba(0,0,0,0.07);
                    --shadow-lg: 0 16px 48px rgba(0,0,0,0.12);
                }

                .ps-wrap {
                    min-height: 100vh;
                    background: var(--surface2);
                    font-family: 'DM Sans', sans-serif;
                    padding-bottom: 4rem;
                }

                /* ── BACK BUTTON ── */
                .ps-back {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 0.5rem 1rem;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 6px;
                    color: var(--text-muted);
                    font-size: 0.82rem;
                    font-weight: 500;
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.2s;
                    margin: 1.5rem 0 1.25rem;
                }
                .ps-back:hover { color: var(--text); border-color: var(--text); background: var(--surface); }

                /* ── PRODUCT LAYOUT ── */
                .ps-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }
                .ps-product-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                    align-items: start;
                }

                /* ── IMAGE ── */
                .ps-img-wrap {
                    position: relative;
                    border-radius: var(--radius);
                    overflow: hidden;
                    background: var(--surface3);
                    aspect-ratio: 1;
                    box-shadow: var(--shadow-lg);
                }
                .ps-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .ps-img-wrap:hover .ps-img { transform: scale(1.03); }
                .ps-img-placeholder {
                    width: 100%; height: 100%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 5rem; color: var(--border);
                }
                .ps-img-badge {
                    position: absolute;
                    top: 14px; left: 14px;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.68rem;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }
                .ps-img-badge.in { background: #d4edda; color: #1a6b30; }
                .ps-img-badge.out { background: #fde8e8; color: #9b2226; }

                /* ── PRODUCT INFO ── */
                .ps-info { display: flex; flex-direction: column; gap: 1rem; }
                .ps-category {
                    font-size: 0.68rem;
                    font-weight: 600;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: var(--accent);
                }
                .ps-name {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.6rem, 3vw, 2.2rem);
                    font-weight: 700;
                    color: var(--text);
                    line-height: 1.2;
                    margin: 0;
                }
                .ps-rating-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .ps-stars { color: #f59e0b; font-size: 1rem; letter-spacing: 2px; }
                .ps-rating-num { font-size: 0.85rem; font-weight: 600; color: var(--text); }
                .ps-rating-count { font-size: 0.82rem; color: var(--text-muted); }
                .ps-desc {
                    font-size: 0.92rem;
                    color: var(--text-muted);
                    line-height: 1.7;
                    border-top: 1px solid var(--border);
                    padding-top: 1rem;
                }

                /* Price box */
                .ps-price-box {
                    background: var(--surface3);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    padding: 1.1rem 1.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                }
                .ps-price {
                    font-family: 'Playfair Display', serif;
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text);
                }
                .ps-stock-text {
                    font-size: 0.8rem;
                    font-weight: 600;
                    padding: 4px 12px;
                    border-radius: 20px;
                }
                .ps-stock-text.in { background: #d4edda; color: #1a6b30; }
                .ps-stock-text.out { background: #fde8e8; color: #9b2226; }

                /* CTA buttons */
                .ps-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
                .ps-btn-cart {
                    flex: 1;
                    min-width: 160px;
                    padding: 0.85rem 1.5rem;
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
                .ps-btn-cart:hover:not(:disabled) {
                    background: var(--accent);
                    color: #0d0d0d;
                    transform: translateY(-2px);
                }
                .ps-btn-cart:disabled {
                    background: #ddd; color: #999; cursor: not-allowed;
                }
                .ps-btn-back {
                    padding: 0.85rem 1.25rem;
                    background: var(--surface);
                    color: var(--text);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .ps-btn-back:hover { border-color: var(--text); }

                /* ── REVIEWS SECTION ── */
                .ps-reviews-section {
                    margin-top: 3.5rem;
                    border-top: 1px solid var(--border);
                    padding-top: 2.5rem;
                }
                .ps-reviews-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.75rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .ps-reviews-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text);
                }
                .ps-reviews-title span {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    font-weight: 400;
                    margin-left: 8px;
                }
                .ps-reviews-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem 3rem;
                    align-items: start;
                }

                /* Review card */
                .ps-review-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    padding: 1.1rem 1.25rem;
                    transition: box-shadow 0.2s;
                }
                .ps-review-card:hover { box-shadow: var(--shadow); }
                .ps-review-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.5rem;
                }
                .ps-reviewer-name {
                    font-weight: 600;
                    font-size: 0.88rem;
                    color: var(--text);
                }
                .ps-review-actions { display: flex; gap: 6px; }
                .ps-review-btn {
                    padding: 3px 10px;
                    border-radius: 4px;
                    font-size: 0.72rem;
                    font-weight: 600;
                    cursor: pointer;
                    border: 1px solid;
                    transition: all 0.15s;
                    font-family: 'DM Sans', sans-serif;
                }
                .ps-review-btn.edit {
                    border-color: var(--accent);
                    color: #9a7a45;
                    background: var(--accent-dim);
                }
                .ps-review-btn.edit:hover { background: var(--accent); color: #0d0d0d; }
                .ps-review-btn.del {
                    border-color: #fca5a5;
                    color: #dc2626;
                    background: #fef2f2;
                }
                .ps-review-btn.del:hover { background: #dc2626; color: #fff; }

                .ps-review-stars { color: #f59e0b; font-size: 0.85rem; letter-spacing: 1px; }
                .ps-review-date { font-size: 0.72rem; color: var(--text-muted); margin: 3px 0 6px; }
                .ps-review-comment { font-size: 0.85rem; color: #444; line-height: 1.55; }

                /* Edit form inside review */
                .ps-edit-form {
                    margin-top: 0.75rem;
                    padding: 0.85rem;
                    background: var(--surface2);
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                }
                .ps-edit-form h6 {
                    font-size: 0.78rem;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    margin-bottom: 0.6rem;
                }

                /* No reviews */
                .ps-no-reviews {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 2.5rem;
                    background: var(--surface);
                    border: 1px dashed var(--border);
                    border-radius: var(--radius-sm);
                    color: var(--text-muted);
                    font-size: 0.88rem;
                }

                /* Write review form */
                .ps-write-review {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    padding: 1.5rem;
                }
                .ps-write-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--text);
                    margin-bottom: 1rem;
                }
                .ps-form-group { margin-bottom: 1rem; }
                .ps-form-label {
                    display: block;
                    font-size: 0.72rem;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    margin-bottom: 5px;
                }
                .ps-form-select, .ps-form-textarea {
                    width: 100%;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    padding: 0.55rem 0.85rem;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.875rem;
                    color: var(--text);
                    background: var(--surface2);
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    resize: vertical;
                }
                .ps-form-select:focus, .ps-form-textarea:focus {
                    border-color: var(--accent);
                    box-shadow: 0 0 0 3px rgba(200,169,110,0.12);
                    background: var(--surface);
                }
                .ps-form-select {
                    appearance: none;
                    -webkit-appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 0.75rem center;
                    padding-right: 2.2rem;
                }

                /* Buttons */
                .ps-btn-submit {
                    padding: 0.6rem 1.5rem;
                    background: #0d0d0d;
                    color: #fff;
                    border: none;
                    border-radius: var(--radius-sm);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.82rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background 0.2s;
                    letter-spacing: 0.04em;
                }
                .ps-btn-submit:hover { background: var(--accent); color: #0d0d0d; }
                .ps-btn-save {
                    padding: 0.45rem 1rem;
                    background: #16a34a;
                    color: #fff;
                    border: none;
                    border-radius: 5px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    margin-right: 6px;
                }
                .ps-btn-cancel {
                    padding: 0.45rem 1rem;
                    background: var(--surface2);
                    color: var(--text-muted);
                    border: 1px solid var(--border);
                    border-radius: 5px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.78rem;
                    font-weight: 500;
                    cursor: pointer;
                }

                .ps-alert {
                    padding: 0.65rem 1rem;
                    border-radius: var(--radius-sm);
                    font-size: 0.85rem;
                    margin-bottom: 0.85rem;
                }
                .ps-alert.danger { background: #fef2f2; color: #dc2626; border: 1px solid #fca5a5; }
                .ps-alert.warning { background: #fffbeb; color: #92400e; border: 1px solid #fcd34d; }
                .ps-alert.warning a { color: var(--accent); font-weight: 600; }

                /* ── RESPONSIVE ── */
                @media (max-width: 900px) {
                    .ps-product-grid { grid-template-columns: 1fr; gap: 2rem; }
                    .ps-img-wrap { max-height: 380px; aspect-ratio: auto; }
                    .ps-reviews-grid { grid-template-columns: 1fr; }
                }
                @media (max-width: 600px) {
                    .ps-container { padding: 0 1rem; }
                    .ps-name { font-size: 1.5rem; }
                    .ps-reviews-header { flex-direction: column; align-items: flex-start; }
                }
            `}</style>

            <div className="ps-wrap">
                <div className="ps-container">

                    {/* Back button */}
                    <button className="ps-back" onClick={() => navigate(-1)}>
                        ← Back
                    </button>

                    {/* Product Grid */}
                    <div className="ps-product-grid">

                        {/* Left — Image */}
                        <div className="ps-img-wrap">
                            {imgUrl ? (
                                <img
                                    src={imgUrl}
                                    alt={product.name}
                                    className="ps-img"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div className="ps-img-placeholder" style={{ display: imgUrl ? 'none' : 'flex' }}>📦</div>
                            <span className={`ps-img-badge ${product.stock > 0 ? 'in' : 'out'}`}>
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Right — Info */}
                        <div className="ps-info">
                            {product.category?.name && (
                                <p className="ps-category">{product.category.name}</p>
                            )}

                            <h1 className="ps-name">{product.name}</h1>

                            {/* Rating */}
                            <div className="ps-rating-row">
                                <span className="ps-stars">
                                    {'★'.repeat(Math.round(product.rating || 0))}
                                    {'☆'.repeat(5 - Math.round(product.rating || 0))}
                                </span>
                                <span className="ps-rating-num">{Number(product.rating || 0).toFixed(1)}</span>
                                <span className="ps-rating-count">({product.numReviews} reviews)</span>
                            </div>

                            {/* Description */}
                            {product.description && (
                                <p className="ps-desc">{product.description}</p>
                            )}

                            {/* Price box */}
                            <div className="ps-price-box">
                                <span className="ps-price">${product.price}</span>
                                <span className={`ps-stock-text ${product.stock > 0 ? 'in' : 'out'}`}>
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Unavailable'}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="ps-actions">
                                <button
                                    className="ps-btn-cart"
                                    disabled={product.stock === 0}
                                    onClick={addToCartHandler}
                                >
                                    🛒 {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                                <button className="ps-btn-back" onClick={() => navigate('/')}>
                                    🏠 Home
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── REVIEWS ── */}
                    <div className="ps-reviews-section">
                        <div className="ps-reviews-header">
                            <h2 className="ps-reviews-title">
                                Customer Reviews
                                <span>{product.numReviews} reviews</span>
                            </h2>
                        </div>

                        <div className="ps-reviews-grid">

                            {/* Left — review list */}
                            <div>
                                {!product.reviews || product.reviews.length === 0 ? (
                                    <div className="ps-no-reviews">
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                                        No reviews yet. Be the first to review!
                                    </div>
                                ) : (
                                    product.reviews.map((review) => {
                                        const isOwnReview = userInfo && (
                                            review.name === userInfo.username ||
                                            review.name === userInfo.email
                                        );
                                        return (
                                            <div key={review._id || review.id} className="ps-review-card" style={{ marginBottom: '1rem' }}>
                                                <div className="ps-review-top">
                                                    <span className="ps-reviewer-name">{review.name}</span>
                                                    {isOwnReview && (
                                                        <div className="ps-review-actions">
                                                            <button className="ps-review-btn edit" onClick={() => { setEditMode(true); setEditRating(review.rating); setEditComment(review.comment); }}>
                                                                ✏️ Edit
                                                            </button>
                                                            <button className="ps-review-btn del" onClick={deleteReviewHandler}>
                                                                🗑️ Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ps-review-stars">
                                                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                                </div>
                                                <p className="ps-review-date">
                                                    {review.createdAt?.substring(0, 10)}
                                                </p>
                                                <p className="ps-review-comment">{review.comment}</p>

                                                {/* Edit form */}
                                                {isOwnReview && editMode && (
                                                    <div className="ps-edit-form">
                                                        <h6>Edit Review</h6>
                                                        <form onSubmit={updateReviewHandler}>
                                                            <div className="ps-form-group">
                                                                <label className="ps-form-label">Rating</label>
                                                                <select className="ps-form-select" value={editRating} onChange={(e) => setEditRating(e.target.value)}>
                                                                    <option value="1">1 - Poor</option>
                                                                    <option value="2">2 - Fair</option>
                                                                    <option value="3">3 - Good</option>
                                                                    <option value="4">4 - Very Good</option>
                                                                    <option value="5">5 - Excellent</option>
                                                                </select>
                                                            </div>
                                                            <div className="ps-form-group">
                                                                <label className="ps-form-label">Comment</label>
                                                                <textarea className="ps-form-textarea" rows="2" value={editComment} onChange={(e) => setEditComment(e.target.value)} />
                                                            </div>
                                                            <button type="submit" className="ps-btn-save">Save</button>
                                                            <button type="button" className="ps-btn-cancel" onClick={() => setEditMode(false)}>Cancel</button>
                                                        </form>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Right — write review form */}
                            <div>
                                {userInfo && !userReview ? (
                                    <div className="ps-write-review">
                                        <h3 className="ps-write-title">Write a Review</h3>
                                        {reviewError && (
                                            <div className="ps-alert danger">{reviewError}</div>
                                        )}
                                        <form onSubmit={submitHandler}>
                                            <div className="ps-form-group">
                                                <label className="ps-form-label">Your Rating</label>
                                                <select className="ps-form-select" value={rating} onChange={(e) => setRating(e.target.value)}>
                                                    <option value="">Select rating...</option>
                                                    <option value="1">⭐ 1 — Poor</option>
                                                    <option value="2">⭐⭐ 2 — Fair</option>
                                                    <option value="3">⭐⭐⭐ 3 — Good</option>
                                                    <option value="4">⭐⭐⭐⭐ 4 — Very Good</option>
                                                    <option value="5">⭐⭐⭐⭐⭐ 5 — Excellent</option>
                                                </select>
                                            </div>
                                            <div className="ps-form-group">
                                                <label className="ps-form-label">Your Comment</label>
                                                <textarea
                                                    className="ps-form-textarea"
                                                    rows="4"
                                                    placeholder="Share your experience..."
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                />
                                            </div>
                                            <button type="submit" className="ps-btn-submit">
                                                Submit Review
                                            </button>
                                        </form>
                                    </div>
                                ) : !userInfo ? (
                                    <div className="ps-alert warning">
                                        Please <Link to="/login">sign in</Link> to write a review
                                    </div>
                                ) : (
                                    <div className="ps-write-review" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                                        <p style={{ fontSize: '0.88rem' }}>You've already reviewed this product.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default ProductScreen;