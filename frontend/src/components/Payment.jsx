import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Payment() {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        const shippingAddress = localStorage.getItem('shippingAddress');
        if (!userInfo) navigate('/login');
        else if (!shippingAddress) navigate('/shipping');
    }, [navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
        navigate('/placeorder');
    };

    const methods = [
        { id: 'PayPal', label: 'PayPal or Credit Card', icon: '🅿️', desc: 'Pay securely with PayPal or any credit card' },
        { id: 'Stripe', label: 'Stripe', icon: '💳', desc: 'Fast & secure payment via Stripe' },
        { id: 'CashOnDelivery', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives at your door' },
    ];

    const steps = ['Login', 'Shipping', 'Payment', 'Place Order'];

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
                    --shadow: 0 2px 16px rgba(0,0,0,0.07);
                }

                .pay-wrap {
                    min-height: 100vh;
                    background: var(--surface2);
                    font-family: 'DM Sans', sans-serif;
                    padding-bottom: 4rem;
                }

                /* ── HEADER ── */
                .pay-header {
                    background: linear-gradient(135deg, #0d0d0d, #1a1612);
                    padding: 2.5rem 1.5rem 2rem;
                    text-align: center;
                    position: relative;
                }
                .pay-header::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse 70% 80% at 50% 0%, rgba(200,169,110,0.1) 0%, transparent 70%);
                }
                .pay-eyebrow {
                    font-size: 0.65rem;
                    font-weight: 600;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    color: var(--accent);
                    margin-bottom: 0.4rem;
                    opacity: 0.85;
                    position: relative;
                }
                .pay-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.5rem, 4vw, 2rem);
                    font-weight: 700;
                    color: #fff;
                    margin: 0 0 1.75rem;
                    position: relative;
                }
                .pay-title span { color: var(--accent); }

                /* ── STEPPER ── */
                .pay-stepper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    max-width: 480px;
                    margin: 0 auto;
                }
                .pay-step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    flex: none;
                }
                .pay-step-circle {
                    width: 32px; height: 32px;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border: 2px solid;
                    z-index: 1;
                }
                .pay-step-circle.done { background: var(--accent); border-color: var(--accent); color: #0d0d0d; }
                .pay-step-circle.active { background: #fff; border-color: #fff; color: #0d0d0d; }
                .pay-step-circle.pending { background: transparent; border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.3); }
                .pay-step-label {
                    font-size: 0.62rem;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    white-space: nowrap;
                }
                .pay-step-label.done { color: var(--accent); }
                .pay-step-label.active { color: #fff; }
                .pay-step-label.pending { color: rgba(255,255,255,0.25); }
                .pay-step-line {
                    flex: 1;
                    height: 2px;
                    margin-bottom: 22px;
                    min-width: 30px;
                }
                .pay-step-line.done { background: var(--accent); opacity: 0.5; }
                .pay-step-line.pending { background: rgba(255,255,255,0.12); }

                /* ── CONTAINER ── */
                .pay-container {
                    max-width: 520px;
                    margin: 2.5rem auto;
                    padding: 0 1.5rem;
                }

                /* ── METHODS ── */
                .pay-methods { display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1.5rem; }

                .pay-method-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.25rem;
                    background: var(--surface);
                    border: 2px solid var(--border);
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                    position: relative;
                }
                .pay-method-card:hover {
                    border-color: var(--accent-light);
                    box-shadow: 0 4px 16px rgba(200,169,110,0.1);
                }
                .pay-method-card.selected {
                    border-color: var(--accent);
                    background: var(--accent-dim);
                    box-shadow: 0 4px 20px rgba(200,169,110,0.15);
                }

                /* Hidden real radio */
                .pay-method-card input[type="radio"] {
                    position: absolute;
                    opacity: 0;
                    width: 0; height: 0;
                }

                .pay-method-icon {
                    font-size: 1.5rem;
                    flex-shrink: 0;
                    width: 44px; height: 44px;
                    border-radius: 50%;
                    background: var(--surface3);
                    display: flex; align-items: center; justify-content: center;
                    transition: background 0.2s;
                }
                .pay-method-card.selected .pay-method-icon {
                    background: rgba(200,169,110,0.2);
                }

                .pay-method-info { flex: 1; }
                .pay-method-label {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text);
                    display: block;
                    margin-bottom: 2px;
                }
                .pay-method-desc {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                /* Custom radio dot */
                .pay-radio-dot {
                    width: 20px; height: 20px;
                    border-radius: 50%;
                    border: 2px solid var(--border);
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                    transition: border-color 0.2s;
                }
                .pay-method-card.selected .pay-radio-dot {
                    border-color: var(--accent);
                }
                .pay-radio-dot-inner {
                    width: 10px; height: 10px;
                    border-radius: 50%;
                    background: var(--accent);
                    opacity: 0;
                    transition: opacity 0.2s, transform 0.2s;
                    transform: scale(0.5);
                }
                .pay-method-card.selected .pay-radio-dot-inner {
                    opacity: 1;
                    transform: scale(1);
                }

                /* ── SUBMIT BTN ── */
                .pay-btn {
                    width: 100%;
                    padding: 0.9rem;
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
                }
                .pay-btn:hover {
                    background: var(--accent);
                    color: #0d0d0d;
                    transform: translateY(-1px);
                }

                /* ── RESPONSIVE ── */
                @media (max-width: 560px) {
                    .pay-container { padding: 0 1rem; }
                    .pay-step-label { display: none; }
                    .pay-method-desc { display: none; }
                }
            `}</style>

            <div className="pay-wrap">

                {/* Header + Stepper */}
                <div className="pay-header">
                    <p className="pay-eyebrow">Secure Checkout</p>
                    <h1 className="pay-title">Payment <span>Method</span></h1>

                    <div className="pay-stepper">
                        {steps.map((step, i) => {
                            const status = i < 2 ? 'done' : i === 2 ? 'active' : 'pending';
                            return (
                                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                    <div className="pay-step">
                                        <div className={`pay-step-circle ${status}`}>
                                            {status === 'done' ? '✓' : i + 1}
                                        </div>
                                        <span className={`pay-step-label ${status}`}>{step}</span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className={`pay-step-line ${i < 2 ? 'done' : 'pending'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form */}
                <div className="pay-container">
                    <form onSubmit={submitHandler}>
                        <div className="pay-methods">
                            {methods.map((method) => (
                                <label
                                    key={method.id}
                                    className={`pay-method-card ${paymentMethod === method.id ? 'selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method.id}
                                        checked={paymentMethod === method.id}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <div className="pay-method-icon">{method.icon}</div>
                                    <div className="pay-method-info">
                                        <span className="pay-method-label">{method.label}</span>
                                        <span className="pay-method-desc">{method.desc}</span>
                                    </div>
                                    <div className="pay-radio-dot">
                                        <div className="pay-radio-dot-inner" />
                                    </div>
                                </label>
                            ))}
                        </div>

                        <button type="submit" className="pay-btn">
                            Continue to Place Order →
                        </button>
                    </form>
                </div>

            </div>
        </>
    );
}

export default Payment;
