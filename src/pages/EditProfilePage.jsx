import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJson, postJson, setUser, ApiError } from "../api/client";
import { COUNTRIES_SORTED } from "../constants/countries";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./EditProfilePage.css";

const INITIAL_FORM = {
  fullName: "",
  gender: "",
  birthDate: "",
  address: "",
  bloodGroup: "",
  occupation: "",
  nationality: "",
  country: "",
  city: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhone: "",
};

export default function EditProfilePage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [account, setAccount] = useState({ email: "", mobileNumber: "" });
  const [isAthlete, setIsAthlete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    getJson("/v1/user/find/logged-in")
      .then((data) => {
        setForm({
          fullName: data.fullName || "",
          gender: data.gender || "",
          birthDate: data.birthDate || "",
          address: data.address || "",
          bloodGroup: data.bloodGroup || "",
          occupation: data.occupation || "",
          nationality: data.nationality || "",
          country: data.country || "",
          city: data.city || "",
          emergencyContactName: data.emergencyContactName || "",
          emergencyContactRelationship: data.emergencyContactRelationship || "",
          emergencyContactPhone: data.emergencyContactPhone || "",
        });
        setAccount({ email: data.email || "", mobileNumber: data.mobileNumber || "" });
        setIsAthlete(data.userType === "ATHLETE");
      })
      .catch((err) => {
        const message = err instanceof ApiError ? err.message : "Could not load your profile. Please try again.";
        setBanner({ kind: "error", message });
      })
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBanner(null);
    if (!e.target.reportValidity()) return;

    const payload = Object.fromEntries(Object.entries(form).filter(([, value]) => value.trim() !== ""));

    setSubmitting(true);
    try {
      const updated = await postJson("/v1/user/edit-profile", payload);
      setUser(updated);
      setBanner({ kind: "success", message: "Profile updated successfully." });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not update your profile. Please try again.";
      setBanner({ kind: "error", message });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="edit-profile-page">
        <Navbar />
        <div className="edit-profile-wrap">
          <p className="edit-profile-loading">Loading your profile…</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <Navbar />
      <div className="edit-profile-wrap">
        <span className="blob auth-blob-a" aria-hidden="true" />
        <span className="blob auth-blob-b" aria-hidden="true" />
        <div className="edit-profile-inner">
        <header className="edit-profile-header" data-aos="fade-down">
          <h1>Edit Profile</h1>
          <p>Update your personal details</p>
        </header>

        {banner && <div className={`banner ${banner.kind}`}>{banner.message}</div>}

        <div className="glass-card edit-profile-account" data-aos="fade-up">
          <div className="field">
            <label>Email</label>
            <input type="text" value={account.email} disabled />
          </div>
          <div className="field">
            <label>Mobile Number</label>
            <input type="text" value={account.mobileNumber} disabled />
          </div>
          <div className="hint">Email and mobile number can&apos;t be changed here.</div>
        </div>

        <form className="glass-card" onSubmit={handleSubmit} noValidate data-aos="fade-up">
          <fieldset>
            <legend>Personal Details</legend>
            <div className="grid">
              <div className="field full">
                <label htmlFor="fullName">Full Name</label>
                <input id="fullName" name="fullName" type="text" value={form.fullName} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="gender">
                  Gender <span className="opt">(optional)</span>
                </label>
                <select id="gender" name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHERS">Others</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="birthDate">Date of Birth</label>
                <input id="birthDate" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} required />
              </div>
              <div className="field full">
                <label htmlFor="address">
                  Address <span className="opt">(optional)</span>
                </label>
                <input id="address" name="address" type="text" value={form.address} onChange={handleChange} />
              </div>
            </div>
          </fieldset>

          {isAthlete && (
            <>
              <fieldset>
                <legend>Location &amp; Background</legend>
                <div className="grid">
                  <div className="field">
                    <label htmlFor="country">
                      Country <span className="opt">(optional)</span>
                    </label>
                    <select id="country" name="country" value={form.country} onChange={handleChange}>
                      <option value="">Select country</option>
                      {COUNTRIES_SORTED.map(([code, label]) => (
                        <option key={code} value={code}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="city">
                      City <span className="opt">(optional)</span>
                    </label>
                    <input id="city" name="city" type="text" value={form.city} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label htmlFor="nationality">
                      Nationality <span className="opt">(optional)</span>
                    </label>
                    <input id="nationality" name="nationality" type="text" value={form.nationality} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label htmlFor="occupation">
                      Occupation <span className="opt">(optional)</span>
                    </label>
                    <input id="occupation" name="occupation" type="text" value={form.occupation} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label htmlFor="bloodGroup">
                      Blood Group <span className="opt">(optional)</span>
                    </label>
                    <input id="bloodGroup" name="bloodGroup" type="text" placeholder="e.g. O+" value={form.bloodGroup} onChange={handleChange} />
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>
                  Emergency Contact <span className="opt">(optional)</span>
                </legend>
                <div className="grid">
                  <div className="field">
                    <label htmlFor="emergencyContactName">Contact Name</label>
                    <input
                      id="emergencyContactName"
                      name="emergencyContactName"
                      type="text"
                      value={form.emergencyContactName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="emergencyContactRelationship">Relationship</label>
                    <input
                      id="emergencyContactRelationship"
                      name="emergencyContactRelationship"
                      type="text"
                      value={form.emergencyContactRelationship}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field full">
                    <label htmlFor="emergencyContactPhone">Contact Phone</label>
                    <input
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      type="tel"
                      value={form.emergencyContactPhone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </fieldset>
            </>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <p className="edit-profile-footer">
          <Link to="/">Back to home</Link>
        </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
