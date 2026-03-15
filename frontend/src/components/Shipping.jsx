import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Shipping() {
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) navigate('/login');
    }, [navigate]);

    const existingShipping = JSON.parse(localStorage.getItem('shippingAddress')) || {};
    const [address, setAddress] = useState(existingShipping.address || '');
    const [city, setCity] = useState(existingShipping.city || '');
    const [postalCode, setPostalCode] = useState(existingShipping.postalCode || '');
    const [country, setCountry] = useState(existingShipping.country || '');

    const submitHandler = (e) => {
        e.preventDefault();
        localStorage.setItem('shippingAddress', JSON.stringify({ address, city, postalCode, country }));
        navigate('/payment');
    };

    const steps = ['Login', 'Shipping', 'Payment', 'Place Order'];
    const isComplete = address && city && postalCode && country;

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

                .sh-wrap {
                    min-height: 100vh;
                    background: var(--surface2);
                    font-family: 'DM Sans', sans-serif;
                    padding-bottom: 4rem;
                }

                /* ── HEADER ── */
                .sh-header {
                    background: linear-gradient(135deg, #0d0d0d, #1a1612);
                    padding: 2.5rem 1.5rem 2rem;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }
                .sh-header::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse 70% 80% at 50% 0%, rgba(200,169,110,0.1) 0%, transparent 70%);
                }
                .sh-eyebrow {
                    font-size: 0.65rem;
                    font-weight: 600;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    color: var(--accent);
                    margin-bottom: 0.4rem;
                    opacity: 0.85;
                    position: relative;
                }
                .sh-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.5rem, 4vw, 2rem);
                    font-weight: 700;
                    color: #fff;
                    margin: 0 0 1.75rem;
                    position: relative;
                }
                .sh-title span { color: var(--accent); }

                /* ── STEPPER ── */
                .sh-stepper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    max-width: 480px;
                    margin: 0 auto;
                    position: relative;
                }
                .sh-step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    flex: none;
                }
                .sh-step-circle {
                    width: 32px; height: 32px;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border: 2px solid;
                    z-index: 1;
                }
                .sh-step-circle.done { background: var(--accent); border-color: var(--accent); color: #0d0d0d; }
                .sh-step-circle.active { background: #fff; border-color: #fff; color: #0d0d0d; }
                .sh-step-circle.pending { background: transparent; border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.3); }
                .sh-step-label {
                    font-size: 0.62rem;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    white-space: nowrap;
                }
                .sh-step-label.done { color: var(--accent); }
                .sh-step-label.active { color: #fff; }
                .sh-step-label.pending { color: rgba(255,255,255,0.25); }
                .sh-step-line {
                    flex: 1;
                    height: 2px;
                    margin-bottom: 22px;
                    min-width: 30px;
                }
                .sh-step-line.done { background: var(--accent); opacity: 0.5; }
                .sh-step-line.pending { background: rgba(255,255,255,0.12); }

                /* ── BODY ── */
                .sh-container {
                    max-width: 960px;
                    margin: 2.5rem auto;
                    padding: 0 1.5rem;
                    display: grid;
                    grid-template-columns: 1fr 320px;
                    gap: 1.75rem;
                    align-items: start;
                }

                /* ── FORM CARD ── */
                .sh-form-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    overflow: hidden;
                    box-shadow: var(--shadow);
                }
                .sh-form-head {
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .sh-form-icon {
                    width: 34px; height: 34px;
                    border-radius: 50%;
                    background: var(--accent-dim);
                    border: 1px solid rgba(200,169,110,0.2);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.9rem;
                    flex-shrink: 0;
                }
                .sh-form-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text);
                }
                .sh-form-subtitle {
                    font-size: 0.72rem;
                    color: var(--text-muted);
                    margin-top: 1px;
                }
                .sh-form-body { padding: 1.5rem; }

                /* ── FIELDS ── */
                .sh-field { margin-bottom: 1.1rem; }
                .sh-label {
                    display: block;
                    font-size: 0.68rem;
                    font-weight: 700;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    margin-bottom: 6px;
                }
                .sh-input-wrap { position: relative; }
                .sh-input-icon {
                    position: absolute;
                    left: 13px; top: 50%;
                    transform: translateY(-50%);
                    font-size: 0.85rem;
                    opacity: 0.4;
                    pointer-events: none;
                }
                .sh-input {
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
                .sh-input:focus {
                    border-color: var(--accent);
                    box-shadow: 0 0 0 3px rgba(200,169,110,0.12);
                    background: var(--surface);
                }
                .sh-input::placeholder { color: #ccc; }
                .sh-input.filled { border-color: rgba(200,169,110,0.4); }

                /* Two col row */
                .sh-row-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                /* Submit button */
                .sh-btn {
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
                    margin-top: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                .sh-btn:hover {
                    background: var(--accent);
                    color: var(--dark);
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(200,169,110,0.25);
                }
                .sh-btn:disabled { background: #ddd; color: #999; cursor: not-allowed; transform: none; box-shadow: none; }

                /* ── RIGHT PANEL ── */
                .sh-info-panel {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                /* Summary preview */
                .sh-preview-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    overflow: hidden;
                    box-shadow: var(--shadow);
                }
                .sh-preview-head {
                    background: linear-gradient(135deg, #0d0d0d, #1a1612);
                    padding: 1rem 1.25rem;
                    position: relative;
                }
                .sh-preview-head::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse 80% 100% at 50% 0%, rgba(200,169,110,0.12) 0%, transparent 70%);
                }
                .sh-preview-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 0.92rem;
                    font-weight: 600;
                    color: #fff;
                    position: relative;
                }
                .sh-preview-body { padding: 1.1rem 1.25rem; }
                .sh-preview-row {
                    display: flex;
                    gap: 10px;
                    align-items: flex-start;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid var(--border);
                    font-size: 0.82rem;
                }
                .sh-preview-row:last-child { border-bottom: none; }
                .sh-preview-icon { font-size: 0.9rem; flex-shrink: 0; margin-top: 1px; }
                .sh-preview-key {
                    font-size: 0.68rem;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    min-width: 70px;
                }
                .sh-preview-val {
                    color: var(--text);
                    font-weight: 500;
                    word-break: break-word;
                }
                .sh-preview-placeholder {
                    color: #ccc;
                    font-style: italic;
                    font-weight: 400;
                }

                /* Info card */
                .sh-info-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 1.25rem;
                    box-shadow: var(--shadow);
                }
                .sh-info-title {
                    font-size: 0.68rem;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    margin-bottom: 0.85rem;
                }
                .sh-info-item {
                    display: flex;
                    gap: 10px;
                    align-items: flex-start;
                    margin-bottom: 0.75rem;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    line-height: 1.5;
                }
                .sh-info-item:last-child { margin-bottom: 0; }
                .sh-info-item-icon { font-size: 0.9rem; flex-shrink: 0; margin-top: 1px; }

                /* ── RESPONSIVE ── */
                @media (max-width: 820px) {
                    .sh-container { grid-template-columns: 1fr; }
                }
                @media (max-width: 560px) {
                    .sh-container { padding: 1rem; }
                    .sh-row-2 { grid-template-columns: 1fr; }
                    .sh-step-label { display: none; }
                }
            `}</style>

            <div className="sh-wrap">

                {/* Header + Stepper */}
                <div className="sh-header">
                    <p className="sh-eyebrow">Checkout — Step 2</p>
                    <h1 className="sh-title">Shipping <span>Address</span></h1>

                    <div className="sh-stepper">
                        {steps.map((step, i) => {
                            const status = i < 1 ? 'done' : i === 1 ? 'active' : 'pending';
                            return (
                                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                    <div className="sh-step">
                                        <div className={`sh-step-circle ${status}`}>
                                            {status === 'done' ? '✓' : i + 1}
                                        </div>
                                        <span className={`sh-step-label ${status}`}>{step}</span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className={`sh-step-line ${i < 1 ? 'done' : 'pending'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Body */}
                <div className="sh-container">

                    {/* ── FORM ── */}
                    <div className="sh-form-card">
                        <div className="sh-form-head">
                            <div className="sh-form-icon">📦</div>
                            <div>
                                <div className="sh-form-title">Delivery Details</div>
                                <div className="sh-form-subtitle">Where should we send your order?</div>
                            </div>
                        </div>
                        <div className="sh-form-body">
                            <form onSubmit={submitHandler}>

                                <div className="sh-field">
                                    <label className="sh-label">Street Address</label>
                                    <div className="sh-input-wrap">
                                        <span className="sh-input-icon">🏠</span>
                                        <input
                                            type="text"
                                            className={`sh-input ${address ? 'filled' : ''}`}
                                            placeholder="123 Main Street, Apt 4B"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="sh-row-2">
                                    <div className="sh-field">
                                        <label className="sh-label">City</label>
                                        <div className="sh-input-wrap">
                                            <span className="sh-input-icon">🏙️</span>
                                            <input
                                                type="text"
                                                className={`sh-input ${city ? 'filled' : ''}`}
                                                placeholder="City name"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="sh-field">
                                        <label className="sh-label">Postal Code</label>
                                        <div className="sh-input-wrap">
                                            <span className="sh-input-icon">📮</span>
                                            <input
                                                type="text"
                                                className={`sh-input ${postalCode ? 'filled' : ''}`}
                                                placeholder="000000"
                                                value={postalCode}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="sh-field">
                                    <label className="sh-label">Country</label>
                                    <div className="sh-input-wrap">
                                        <span className="sh-input-icon">🌍</span>
                                        <input
                                            type="text"
                                            className={`sh-input ${country ? 'filled' : ''}`}
                                            placeholder="Country"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="sh-btn" disabled={!isComplete}>
                                    Continue to Payment →
                                </button>

                            </form>
                        </div>
                    </div>

                    {/* ── RIGHT PANEL ── */}
                    <div className="sh-info-panel">

                        {/* Live preview */}
                        <div className="sh-preview-card">
                            <div className="sh-preview-head">
                                <div className="sh-preview-title">📍 Delivery Preview</div>
                            </div>
                            <div className="sh-preview-body">
                                {[
                                    { icon: '🏠', key: 'Address', val: address },
                                    { icon: '🏙️', key: 'City', val: city },
                                    { icon: '📮', key: 'Postal', val: postalCode },
                                    { icon: '🌍', key: 'Country', val: country },
                                ].map(({ icon, key, val }) => (
                                    <div key={key} className="sh-preview-row">
                                        <span className="sh-preview-icon">{icon}</span>
                                        <span className="sh-preview-key">{key}</span>
                                        {val
                                            ? <span className="sh-preview-val">{val}</span>
                                            : <span className="sh-preview-placeholder">Not filled yet</span>
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="sh-info-card">
                            <div className="sh-info-title">Shipping Info</div>
                            {[
                                ['🚚', 'Free shipping on orders above $100'],
                                ['⚡', 'Standard delivery in 3–7 business days'],
                                ['🔒', 'Your address is stored securely'],
                                ['✏️', 'You can update this anytime before checkout'],
                            ].map(([icon, text]) => (
                                <div key={text} className="sh-info-item">
                                    <span className="sh-info-item-icon">{icon}</span>
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Shipping;
