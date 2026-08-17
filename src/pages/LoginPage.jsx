import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postJson, getJson, setToken, setUser, ApiError } from "../api/client";
import Navbar from "../components/Navbar";
import "./LoginPage.css";

const INITIAL_FORM = { mobileNumber: "", password: "" };

export default function LoginPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(null);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBanner(null);
    if (!e.target.reportValidity()) return;

    setSubmitting(true);
    try {
      const data = await postJson("/v1/authenticate", form);
      setToken(data.tokenId);
      const user = await getJson("/v1/user/find/logged-in");
      setUser(user);
      navigate("/");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Sign in failed. Please try again.";
      setBanner({ kind: "error", message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="login-wrap">
        <div className="login-card">
          <header className="login-header">
            <div className="login-logo">🏃</div>
            <h1>Welcome Back</h1>
            <p>Sign in with your mobile number to continue</p>
          </header>

          {banner && <div className={`banner ${banner.kind}`}>{banner.message}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="mobileNumber">Mobile Number</label>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                inputMode="numeric"
                placeholder="98XXXXXXXX"
                pattern="9\d{9}"
                title="Enter a 10-digit mobile number starting with 9"
                value={form.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="login-footer">
            New to FahhKit? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </>
  );
}
