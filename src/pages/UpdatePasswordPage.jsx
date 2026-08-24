import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { postJson, setToken, clearToken, ApiError } from "../api/client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./UpdatePasswordPage.css";

export default function UpdatePasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    mobileNumber: location.state?.mobileNumber || "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(location.state?.message ? { kind: "success", message: location.state.message } : null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBanner(null);
    if (!e.target.reportValidity()) return;

    if (form.newPassword !== form.confirmNewPassword) {
      setBanner({ kind: "error", message: "New password and confirmation do not match." });
      return;
    }

    setSubmitting(true);
    try {
      const auth = await postJson("/v1/authenticate", { mobileNumber: form.mobileNumber, password: form.oldPassword });
      setToken(auth.tokenId);
      await postJson("/v1/user/change-password", { oldPassword: form.oldPassword, newPassword: form.newPassword });
      clearToken();
      navigate("/login", {
        state: { message: "Password updated successfully! Please sign in with your new password." },
      });
    } catch (err) {
      clearToken();
      const message = err instanceof ApiError ? err.message : "Could not update password. Please try again.";
      setBanner({ kind: "error", message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="update-password-wrap">
        <span className="blob auth-blob-a" aria-hidden="true" />
        <span className="blob auth-blob-b" aria-hidden="true" />
        <div className="update-password-card glass-card" data-aos="fade-up">
          <header className="update-password-header">
            <div className="update-password-logo">🔒</div>
            <h1>Set Your Password</h1>
            <p>Enter the password we emailed you, then choose a new one</p>
          </header>

          {banner && <div className={`banner ${banner.kind}`}>{banner.message}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="mobileNumber">Mobile Number or Email</label>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="text"
                autoComplete="username"
                placeholder="98XXXXXXXX or you@example.com"
                value={form.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="oldPassword">Emailed Password</label>
              <input
                id="oldPassword"
                name="oldPassword"
                type="password"
                autoComplete="current-password"
                value={form.oldPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                value={form.newPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="confirmNewPassword">Confirm New Password</label>
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                autoComplete="new-password"
                value={form.confirmNewPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Updating..." : "Update Password"}
            </button>
          </form>

          <p className="update-password-footer">
            <Link to="/login">Back to sign in</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
