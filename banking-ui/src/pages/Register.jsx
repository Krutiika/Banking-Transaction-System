import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerApi } from '../services/api';

// ─── Validation helpers ────────────────────────────────────────────────────────
function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}
function validatePhone(v) {
  return /^[\d\s+\-().]{7,15}$/.test(v.trim());
}

function validateForm(form) {
  const errs = {};
  if (!form.fullName.trim())        errs.fullName = 'Full name is required.';
  if (!validateEmail(form.email))   errs.email   = 'Enter a valid email address.';
  if (form.password.length < 8)     errs.password = 'Password must be at least 8 characters.';
  else if (!/[A-Z]/.test(form.password)) errs.password = 'Include at least one uppercase letter.';
  if (form.confirmPassword !== form.password)
                                    errs.confirmPassword = 'Passwords do not match.';
  if (!validatePhone(form.phone))   errs.phone   = 'Enter a valid phone number.';
  if (!form.address.trim())         errs.address = 'Address is required.';
  return errs;
}

// ─── Step indicator ────────────────────────────────────────────────────────────
function StepDot({ active, done, label }) {
  return (
    <div className={`reg-step ${active ? 'reg-step--active' : ''} ${done ? 'reg-step--done' : ''}`}>
      <div className="reg-step__dot">
        {done && (
          <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className="reg-step__label">{label}</span>
    </div>
  );
}

// ─── Success Screen ────────────────────────────────────────────────────────────
function SuccessScreen({ name, onGoLogin }) {
  return (
    <div className="reg-success">
      <div className="reg-success__icon" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="url(#succGrad)" strokeWidth="2.5"/>
          <path d="M20 32l8 8 16-16" stroke="url(#succGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="succGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6C63FF"/>
              <stop offset="1" stopColor="#34d399"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h2 className="reg-success__title">Account Created!</h2>
      <p className="reg-success__sub">Welcome aboard, <strong>{name}</strong>. Your MyBank account is ready.</p>
      <button id="reg-go-login-btn" className="reg-btn" onClick={onGoLogin}>
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3.333 10h13.334M11.667 5L17 10l-5.333 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Sign In Now
      </button>
    </div>
  );
}

// ─── Eye toggle button ────────────────────────────────────────────────────────
function EyeBtn({ show, onToggle, disabled }) {
  return (
    <button type="button" className="reg-eye-btn" onClick={onToggle}
      aria-label={show ? 'Hide password' : 'Show password'} disabled={disabled}>
      {show ? (
        <svg viewBox="0 0 20 20" fill="none"><path d="M2.5 10s2.5-5 7.5-5 7.5 5 7.5 5-2.5 5-7.5 5-7.5-5-7.5-5Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="none"><path d="M2.5 10s2.5-5 7.5-5 7.5 5 7.5 5-2.5 5-7.5 5-7.5-5-7.5-5Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>
      )}
    </button>
  );
}

// ─── Register Page ─────────────────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '', phone: '', address: '',
  });
  const [errors,      setErrors]      = useState({});
  const [serverError, setServerError] = useState('');
  const [loading,     setLoading]     = useState(false);
  const [showPw,      setShowPw]      = useState(false);
  const [showCpw,     setShowCpw]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [successName, setSuccessName] = useState('');

  // ── Strength meter ───────────────────────────────────────────────────────────
  function passwordStrength(pw) {
    let score = 0;
    if (pw.length >= 8)          score++;
    if (/[A-Z]/.test(pw))        score++;
    if (/[0-9]/.test(pw))        score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }
  const pwStrength = passwordStrength(form.password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#ff6b6b', '#fbbf24', '#34d399', '#6C63FF'];

  // ── Change handler ───────────────────────────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: '' }));
    setServerError('');
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validateForm(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');
    try {
      await registerApi({
        fullName: form.fullName.trim(),
        email:    form.email.trim(),
        password: form.password,
        phone:    form.phone.trim(),
        address:  form.address.trim(),
      });
      setSuccessName(form.fullName.trim().split(' ')[0]);
      setSuccess(true);
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Current step (visual progress) ──────────────────────────────────────────
  const filledFields = Object.values(form).filter(Boolean).length;
  const currentStep  = filledFields === 0 ? 0 : filledFields <= 2 ? 1 : filledFields <= 4 ? 2 : 3;

  // ── SVG icons ────────────────────────────────────────────────────────────────
  const icons = {
    name:    <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M3.333 17c0-3.682 3-5 6.667-5 3.667 0 6.667 1.318 6.667 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    email:   <svg viewBox="0 0 20 20" fill="none"><path d="M2.5 5.833A1.667 1.667 0 014.167 4.167h11.666A1.667 1.667 0 0117.5 5.833v8.334A1.667 1.667 0 0115.833 15.833H4.167A1.667 1.667 0 012.5 14.167V5.833Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M2.5 6.667l7.5 5 7.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    lock:    <svg viewBox="0 0 20 20" fill="none"><rect x="3.333" y="9.167" width="13.333" height="9.167" rx="1.667" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M6.667 9.167V6.667a3.333 3.333 0 016.666 0v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="10" cy="13.75" r="1.25" fill="currentColor"/></svg>,
    phone:   <svg viewBox="0 0 20 20" fill="none"><path d="M4.167 2.5h3.75l1.25 3.75-2.292 1.458c.923 1.943 2.424 3.444 4.375 4.375l1.458-2.291 3.75 1.25v3.75c0 .92-.747 1.666-1.667 1.666C6.39 16.458 3.542 10.278 3.542 5c0-.92.746-1.667 1.666-1.667Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
    address: <svg viewBox="0 0 20 20" fill="none"><path d="M10 2.5c-3.125 0-5.417 2.292-5.417 5.208 0 3.75 5.417 9.792 5.417 9.792s5.417-6.042 5.417-9.792C15.417 4.792 13.125 2.5 10 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="10" cy="7.5" r="1.667" stroke="currentColor" strokeWidth="1.5"/></svg>,
  };

  return (
    <div className="reg-root">
      <div className="reg-glow reg-glow--tr" aria-hidden="true" />
      <div className="reg-glow reg-glow--bl" aria-hidden="true" />

      <main className="reg-card" role="main">
        {success ? (
          <SuccessScreen name={successName} onGoLogin={() => navigate('/login')} />
        ) : (
          <>
            {/* ── Brand ── */}
            <header className="reg-brand">
              <div className="reg-brand__icon" aria-hidden="true">
                <svg viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="12" fill="url(#regBG)"/>
                  <path d="M10 28V15l10-7 10 7v13H24v-7h-8v7H10Z" fill="white" fillOpacity="0.95"/>
                  <defs>
                    <linearGradient id="regBG" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6C63FF"/><stop offset="1" stopColor="#3B82F6"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h1 className="reg-brand__name">Create Account</h1>
              <p className="reg-brand__tagline">Join MyBank — takes less than a minute</p>
            </header>

            {/* ── Progress ── */}
            <div className="reg-steps" aria-label="Registration progress" role="list">
              <StepDot label="Personal" active={currentStep >= 1} done={currentStep > 1} />
              <div className="reg-steps__line" aria-hidden="true" />
              <StepDot label="Security" active={currentStep >= 2} done={currentStep > 2} />
              <div className="reg-steps__line" aria-hidden="true" />
              <StepDot label="Contact"  active={currentStep >= 3} done={currentStep > 3} />
            </div>

            {/* ── Form ── */}
            <form id="register-form" className="reg-form" onSubmit={handleSubmit} noValidate aria-label="Registration form">

              {serverError && (
                <div className="reg-alert reg-alert--error" role="alert" aria-live="polite">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width="16" height="16">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  {serverError}
                </div>
              )}

              <div className="reg-grid">

                {/* ── Full Name ── */}
                <div className={`reg-field${errors.name ? ' reg-field--error' : ''}`}>
                  <label htmlFor="reg-name" className="reg-label">Full Name</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon" aria-hidden="true">{icons.name}</span>
                    <input id="reg-name" type="text" name="fullName" className="reg-input"
                      placeholder="Jane Doe" value={form.fullName} onChange={handleChange}
                      autoComplete="name" aria-invalid={!!errors.fullName} disabled={loading} />
                  </div>
                  {errors.fullName && <span className="reg-error-msg" role="alert">{errors.fullName}</span>}
                </div>

                {/* ── Email ── */}
                <div className={`reg-field${errors.email ? ' reg-field--error' : ''}`}>
                  <label htmlFor="reg-email" className="reg-label">Email Address</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon" aria-hidden="true">{icons.email}</span>
                    <input id="reg-email" type="email" name="email" className="reg-input"
                      placeholder="you@example.com" value={form.email} onChange={handleChange}
                      autoComplete="email" aria-invalid={!!errors.email} disabled={loading} />
                  </div>
                  {errors.email && <span className="reg-error-msg" role="alert">{errors.email}</span>}
                </div>

                {/* ── Password ── */}
                <div className={`reg-field${errors.password ? ' reg-field--error' : ''}`}>
                  <label htmlFor="reg-password" className="reg-label">Password</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon" aria-hidden="true">{icons.lock}</span>
                    <input id="reg-password" type={showPw ? 'text' : 'password'} name="password"
                      className="reg-input" placeholder="Min. 8 characters"
                      value={form.password} onChange={handleChange}
                      autoComplete="new-password" aria-invalid={!!errors.password} disabled={loading} />
                    <EyeBtn show={showPw} onToggle={() => setShowPw(v => !v)} disabled={loading} />
                  </div>
                  {form.password && (
                    <div className="reg-strength">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="reg-strength__bar"
                          style={{ background: i <= pwStrength ? strengthColors[pwStrength] : undefined }} />
                      ))}
                      <span className="reg-strength__label" style={{ color: strengthColors[pwStrength] }}>
                        {strengthLabels[pwStrength]}
                      </span>
                    </div>
                  )}
                  {!form.password && (
                    <span className="reg-hint">8+ chars, uppercase, number &amp; symbol</span>
                  )}
                  {errors.password && <span className="reg-error-msg" role="alert">{errors.password}</span>}
                </div>

                {/* ── Confirm Password ── */}
                <div className={`reg-field${errors.confirmPassword ? ' reg-field--error' : ''}`}>
                  <label htmlFor="reg-confirm-password" className="reg-label">Confirm Password</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon" aria-hidden="true">{icons.lock}</span>
                    <input id="reg-confirm-password" type={showCpw ? 'text' : 'password'} name="confirmPassword"
                      className="reg-input" placeholder="Repeat password"
                      value={form.confirmPassword} onChange={handleChange}
                      autoComplete="new-password" aria-invalid={!!errors.confirmPassword} disabled={loading} />
                    <EyeBtn show={showCpw} onToggle={() => setShowCpw(v => !v)} disabled={loading} />
                  </div>
                  {form.confirmPassword && form.password && (
                    <span className={`reg-match ${form.confirmPassword === form.password ? 'reg-match--ok' : 'reg-match--no'}`}>
                      {form.confirmPassword === form.password ? '✓ Passwords match' : '✗ Do not match'}
                    </span>
                  )}
                  {errors.confirmPassword && <span className="reg-error-msg" role="alert">{errors.confirmPassword}</span>}
                </div>

                {/* ── Phone ── */}
                <div className={`reg-field${errors.phone ? ' reg-field--error' : ''}`}>
                  <label htmlFor="reg-phone" className="reg-label">Phone Number</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon" aria-hidden="true">{icons.phone}</span>
                    <input id="reg-phone" type="tel" name="phone" className="reg-input"
                      placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange}
                      autoComplete="tel" aria-invalid={!!errors.phone} disabled={loading} />
                  </div>
                  {errors.phone && <span className="reg-error-msg" role="alert">{errors.phone}</span>}
                </div>

                {/* ── Address (full-width) ── */}
                <div className={`reg-field reg-field--full${errors.address ? ' reg-field--error' : ''}`}>
                  <label htmlFor="reg-address" className="reg-label">Address</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon reg-input-icon--top" aria-hidden="true">{icons.address}</span>
                    <textarea id="reg-address" name="address" className="reg-input reg-textarea"
                      placeholder="123 Main St, City, State, ZIP"
                      value={form.address} onChange={handleChange}
                      autoComplete="street-address" rows={3}
                      aria-invalid={!!errors.address} disabled={loading} />
                  </div>
                  {errors.address && <span className="reg-error-msg" role="alert">{errors.address}</span>}
                </div>

              </div>{/* /reg-grid */}

              <p className="reg-terms">
                By registering you agree to our{' '}
                <a href="#terms" className="reg-link">Terms of Service</a> and{' '}
                <a href="#privacy" className="reg-link">Privacy Policy</a>.
              </p>

              <button id="reg-submit-btn" type="submit" className="reg-btn" disabled={loading} aria-busy={loading}>
                {loading ? (
                  <><span className="reg-spinner" aria-hidden="true" /> Creating Account…</>
                ) : (
                  <>
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M10 3.333v13.334M3.333 10h13.334" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                    </svg>
                    Create Account
                  </>
                )}
              </button>
            </form>

            <p className="reg-signin">
              Already have an account?{' '}
              <Link to="/login" className="reg-link reg-link--bold" id="reg-signin-link">Sign In</Link>
            </p>
          </>
        )}
      </main>
    </div>
  );
}
