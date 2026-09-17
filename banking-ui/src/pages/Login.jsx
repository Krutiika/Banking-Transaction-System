import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginApi } from "../services/api";

// ─── Validation ───────────────────────────────────────────────────────────────
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validatePassword(password) {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return "";
}

// ─── Login Page ───────────────────────────────────────────────────────────────
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Field change ────────────────────────────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on edit
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  }

  // ── Validate all fields ─────────────────────────────────────────────────────
  function validate() {
    const next = {};
    if (!validateEmail(form.email))
      next.email = "Please enter a valid email address.";
    const pwErr = validatePassword(form.password);
    if (pwErr) next.password = pwErr;
    return next;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setServerError("");
    try {
      const { token, user } = await loginApi(form.email, form.password);
      login(token, user);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="login-root">
      {/* Ambient background glows */}
      <div className="login-glow login-glow--top" aria-hidden="true" />
      <div className="login-glow login-glow--bottom" aria-hidden="true" />

      <main className="login-card" role="main">
        {/* ── Brand ── */}
        <header className="login-brand">
          <div className="login-brand__icon" aria-hidden="true">
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="12" fill="url(#brandGrad)" />
              <path
                d="M10 28V15l10-7 10 7v13H24v-7h-8v7H10Z"
                fill="white"
                fillOpacity="0.95"
              />
              <defs>
                <linearGradient
                  id="brandGrad"
                  x1="0"
                  y1="0"
                  x2="40"
                  y2="40"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#6C63FF" />
                  <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="login-brand__name">MyBank</h1>
          <p className="login-brand__tagline">Secure &amp; Smarter Banking</p>
        </header>

        {/* ── Form ── */}
        <form
          id="login-form"
          className="login-form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Login form"
        >
          {/* Server error banner */}
          {serverError && (
            <div
              className="login-alert login-alert--error"
              role="alert"
              aria-live="polite"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {serverError}
            </div>
          )}

          {/* Email */}
          <div
            className={`login-field${errors.email ? " login-field--error" : ""}`}
          >
            <label htmlFor="login-email" className="login-label">
              Email
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 5.833A1.667 1.667 0 014.167 4.167h11.666A1.667 1.667 0 0117.5 5.833v8.334A1.667 1.667 0 0115.833 15.833H4.167A1.667 1.667 0 012.5 14.167V5.833Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.5 6.667l7.5 5 7.5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                id="login-email"
                type="email"
                name="email"
                className="login-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={!!errors.email}
                disabled={loading}
              />
            </div>
            {errors.email && (
              <span id="email-error" className="login-error-msg" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div
            className={`login-field${errors.password ? " login-field--error" : ""}`}
          >
            <label htmlFor="login-password" className="login-label">
              Password
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3.333"
                    y="9.167"
                    width="13.333"
                    height="9.167"
                    rx="1.667"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.667 9.167V6.667a3.333 3.333 0 016.666 0v2.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="10" cy="13.75" r="1.25" fill="currentColor" />
                </svg>
              </span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                className="login-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                aria-invalid={!!errors.password}
                disabled={loading}
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
                disabled={loading}
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 10s2.5-5 7.5-5 7.5 5 7.5 5-2.5 5-7.5 5-7.5-5-7.5-5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3 3l14 14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 10s2.5-5 7.5-5 7.5 5 7.5 5-2.5 5-7.5 5-7.5-5-7.5-5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <span
                id="password-error"
                className="login-error-msg"
                role="alert"
              >
                {errors.password}
              </span>
            )}
          </div>

          {/* Forgot password */}
          <div className="login-forgot">
            <a href="#forgot" className="login-link" tabIndex={0}>
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            className="login-btn"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="login-spinner" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3.333 10h13.334M11.667 5L17 10l-5.333 5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Sign In
              </>
            )}
          </button>
        </form>

        {/* ── Divider ── */}
        <div className="login-divider" aria-hidden="true">
          <span />
          <small>or</small>
          <span />
        </div>

        {/* ── Create account ── */}
        <p className="login-signup">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="login-link login-link--bold"
            id="login-create-account"
          >
            Create New Account
          </a>
        </p>

        {/* ── Trust badges ── */}
        <footer className="login-trust">
          <span className="login-trust__badge">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 1.333L2 4v4c0 3.333 2.667 5.333 6 6.667 3.333-1.334 6-3.334 6-6.667V4L8 1.333Z"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
              <path
                d="M5.333 8l2 2 3.334-3.333"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            256-bit SSL
          </span>
          <span className="login-trust__badge">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle
                cx="8"
                cy="8"
                r="5.667"
                stroke="currentColor"
                strokeWidth="1.25"
              />
              <path
                d="M8 5.333v3.334l2 2"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            24/7 Support
          </span>
          <span className="login-trust__badge">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect
                x="1.333"
                y="5.333"
                width="13.333"
                height="9.333"
                rx="1.333"
                stroke="currentColor"
                strokeWidth="1.25"
              />
              <path
                d="M5.333 5.333V4a2.667 2.667 0 115.334 0v1.333"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
            </svg>
            FDIC Insured
          </span>
        </footer>
      </main>
    </div>
  );
}
