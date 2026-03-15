import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from './axios';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import ProfileScreen from './screens/ProfileScreen';
import ProductScreen from './components/ProductScreen';
import Shipping from './components/Shipping';
import Payment from './components/Payment';
import PlaceOrder from './components/PlaceOrder';
import OrderScreen from './components/OrderScreen';
import UserListScreen from './screens/UserListScreen';
import ProductListScreen from './screens/ProductListScreen';
import 'bootstrap/dist/css/bootstrap.min.css';
import OrderListScreen from './screens/OrderListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import WishlistScreen from './screens/WishlistScreen';
import DashboardScreen from './screens/DashboardScreen';

function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [wishlistLoading, setWishlistLoading] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const keyword = location.search;

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data } = await axiosInstance.get('/api/categories/');
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const params = new URLSearchParams();
        if (keyword) {
          const kw = new URLSearchParams(keyword).get('keyword');
          if (kw) params.append('keyword', kw);
        }
        if (selectedCategory) params.append('category', selectedCategory);
        if (minPrice) params.append('min_price', minPrice);
        if (maxPrice) params.append('max_price', maxPrice);
        if (sortBy) params.append('sort', sortBy);
        const queryString = params.toString();
        const url = `/api/products/${queryString ? '?' + queryString : ''}`;
        const { data } = await axiosInstance.get(url);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, [keyword, selectedCategory, minPrice, maxPrice, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
  };

  const isFiltered = selectedCategory || minPrice || maxPrice || sortBy;

  const addToCartHandler = (product) => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      alert("Please Login to add items to cart.");
      navigate('/login');
      return;
    }
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existItem = cartItems.find((x) => x._id === product._id);
    if (existItem) {
      alert("Item already in cart");
      return;
    }
    cartItems.push({ ...product, qty: 1 });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    if (window.confirm(`${product.name} added! Go to Cart?`)) {
      navigate('/cart');
    }
  };

  const addToWishlistHandler = async (productId) => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      alert("Please login to add to wishlist");
      navigate('/login');
      return;
    }
    setWishlistLoading(prev => ({ ...prev, [productId]: true }));
    try {
      await axiosInstance.post(`/api/wishlist/add/${productId}/`);
      alert('Added to Wishlist ❤️');
    } catch (error) {
      alert('Already in Wishlist!');
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
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
          --accent: #c8a96e;
          --accent-light: #e8d5b0;
          --accent-dim: rgba(200,169,110,0.12);
          --text: #1a1a1a;
          --text-muted: #777;
          --border: #e8e4df;
          --surface: #ffffff;
          --surface2: #f8f6f3;
          --surface3: #f2efe9;
          --shadow: 0 2px 16px rgba(0,0,0,0.07);
          --shadow-hover: 0 12px 40px rgba(0,0,0,0.13);
          --radius: 12px;
          --radius-sm: 7px;
        }

        .home-wrap {
          min-height: 100vh;
          background: var(--surface2);
          font-family: 'DM Sans', sans-serif;
        }

        /* ── HERO ── */
        .hero {
          background: linear-gradient(135deg, #0d0d0d 0%, #1a1612 50%, #0d0b09 100%);
          padding: 4rem 2rem 3.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,169,110,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-eyebrow {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.9rem;
          opacity: 0.85;
        }
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.85rem;
          line-height: 1.15;
        }
        .hero-title span { color: var(--accent); }
        .hero-subtitle {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.45);
          font-weight: 300;
          max-width: 420px;
          margin: 0 auto 1.75rem;
          line-height: 1.6;
        }
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--accent);
          color: #0d0d0d;
          padding: 0.7rem 1.8rem;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .hero-cta:hover {
          background: var(--accent-light);
          transform: translateY(-1px);
          color: #0d0d0d;
        }
        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 2.5rem;
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(200,169,110,0.15);
        }
        .hero-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: var(--accent);
          font-weight: 700;
        }
        .hero-stat-label {
          font-size: 0.68rem;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-top: 2px;
        }

        /* ── PAGE BODY ── */
        .page-body {
          max-width: 1320px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 4rem;
        }

        /* ── SECTION HEADER ── */
        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.65rem;
          font-weight: 700;
          color: var(--text);
          line-height: 1.2;
        }
        .section-title span {
          display: block;
          font-size: 0.72rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.3rem;
        }
        .product-count {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 400;
        }
        .product-count strong { color: var(--text); }
        .filtered-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: var(--accent-dim);
          color: #9a7a45;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 20px;
          margin-left: 6px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* ── FILTER BAR ── */
        .filter-bar {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.25rem 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: flex-end;
          box-shadow: var(--shadow);
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
          flex: 1;
          min-width: 130px;
        }
        .filter-label {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .filter-select, .filter-input {
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 0.52rem 0.85rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          color: var(--text);
          background: var(--surface);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
          -webkit-appearance: none;
        }
        .filter-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          padding-right: 2.2rem;
        }
        .filter-select:focus, .filter-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(200,169,110,0.12);
        }
        .filter-input::placeholder { color: #bbb; }
        .btn-clear {
          padding: 0.52rem 1.2rem;
          border: 1px solid var(--border);
          background: var(--surface2);
          color: var(--text-muted);
          border-radius: var(--radius-sm);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .btn-clear:hover {
          border-color: #c0392b;
          color: #c0392b;
          background: #fff5f5;
        }

        /* ── PRODUCT GRID ── */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        /* ── PRODUCT CARD ── */
        .p-card {
          background: var(--surface);
          border-radius: var(--radius);
          border: 1px solid var(--border);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .p-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-hover);
        }

        /* Image area */
        .p-card-img-wrap {
          position: relative;
          background: var(--surface3);
          aspect-ratio: 4/3;
          overflow: hidden;
        }
        .p-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .p-card:hover .p-card-img { transform: scale(1.04); }
        .p-card-img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: var(--border);
          background: linear-gradient(135deg, #f5f3f0, #ece9e3);
        }

        /* Stock badge on image */
        .p-stock-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .p-stock-badge.in { background: #d4edda; color: #1a6b30; }
        .p-stock-badge.out { background: #fde8e8; color: #9b2226; }

        /* Wishlist btn on image */
        .p-wish-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 34px; height: 34px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(4px);
          color: #ccc;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .p-wish-btn:hover {
          background: #fff;
          color: #e74c3c;
          transform: scale(1.1);
        }
        .p-wish-btn:disabled { opacity: 0.6; cursor: wait; }

        /* Card body */
        .p-card-body {
          padding: 1.1rem 1.2rem 1.3rem;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 0.35rem;
        }
        .p-card-category {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--accent);
        }
        .p-card-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text);
          text-decoration: none;
          line-height: 1.3;
          transition: color 0.2s;
          display: block;
        }
        .p-card-name:hover { color: var(--accent); }
        .p-card-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-top: 1px;
        }
        .p-card-stars {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 3px;
        }
        .stars { color: #f59e0b; font-size: 0.78rem; letter-spacing: 1px; }
        .stars-count { font-size: 0.72rem; color: var(--text-muted); }

        /* Price row */
        .p-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 0.85rem;
          border-top: 1px solid var(--border);
        }
        .p-price {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text);
        }
        .btn-cart {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0.48rem 1.1rem;
          background: var(--text);
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          letter-spacing: 0.03em;
        }
        .btn-cart:hover {
          background: var(--accent);
          color: #0d0d0d;
          transform: translateY(-1px);
        }
        .btn-cart:disabled {
          background: #ddd;
          color: #999;
          cursor: not-allowed;
          transform: none;
        }

        /* ── EMPTY STATE ── */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          background: var(--surface);
          border: 1px dashed var(--border);
          border-radius: var(--radius);
        }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.4; }
        .empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          color: var(--text);
          margin-bottom: 0.5rem;
        }
        .empty-text { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.25rem; }
        .btn-reset {
          padding: 0.5rem 1.3rem;
          background: var(--accent);
          color: #0d0d0d;
          border: none;
          border-radius: var(--radius-sm);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-reset:hover { background: var(--accent-light); }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .hero { padding: 3rem 1.25rem 2.5rem; }
          .hero-stats { gap: 1.5rem; }
          .filter-bar { padding: 1rem; gap: 0.75rem; }
          .filter-group { min-width: 140px; }
          .page-body { padding: 1.75rem 1rem 3rem; }
          .products-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
          .section-header { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          .products-grid { grid-template-columns: 1fr; }
          .hero-stats { display: none; }
          .filter-group { min-width: 100%; }
        }
      `}</style>

      <div className="home-wrap">

        {/* ── HERO SECTION ── */}
        <section className="hero">
          <p className="hero-eyebrow">Welcome to SNS Store</p>
          <h1 className="hero-title">
            Discover <span>Premium</span><br />Products
          </h1>
          <p className="hero-subtitle">
            Curated selection of top-quality products delivered to your door.
          </p>
          <a href="#products" className="hero-cta">
            Shop Now →
          </a>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-num">{products.length}+</div>
              <div className="hero-stat-label">Products</div>
            </div>
            <div>
              <div className="hero-stat-num">{categories.length}+</div>
              <div className="hero-stat-label">Categories</div>
            </div>
            <div>
              <div className="hero-stat-num">100%</div>
              <div className="hero-stat-label">Authentic</div>
            </div>
            <div>
              <div className="hero-stat-num">Fast</div>
              <div className="hero-stat-label">Delivery</div>
            </div>
          </div>
        </section>

        {/* ── PAGE BODY ── */}
        <div className="page-body" id="products">

          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Min Price</label>
              <input
                type="number"
                className="filter-input"
                placeholder="$ 0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Max Price</label>
              <input
                type="number"
                className="filter-input"
                placeholder="$ 9999"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Newest First</option>
                <option value="price_low">Price: Low → High</option>
                <option value="price_high">Price: High → Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>

            {isFiltered && (
              <button className="btn-clear" onClick={clearFilters}>
                ✕ Clear
              </button>
            )}
          </div>

          {/* Section Header */}
          <div className="section-header">
            <h2 className="section-title">
              <span>Our Collection</span>
              Latest Products
            </h2>
            <p className="product-count">
              <strong>{products.length}</strong> products
              {isFiltered && <span className="filtered-tag">✦ Filtered</span>}
            </p>
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3 className="empty-title">No products found</h3>
                <p className="empty-text">Try adjusting your filters or search terms.</p>
                <button className="btn-reset" onClick={clearFilters}>Reset Filters</button>
              </div>
            ) : (
              products.map((product) => (
                <div key={product._id} className="p-card">

                  {/* Image */}
                  <div className="p-card-img-wrap">
                    {getImageUrl(product.image) ? (
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="p-card-img"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <div className="p-card-img-placeholder" style={{ display: getImageUrl(product.image) ? 'none' : 'flex' }}>
                      📦
                    </div>

                    {/* Stock badge */}
                    <span className={`p-stock-badge ${product.stock === 0 ? 'out' : 'in'}`}>
                      {product.stock === 0 ? 'Out of Stock' : 'In Stock'}
                    </span>

                    {/* Wishlist button */}
                    <button
                      className="p-wish-btn"
                      onClick={() => addToWishlistHandler(product._id)}
                      disabled={wishlistLoading[product._id]}
                      title="Add to Wishlist"
                    >
                      {wishlistLoading[product._id] ? '…' : '♡'}
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-card-body">
                    {product.category?.name && (
                      <span className="p-card-category">{product.category.name}</span>
                    )}

                    <Link to={`/product/${product._id}`} className="p-card-name">
                      {product.name}
                    </Link>

                    {product.description && (
                      <p className="p-card-desc">{product.description}</p>
                    )}

                    {product.rating > 0 && (
                      <div className="p-card-stars">
                        <span className="stars">
                          {'★'.repeat(Math.round(product.rating))}
                          {'☆'.repeat(5 - Math.round(product.rating))}
                        </span>
                        <span className="stars-count">({product.numReviews})</span>
                      </div>
                    )}

                    <div className="p-card-footer">
                      <span className="p-price">${product.price}</span>
                      <button
                        className="btn-cart"
                        onClick={() => addToCartHandler(product)}
                        disabled={product.stock === 0}
                      >
                        🛒 {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path="/order/:id" element={<OrderScreen />} />
          <Route path="/admin/userlist" element={<UserListScreen />} />
          <Route path="/admin/productlist" element={<ProductListScreen />} />
          <Route path="/admin/orderlist" element={<OrderListScreen />} />
          <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
          <Route path="/wishlist" element={<WishlistScreen />} />
          <Route path="/admin/dashboard" element={<DashboardScreen />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;