import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postForm, ApiError } from "../api/client";
import { COUNTRIES_SORTED } from "../constants/countries";
import Navbar from "../components/Navbar";
import "./RegisterPage.css";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  mobileNumber: "",
  password: "",
  gender: "",
  birthDate: "",
  address: "",
  country: "",
  city: "",
  nationality: "",
  occupation: "",
  bloodGroup: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhone: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [files, setFiles] = useState({ citizenshipFrontImage: null, citizenshipBackImage: null });
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(null); // { kind: "success" | "error", message }
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e) {
    const { name, files: fileList } = e.target;
    setFiles((prev) => ({ ...prev, [name]: fileList[0] || null }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBanner(null);

    if (!e.target.reportValidity()) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value.trim() !== "") formData.append(key, value);
    });
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    setSubmitting(true);
    try {
      const data = await postForm("/v1/athlete/signup", formData);
      setForm(INITIAL_FORM);
      setFiles({ citizenshipFrontImage: null, citizenshipBackImage: null });
      e.target.reset();
      navigate("/login", {
        state: { message: `Welcome to FahhKit, ${data?.fullName || "athlete"}! Your registration is complete — please sign in.` },
      });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Registration failed. Please try again.";
      setBanner({ kind: "error", message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="register-wrap">
      <header className="register-header">
        <img src="/logo.png" alt="FahhKit" className="register-logo" />
        <h1>Join FahhKit Run Club</h1>
        <p>Fill out the form below to register as an athlete</p>
      </header>

      {banner && <div className={`banner ${banner.kind}`}>{banner.message}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <fieldset>
          <legend>Personal Details</legend>
          <div className="grid">
            <div className="field full">
              <label htmlFor="fullName">Full Name</label>
              <input id="fullName" name="fullName" type="text" value={form.fullName} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="mobileNumber">Mobile Number</label>
              <input id="mobileNumber" name="mobileNumber" type="tel" value={form.mobileNumber} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="password">
                Password <span className="opt">(optional)</span>
              </label>
              <input id="password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} />
              <div className="hint">Leave blank and one will be generated for you.</div>
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

        <fieldset>
          <legend>Location &amp; Background</legend>
          <div className="grid">
            <div className="field">
              <label htmlFor="country">Country</label>
              <select id="country" name="country" value={form.country} onChange={handleChange} required>
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
              <label htmlFor="emergencyContactName">
                Contact Name <span className="opt">(optional)</span>
              </label>
              <input id="emergencyContactName" name="emergencyContactName" type="text" value={form.emergencyContactName} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="emergencyContactRelationship">
                Relationship <span className="opt">(optional)</span>
              </label>
              <input
                id="emergencyContactRelationship"
                name="emergencyContactRelationship"
                type="text"
                value={form.emergencyContactRelationship}
                onChange={handleChange}
              />
            </div>
            <div className="field full">
              <label htmlFor="emergencyContactPhone">
                Contact Phone <span className="opt">(optional)</span>
              </label>
              <input id="emergencyContactPhone" name="emergencyContactPhone" type="tel" value={form.emergencyContactPhone} onChange={handleChange} />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            Citizenship Documents <span className="opt">(optional)</span>
          </legend>
          <div className="grid">
            <div className="field">
              <label htmlFor="citizenshipFrontImage">Front Image</label>
              <input id="citizenshipFrontImage" name="citizenshipFrontImage" type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="field">
              <label htmlFor="citizenshipBackImage">Back Image</label>
              <input id="citizenshipBackImage" name="citizenshipBackImage" type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>
        </fieldset>

        <button type="submit" disabled={submitting}>
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="register-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
      </div>
    </>
  );
}
