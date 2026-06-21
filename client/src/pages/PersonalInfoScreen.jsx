import { useState } from "react";
import { T } from "../constants/theme";
import { GENDERS } from "../constants/sampleData";
import { registerAPI } from "../api/authAPI";

function Icon({ d, size = 18, color = "currentColor", stroke = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1a1a2e", marginBottom: "7px" }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = (focused, error) => ({
  width: "100%", boxSizing: "border-box", padding: "13px 13px 13px 40px",
  border: `1.5px solid ${error ? "#ef4444" : focused ? T.teal : "#e8ecf0"}`,
  borderRadius: "12px", fontSize: "14px", fontFamily: "inherit",
  outline: "none", background: "#fafbfc", color: "#1a1a2e",
  boxShadow: focused ? `0 0 0 4px ${T.teal}18` : "none", transition: "all 0.18s",
});

function FInput({ label, type = "text", value, onChange, placeholder, error, iconD }) {
  const [focused, setFocused] = useState(false);
  return (
    <Field label={label}>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", display: "flex" }}>
          <Icon d={iconD} size={16} />
        </span>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={inputStyle(focused, error)} />
      </div>
      {error && <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#ef4444" }}>{error}</p>}
    </Field>
  );
}

const GENDER_ICONS = {
  "Male":             "M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z M5 22c0-4 3.1-7 7-7s7 3.1 7 7",
  "Female":           "M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z M5 22c0-4 3.1-7 7-7s7 3.1 7 7 M12 17v5 M9 19h6",
  "Non-binary":       "M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z M12 17v5",
  "Prefer not to say":"M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z M5 22c0-4 3.1-7 7-7s7 3.1 7 7",
};

export default function PersonalInfoScreen({ email, password, onComplete }) {
  const [form, setForm]       = useState({ firstName: "", lastName: "", age: "", gender: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const set  = (k) => (v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };
  const setE = (k) => (e) => set(k)(e.target.value);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required.";
    if (!form.lastName.trim())  e.lastName  = "Required.";
    const a = parseInt(form.age);
    if (!form.age || isNaN(a) || a < 1 || a > 120) e.age = "Enter a valid age.";
    if (!form.gender) e.gender = "Please select a gender.";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const res = await registerAPI({ firstName: form.firstName, lastName: form.lastName, email, password, age: Number(form.age), gender: form.gender });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user",  JSON.stringify(res.user));
      onComplete({ ...form, email, userData: res.user });
    } catch (err) {
      setErrors({ firstName: err.response?.data?.message || "Registration failed." });
    } finally { setLoading(false); }
  };

  const initials = ((form.firstName[0] || "") + (form.lastName[0] || "")).toUpperCase() || "?";

  const STEPS = ["Account", "Profile", "Done"];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <div style={{ background: "#fff", borderRadius: "28px", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.10)" }}>

          {/* Header bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280" }}>
              <Icon d="M19 12H5 M12 5l-7 7 7 7" size={20} />
            </div>

            {/* Logo center */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: T.teal, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              <span style={{ fontSize: "16px", fontWeight: "800", color: "#1a1a2e" }}>MediTrack</span>
            </div>

            {/* Step dots */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div style={{ width: i < 2 ? "22px" : "22px", height: "22px", borderRadius: "50%", background: i < 2 ? T.teal : "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {i < 2
                      ? <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      : <span style={{ fontSize: "10px", fontWeight: "700", color: "#9ca3af" }}>3</span>
                    }
                  </div>
                  {i < STEPS.length - 1 && <div style={{ width: "14px", height: "2px", background: i < 1 ? T.teal : "#e5e7eb" }} />}
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: "28px 28px 32px" }}>

            {/* Avatar */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ position: "relative", marginBottom: "14px" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: `linear-gradient(135deg, ${T.teal}, ${T.tealDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "800", color: "#fff" }}>
                  {initials}
                </div>
                <div style={{ position: "absolute", bottom: "2px", right: "2px", width: "24px", height: "24px", borderRadius: "50%", background: "#fff", border: `2px solid ${T.teal}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={11} color={T.teal} />
                </div>
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#1a1a2e", margin: "0 0 4px", textAlign: "center" }}>Tell us about yourself</h2>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, textAlign: "center" }}>This information helps us personalize your experience.</p>
            </div>

            {/* Section label */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" size={16} color={T.teal} />
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#1a1a2e" }}>Personal Information</span>
            </div>
            <div style={{ height: "1px", background: "#f3f4f6", marginBottom: "18px" }} />

            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <FInput label="First name" value={form.firstName} onChange={setE("firstName")} placeholder="John" error={errors.firstName} iconD="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
              <FInput label="Last name"  value={form.lastName}  onChange={setE("lastName")}  placeholder="Doe"  error={errors.lastName}  iconD="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
            </div>

            <FInput label="Age" type="number" value={form.age} onChange={setE("age")} placeholder="35" error={errors.age}
              iconD="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />

            {/* Gender */}
            <Field label="Gender">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {["Male","Female","Other"].map(g => {
                  const active = form.gender === g || (g === "Other" && !["Male","Female"].includes(form.gender) && form.gender !== "");
                  const sel    = g === "Other" ? (form.gender !== "Male" && form.gender !== "Female" ? form.gender : "") : g;
                  return (
                    <button key={g}
                      onClick={() => { set("gender")(g === "Other" ? "Non-binary" : g); setErrors(p => ({ ...p, gender: "" })); }}
                      style={{ padding: "16px 8px", border: `2px solid ${active ? T.teal : "#e8ecf0"}`, borderRadius: "14px", background: active ? T.tealLight : "#fafbfc", cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", transition: "all 0.18s" }}>
                      <Icon d={GENDER_ICONS[g === "Other" ? "Non-binary" : g]} size={22} color={active ? T.teal : "#9ca3af"} stroke={1.8} />
                      <span style={{ fontSize: "12px", fontWeight: "700", color: active ? T.teal : "#6b7280" }}>{g}</span>
                    </button>
                  );
                })}
              </div>
              {errors.gender && <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#ef4444" }}>{errors.gender}</p>}
            </Field>

            <button onClick={submit} disabled={loading}
              style={{ width: "100%", padding: "15px", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: "700", fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer", background: loading ? "#b2d8d5" : T.teal, color: "#fff", boxShadow: loading ? "none" : "0 4px 18px rgba(15,155,142,0.38)", marginTop: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s" }}>
              <span />
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {loading && <span style={{ width: "16px", height: "16px", border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />}
                Complete Registration
              </span>
              <Icon d="M5 12h14 M12 5l7 7-7 7" size={18} color="#fff" />
            </button>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "14px" }}>
              <Icon d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4" size={13} color="#9ca3af" />
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>Your data is secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
