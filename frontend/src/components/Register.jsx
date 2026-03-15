import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/register/', { username, email, password });
      navigate('/login');
    } catch (error) {
      setError(error.response ? JSON.stringify(error.response.data) : "Network Error: Is the Django server running?");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!password) return null;
    if (password.length < 6) return { level: 1, label: 'Weak', color: '#ef4444' };
    if (password.length < 10) return { level: 2, label: 'Fair', color: '#f59e0b' };
    return { level: 3, label: 'Strong', color: '#22c55e' };
  };
  const strength = passwordStrength();

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
          --shadow: 0 4px 24px rgba(0,0,0,0.08);
          --shadow-lg: 0 20px 60px rgba(0,0,0,0.15);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .rg-wrap {
          min-height: 100vh;
          background: var(--surface2);
          display: flex;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── LEFT PANEL ── */
        .rg-left {
          flex: 1;
          background: linear-gradient(160deg, #0d0d0d 0%, #1a1410 50%, #0f0d0b 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2.5rem;
          position: relative;
          overflow: hidden;
        }
        .rg-left::before {
          content: '';
          position: absolute;
          top: -80px; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 400px;
          background: radial-gradient(ellipse, rgba(200,169,110,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .rg-left-pattern {
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            45deg,
            rgba(200,169,110,0.03) 0px,
            rgba(200,169,110,0.03) 1px,
            transparent 1px,
            transparent 28px
          );
        }
        .rg-left-content { position: relative; text-align: center; max-width: 340px; }
        .rg-brand {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.05em;
          margin-bottom: 0.2rem;
        }
        .rg-brand span { color: var(--accent); }
        .rg-brand-sub {
          font-size: 0.62rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 3rem;
        }
        .rg-left-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 1rem;
        }
        .rg-left-title span { color: var(--accent); }
        .rg-left-desc {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.4);
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }
        .rg-perks { display: flex; flex-direction: column; gap: 0.75rem; text-align: left; }
        .rg-perk {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.5);
        }
        .rg-perk-icon {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: var(--accent-dim);
          border: 1px solid rgba(200,169,110,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem;
          flex-shrink: 0;
        }
        .rg-divider {
          width: 48px; height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          margin: 2.5rem auto;
          opacity: 0.5;
        }
        .rg-login-link {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.3);
        }
        .rg-login-link a {
          color: var(--accent);
          text-decoration: none;
          font-weight: 600;
        }
        .rg-login-link a:hover { color: var(--accent-light); }

        /* ── RIGHT PANEL ── */
        .rg-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 2.5rem;
          overflow-y: auto;
        }
        .rg-form-wrap {
          width: 100%;
          max-width: 420px;
        }
        .rg-form-header { margin-bottom: 2rem; }
        .rg-form-eyebrow {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.5rem;
        }
        .rg-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.9rem;
          font-weight: 700;
          color: var(--text);
          line-height: 1.2;
          margin-bottom: 0.4rem;
        }
        .rg-form-subtitle { font-size: 0.85rem; color: var(--text-muted); }

        /* Fields */
        .rg-field { margin-bottom: 1.1rem; }
        .rg-label {
          display: block;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 6px;
        }
        .rg-input-wrap { position: relative; }
        .rg-input-icon {
          position: absolute;
          left: 13px; top: 50%;
          transform: translateY(-50%);
          font-size: 0.85rem;
          opacity: 0.4;
          pointer-events: none;
        }
        .rg-input {
          width: 100%;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 0.7rem 0.9rem 0.7rem 2.5rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          color: var(--text);
          background: var(--surface2);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .rg-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(200,169,110,0.12);
          background: var(--surface);
        }
        .rg-input::placeholder { color: #ccc; }
        .rg-eye-btn {
          position: absolute;
          right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
          color: var(--text-muted);
          padding: 4px;
          transition: color 0.2s;
        }
        .rg-eye-btn:hover { color: var(--accent); }

        /* Password strength */
        .rg-strength {
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rg-strength-bars {
          display: flex;
          gap: 3px;
          flex: 1;
        }
        .rg-strength-bar {
          flex: 1;
          height: 3px;
          border-radius: 2px;
          background: var(--border);
          transition: background 0.3s;
        }
        .rg-strength-label {
          font-size: 0.68rem;
          font-weight: 600;
          white-space: nowrap;
        }

        /* Match indicator */
        .rg-match {
          margin-top: 5px;
          font-size: 0.72rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Alert */
        .rg-alert {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 500;
          margin-bottom: 1.25rem;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fca5a5;
          animation: slideIn 0.25s ease;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Terms note */
        .rg-terms {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-align: center;
          line-height: 1.5;
          margin-bottom: 1.1rem;
        }
        .rg-terms a { color: var(--accent); text-decoration: none; }

        /* Submit */
        .rg-btn {
          width: 100%;
          padding: 0.9rem;
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
          margin-bottom: 1.25rem;
        }
        .rg-btn:hover:not(:disabled) {
          background: var(--accent);
          color: var(--dark);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(200,169,110,0.25);
        }
        .rg-btn:disabled { background: #ddd; color: #999; cursor: not-allowed; }

        .rg-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .rg-login-row {
          text-align: center;
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .rg-login-row a {
          color: var(--accent);
          font-weight: 600;
          text-decoration: none;
        }
        .rg-login-row a:hover { color: #a07840; }

        /* ── RESPONSIVE ── */
        @media (max-width: 860px) {
          .rg-left { display: none; }
          .rg-right { padding: 2rem 1.25rem; }
        }
      `}</style>

      <div className="rg-wrap">

        {/* ── LEFT ── */}
        <div className="rg-left">
          <div className="rg-left-pattern" />
          <div className="rg-left-content">
            <div className="rg-brand">SNS<span>.</span></div>
            <div className="rg-brand-sub">E — Commerce</div>

            <h2 className="rg-left-title">
              Join the<br /><span>SNS Community</span>
            </h2>
            <p className="rg-left-desc">
              Create your account and start exploring premium products curated just for you.
            </p>

            <div className="rg-perks">
              {[
                ['🛒', 'Seamless cart & checkout experience'],
                ['❤️', 'Save products to your wishlist'],
                ['📦', 'Track all your orders in one place'],
                ['🔒', 'Secure & private — always'],
              ].map(([icon, text]) => (
                <div key={text} className="rg-perk">
                  <div className="rg-perk-icon">{icon}</div>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="rg-divider" />
            <div className="rg-login-link">
              Already a member? <Link to="/login">Sign in here</Link>
            </div>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="rg-right">
          <div className="rg-form-wrap">

            <div className="rg-form-header">
              <p className="rg-form-eyebrow">New Account</p>
              <h1 className="rg-form-title">Create Account</h1>
              <p className="rg-form-subtitle">Fill in the details below to get started</p>
            </div>

            {error && (
              <div className="rg-alert">
                <span>⚠️</span><span>{error}</span>
              </div>
            )}

            <form onSubmit={submitHandler}>
              <div className="rg-field">
                <label className="rg-label">Username</label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon">👤</span>
                  <input
                    type="text"
                    className="rg-input"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="rg-field">
                <label className="rg-label">Email Address</label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon">✉️</span>
                  <input
                    type="email"
                    className="rg-input"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="rg-field">
                <label className="rg-label">Password</label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="rg-input"
                    style={{ paddingRight: '2.5rem' }}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="rg-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {strength && (
                  <div className="rg-strength">
                    <div className="rg-strength-bars">
                      {[1, 2, 3].map(i => (
                        <div
                          key={i}
                          className="rg-strength-bar"
                          style={{ background: i <= strength.level ? strength.color : undefined }}
                        />
                      ))}
                    </div>
                    <span className="rg-strength-label" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="rg-field">
                <label className="rg-label">Confirm Password</label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon">🔒</span>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className="rg-input"
                    style={{ paddingRight: '2.5rem' }}
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="rg-eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="rg-match" style={{ color: password === confirmPassword ? '#22c55e' : '#ef4444' }}>
                    {password === confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
                  </div>
                )}
              </div>

              <div className="rg-terms">
                By registering, you agree to our{' '}
                <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </div>

              <button type="submit" className="rg-btn" disabled={loading}>
                {loading ? <><div className="rg-spinner" /> Creating Account...</> : '🚀 Create Account'}
              </button>

              <div className="rg-login-row">
                Already have an account? <Link to="/login">Sign in →</Link>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
