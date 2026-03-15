import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);
  const [adminDropOpen, setAdminDropOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const userName = userInfo?.username || userInfo?.name || userInfo?.email || 'User';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setUserDropOpen(false);
        setAdminDropOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('cartItems');
    navigate('/login');
    window.location.reload();
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate('/');
    }
    setMenuOpen(false);
    setSearchOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        :root {
          --primary: #0d0d0d;
          --primary-soft: #1a1a1a;
          --accent: #c8a96e;
          --accent-light: #e8d5b0;
          --accent-dim: rgba(200,169,110,0.15);
          --accent-border: rgba(200,169,110,0.25);
          --white: #ffffff;
          --white-70: rgba(255,255,255,0.7);
          --white-40: rgba(255,255,255,0.4);
          --white-10: rgba(255,255,255,0.08);
          --danger: #ff6b6b;
          --surface2: #f8f6f3;
          --header-h: 70px;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--surface2);
          padding-top: var(--header-h);
        }

        /* ─── HEADER SHELL ─── */
        .sns-header {
          position: fixed;
          inset: 0 0 auto 0;
          z-index: 1000;
          height: var(--header-h);
          background: var(--primary);
          border-bottom: 1px solid var(--accent-border);
          transition: background 0.35s, box-shadow 0.35s;
        }
        .sns-header.scrolled {
          background: rgba(13,13,13,0.96);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }

        /* ─── INNER LAYOUT ─── */
        .h-inner {
          max-width: 1440px;
          margin: 0 auto;
          height: 100%;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        /* ─── LOGO ─── */
        .h-logo {
          text-decoration: none;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          line-height: 1;
          gap: 2px;
        }
        .h-logo-main {
          font-family: 'Playfair Display', serif;
          font-size: 1.45rem;
          font-weight: 700;
          color: var(--accent);
          letter-spacing: 0.04em;
        }
        .h-logo-sub {
          font-size: 0.5rem;
          font-weight: 500;
          color: rgba(200,169,110,0.45);
          letter-spacing: 0.35em;
          text-transform: uppercase;
        }

        /* ─── SEARCH (desktop) ─── */
        .h-search {
          flex: 1;
          max-width: 460px;
          display: flex;
          align-items: stretch;
          border: 1px solid var(--accent-border);
          border-radius: 6px;
          overflow: hidden;
          background: var(--white-10);
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .h-search:focus-within {
          border-color: var(--accent);
          background: rgba(255,255,255,0.11);
          box-shadow: 0 0 0 3px rgba(200,169,110,0.12);
        }
        .h-search-input {
          flex: 1;
          min-width: 0;
          border: none;
          background: transparent;
          padding: 0.58rem 1rem;
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          outline: none;
        }
        .h-search-input::placeholder { color: var(--white-40); }
        .h-search-btn {
          flex-shrink: 0;
          border: none;
          background: var(--accent);
          color: var(--primary);
          padding: 0 1.15rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: background 0.2s;
        }
        .h-search-btn:hover { background: var(--accent-light); }

        /* ─── NAV ─── */
        .h-nav {
          display: flex;
          align-items: center;
          gap: 2px;
          margin-left: auto;
          flex-shrink: 0;
        }
        .h-nav-link {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0.45rem 0.8rem;
          color: var(--white-70);
          text-decoration: none;
          font-size: 0.84rem;
          font-weight: 500;
          border-radius: 5px;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .h-nav-link:hover { color: var(--accent); background: var(--accent-dim); }

        /* ─── NAV DIVIDER ─── */
        .h-divider {
          width: 1px; height: 18px;
          background: rgba(255,255,255,0.12);
          margin: 0 4px;
          flex-shrink: 0;
        }

        /* ─── AUTH BUTTONS ─── */
        .h-btn-login, .h-btn-register {
          padding: 0.42rem 1rem;
          border-radius: 5px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .h-btn-login {
          border: 1px solid var(--accent-border);
          color: var(--accent);
          background: transparent;
        }
        .h-btn-login:hover { background: var(--accent-dim); border-color: var(--accent); }
        .h-btn-register {
          border: none;
          background: var(--accent);
          color: var(--primary);
          margin-left: 4px;
        }
        .h-btn-register:hover { background: var(--accent-light); }

        /* ─── DROPDOWN ─── */
        .h-drop { position: relative; }
        .h-drop-trigger {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0.45rem 0.8rem;
          color: var(--white-70);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.84rem;
          font-weight: 500;
          background: none;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .h-drop-trigger:hover,
        .h-drop-trigger.open { color: var(--accent); background: var(--accent-dim); }
        .h-drop-arrow {
          font-size: 0.55rem;
          opacity: 0.45;
          transition: transform 0.22s;
          margin-top: 1px;
        }
        .h-drop-trigger.open .h-drop-arrow { transform: rotate(180deg); opacity: 0.8; }

        .h-drop-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 200px;
          background: #161616;
          border: 1px solid rgba(200,169,110,0.18);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.3);
          animation: dropFade 0.18s ease;
          z-index: 100;
        }
        @keyframes dropFade {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .h-drop-info {
          padding: 0.8rem 1rem 0.65rem;
          border-bottom: 1px solid rgba(200,169,110,0.1);
        }
        .h-drop-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--accent);
          letter-spacing: 0.04em;
        }
        .h-drop-role {
          font-size: 0.68rem;
          color: rgba(255,255,255,0.35);
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .h-drop-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 0.62rem 1rem;
          color: var(--white-70);
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 400;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, padding-left 0.15s;
        }
        .h-drop-item:hover {
          background: var(--accent-dim);
          color: var(--accent);
          padding-left: 1.2rem;
        }
        .h-drop-item.danger { color: rgba(255,107,107,0.75); }
        .h-drop-item.danger:hover {
          background: rgba(255,107,107,0.08);
          color: var(--danger);
          padding-left: 1.2rem;
        }
        .h-drop-sep {
          border: none;
          border-top: 1px solid rgba(200,169,110,0.1);
          margin: 3px 0;
        }

        /* ─── MOBILE SEARCH ICON ─── */
        .h-search-icon-btn {
          display: none;
          background: none;
          border: 1px solid var(--accent-border);
          color: var(--accent);
          width: 36px; height: 36px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* ─── MOBILE SEARCH BAR (slides down) ─── */
        .h-mobile-search {
          display: none;
          padding: 0.65rem 1rem;
          background: var(--primary-soft);
          border-top: 1px solid var(--accent-border);
        }
        .h-mobile-search form {
          display: flex;
          border: 1px solid var(--accent-border);
          border-radius: 6px;
          overflow: hidden;
          background: var(--white-10);
        }
        .h-mobile-search input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.55rem 0.9rem;
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          outline: none;
        }
        .h-mobile-search input::placeholder { color: var(--white-40); }
        .h-mobile-search button {
          border: none;
          background: var(--accent);
          color: var(--primary);
          padding: 0 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }

        /* ─── HAMBURGER ─── */
        .h-burger {
          display: none;
          background: none;
          border: 1px solid var(--accent-border);
          color: var(--accent);
          width: 36px; height: 36px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1.1rem;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .h-burger:hover { background: var(--accent-dim); }

        /* ─── MOBILE MENU ─── */
        .h-mobile-menu {
          display: none;
          flex-direction: column;
          background: var(--primary-soft);
          border-top: 1px solid var(--accent-border);
          padding: 0.5rem 0 0.75rem;
        }
        .h-mobile-menu .h-nav-link,
        .h-mobile-menu .h-drop-trigger {
          width: 100%;
          border-radius: 0;
          padding: 0.7rem 1.25rem;
          font-size: 0.9rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .h-mobile-menu .h-btn-login,
        .h-mobile-menu .h-btn-register {
          margin: 0.35rem 1rem 0;
          display: block;
          text-align: center;
          padding: 0.6rem;
          font-size: 0.82rem;
          border-radius: 6px;
        }
        .h-mobile-submenu {
          background: rgba(200,169,110,0.04);
          border-top: 1px solid rgba(200,169,110,0.08);
          border-bottom: 1px solid rgba(200,169,110,0.08);
        }
        .h-mobile-submenu .h-drop-item {
          padding-left: 2rem;
          font-size: 0.85rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 900px) {
          .h-search { display: none; }
          .h-search-icon-btn { display: flex; }
        }
        @media (max-width: 768px) {
          .h-inner { padding: 0 1rem; gap: 0.75rem; }
          .h-nav { display: none; }
          .h-burger { display: flex; }
          .h-search-icon-btn { display: flex; }
          .h-search { display: none !important; }
        }
        .h-mobile-search.open { display: block; }
        .h-mobile-menu.open { display: flex; }
      `}</style>

      <div ref={headerRef}>
        <header className={`sns-header${scrolled ? ' scrolled' : ''}`}>
          <div className="h-inner">

            {/* Logo */}
            <Link to="/" className="h-logo" onClick={() => setMenuOpen(false)}>
              <span className="h-logo-main">SNS</span>
              <span className="h-logo-sub">E-Commerce</span>
            </Link>

            {/* Desktop Search */}
            <form className="h-search" onSubmit={submitHandler}>
              <input
                className="h-search-input"
                type="search"
                placeholder="Search products..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button className="h-search-btn" type="submit">Search</button>
            </form>

            {/* Mobile Search Icon */}
            <button
              className="h-search-icon-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              🔍
            </button>

            {/* Desktop Nav */}
            <nav className="h-nav">
              <Link to="/cart" className="h-nav-link">🛒 Cart</Link>

              {userInfo && (
                <Link to="/wishlist" className="h-nav-link">♡ Wishlist</Link>
              )}

              <div className="h-divider" />

              {userInfo ? (
                <div className="h-drop">
                  <button
                    className={`h-drop-trigger${userDropOpen ? ' open' : ''}`}
                    onClick={() => { setUserDropOpen(!userDropOpen); setAdminDropOpen(false); }}
                  >
                    👤 {userName.split('@')[0]}
                    <span className="h-drop-arrow">▼</span>
                  </button>
                  {userDropOpen && (
                    <div className="h-drop-menu">
                      <div className="h-drop-info">
                        <div className="h-drop-name">{userName.split('@')[0]}</div>
                        <div className="h-drop-role">{userInfo.isAdmin ? 'Administrator' : 'Customer'}</div>
                      </div>
                      <Link to="/profile" className="h-drop-item" onClick={() => setUserDropOpen(false)}>👤 My Profile</Link>
                      <Link to="/wishlist" className="h-drop-item" onClick={() => setUserDropOpen(false)}>♡ My Wishlist</Link>
                      <hr className="h-drop-sep" />
                      <button className="h-drop-item danger" onClick={logoutHandler}>🚪 Sign Out</button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="h-btn-login">Login</Link>
                  <Link to="/register" className="h-btn-register">Register</Link>
                </>
              )}

              {userInfo?.isAdmin && (
                <div className="h-drop">
                  <button
                    className={`h-drop-trigger${adminDropOpen ? ' open' : ''}`}
                    onClick={() => { setAdminDropOpen(!adminDropOpen); setUserDropOpen(false); }}
                  >
                    ⚙️ Admin
                    <span className="h-drop-arrow">▼</span>
                  </button>
                  {adminDropOpen && (
                    <div className="h-drop-menu">
                      <Link to="/admin/dashboard" className="h-drop-item" onClick={() => setAdminDropOpen(false)}>📊 Dashboard</Link>
                      <hr className="h-drop-sep" />
                      <Link to="/admin/userlist" className="h-drop-item" onClick={() => setAdminDropOpen(false)}>👥 Users</Link>
                      <Link to="/admin/productlist" className="h-drop-item" onClick={() => setAdminDropOpen(false)}>🛍️ Products</Link>
                      <Link to="/admin/orderlist" className="h-drop-item" onClick={() => setAdminDropOpen(false)}>📦 Orders</Link>
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* Hamburger */}
            <button
              className="h-burger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </header>

        {/* Mobile Search Bar */}
        <div className={`h-mobile-search${searchOpen ? ' open' : ''}`}>
          <form onSubmit={submitHandler}>
            <input
              type="search"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit">Go</button>
          </form>
        </div>

        {/* Mobile Menu */}
        <div className={`h-mobile-menu${menuOpen ? ' open' : ''}`}>
          <Link to="/cart" className="h-nav-link" onClick={() => setMenuOpen(false)}>🛒 Cart</Link>

          {userInfo && (
            <Link to="/wishlist" className="h-nav-link" onClick={() => setMenuOpen(false)}>♡ Wishlist</Link>
          )}

          {userInfo ? (
            <>
              <button
                className={`h-drop-trigger${userDropOpen ? ' open' : ''}`}
                onClick={() => setUserDropOpen(!userDropOpen)}
                style={{ width: '100%', borderRadius: 0, padding: '0.7rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                👤 {userName.split('@')[0]} <span className="h-drop-arrow">▼</span>
              </button>
              {userDropOpen && (
                <div className="h-mobile-submenu">
                  <Link to="/profile" className="h-drop-item" onClick={() => setMenuOpen(false)}>👤 My Profile</Link>
                  <Link to="/wishlist" className="h-drop-item" onClick={() => setMenuOpen(false)}>♡ My Wishlist</Link>
                  <button className="h-drop-item danger" onClick={logoutHandler}>🚪 Sign Out</button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="h-btn-login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="h-btn-register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}

          {userInfo?.isAdmin && (
            <>
              <button
                className={`h-drop-trigger${adminDropOpen ? ' open' : ''}`}
                onClick={() => setAdminDropOpen(!adminDropOpen)}
                style={{ width: '100%', borderRadius: 0, padding: '0.7rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                ⚙️ Admin <span className="h-drop-arrow">▼</span>
              </button>
              {adminDropOpen && (
                <div className="h-mobile-submenu">
                  <Link to="/admin/dashboard" className="h-drop-item" onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
                  <Link to="/admin/userlist" className="h-drop-item" onClick={() => setMenuOpen(false)}>👥 Users</Link>
                  <Link to="/admin/productlist" className="h-drop-item" onClick={() => setMenuOpen(false)}>🛍️ Products</Link>
                  <Link to="/admin/orderlist" className="h-drop-item" onClick={() => setMenuOpen(false)}>📦 Orders</Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
