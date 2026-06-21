import { useState } from "react";
import { T } from "../constants/theme";
import { loginAPI } from "../api/authAPI";

const isMobile = () => window.innerWidth < 768;

function Icon({ d, size = 18, color = "currentColor", stroke = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function Input({ label, type = "text", value, onChange, placeholder, error, icon, right }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
        <label style={{ fontSize: "13px", fontWeight: "600", color: "#1a1a2e" }}>{label}</label>
        {right}
      </div>
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", display: "flex" }}>
            {icon}
          </span>
        )}
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: icon ? "13px 14px 13px 40px" : "13px 14px",
            border: `1.5px solid ${error ? "#ef4444" : focused ? T.teal : "#e8ecf0"}`,
            borderRadius: "12px", fontSize: "14px", fontFamily: "inherit",
            outline: "none", background: "#fafbfc", color: "#1a1a2e",
            boxShadow: focused ? `0 0 0 4px ${T.teal}18` : "none",
            transition: "all 0.18s",
          }}
        />
        {right === undefined && type === "password" && (
          <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", cursor: "pointer", display: "flex" }}>
            <Icon d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" size={17} />
          </span>
        )}
      </div>
      {error && <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#ef4444" }}>{error}</p>}
    </div>
  );
}

export default function AuthScreen({ onAuth }) {
  const [mode, setMode]         = useState("login");
  const [form, setForm]         = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw]     = useState(false);

  const set = (k) => (e) => { setForm(p => ({ ...p, [k]: e.target.value })); setErrors(p => ({ ...p, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = "Enter a valid email.";
    if (form.password.length < 6)  e.password = "Minimum 6 characters.";
    if (mode === "signup" && form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match.";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await loginAPI({ email: form.email, password: form.password });
        localStorage.setItem("token", res.token);
        localStorage.setItem("user",  JSON.stringify(res.user));
        onAuth({ email: form.email, isSignup: false, userData: res.user });
      } else {
        onAuth({ email: form.email, password: form.password, isSignup: true });
      }
    } catch (err) {
      setErrors({ email: err.response?.data?.message || "Invalid credentials." });
    } finally { setLoading(false); }
  };

  const isSignup = mode === "signup";

  const wave = (
    <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", pointerEvents: "none" }}>
      <path d="M0,40 C80,80 160,0 240,40 C320,80 380,20 400,40 L400,80 L0,80 Z" fill={T.tealLight} opacity="0.8"/>
      <path d="M0,55 C60,30 140,70 220,50 C300,30 360,65 400,55 L400,80 L0,80 Z" fill={T.tealLight} opacity="0.5"/>
    </svg>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: "28px", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.10)", position: "relative" }}>

          {/* Top section */}
          <div style={{ padding: "36px 32px 28px", position: "relative", minHeight: "120px" }}>
            {/* Plus signs decoration */}
            {[[16,16],[340,20],[30,85],[360,90]].map(([x,y],i) => (
              <span key={i} style={{ position: "absolute", left: x, top: y, fontSize: "16px", color: T.tealLight, fontWeight: "300", lineHeight: 1 }}>+</span>
            ))}

            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: T.teal, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#1a1a2e", letterSpacing: "-0.5px" }}>MediTrack</div>
                <div style={{ fontSize: "12px", color: T.muted, marginTop: "1px" }}>Track. Schedule. Stay Healthy.</div>
              </div>
            </div>
            {wave}
          </div>

          {/* Form section */}
          <div style={{ padding: "24px 32px 32px" }}>

            {/* Tab toggle */}
            <div style={{ display: "flex", background: "#f0f2f5", borderRadius: "14px", padding: "4px", marginBottom: "24px" }}>
              {[["login","Sign In"],["signup","Create Account"]].map(([m, label]) => (
                <button key={m} onClick={() => { setMode(m); setErrors({}); setForm({ email:"", password:"", confirmPassword:"" }); }}
                  style={{ flex: 1, padding: "11px 8px", border: "none", borderRadius: "11px", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", fontWeight: "700", background: mode === m ? T.teal : "transparent", color: mode === m ? "#fff" : "#6b7280", boxShadow: mode === m ? "0 2px 8px rgba(15,155,142,0.3)" : "none", transition: "all 0.2s" }}>
                  {label}
                </button>
              ))}
            </div>

            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#1a1a2e", margin: "0 0 4px" }}>
              {isSignup ? "Create account" : "Welcome back"}
            </h2>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 22px" }}>
              {isSignup ? "Sign up to start tracking your health." : "Sign in to continue to your dashboard"}
            </p>

            <div style={{ marginBottom: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#1a1a2e", display: "block", marginBottom: "7px" }}>Email address</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", display: "flex" }}>
                  <Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" size={17} />
                </span>
                <input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com"
                  style={{ width: "100%", boxSizing: "border-box", padding: "13px 14px 13px 40px", border: `1.5px solid ${errors.email ? "#ef4444" : "#e8ecf0"}`, borderRadius: "12px", fontSize: "14px", fontFamily: "inherit", outline: "none", background: "#fafbfc", color: "#1a1a2e" }} />
              </div>
              {errors.email && <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#ef4444" }}>{errors.email}</p>}
            </div>

            <div style={{ marginBottom: "6px", marginTop: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#1a1a2e" }}>Password</label>
                {!isSignup && <span style={{ fontSize: "12px", color: T.teal, fontWeight: "600", cursor: "pointer" }}>Forgot password?</span>}
              </div>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", display: "flex" }}>
                  <Icon d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4" size={17} />
                </span>
                <input type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="Enter your password"
                  style={{ width: "100%", boxSizing: "border-box", padding: "13px 40px 13px 40px", border: `1.5px solid ${errors.password ? "#ef4444" : "#e8ecf0"}`, borderRadius: "12px", fontSize: "14px", fontFamily: "inherit", outline: "none", background: "#fafbfc", color: "#1a1a2e" }} />
                <span onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", cursor: "pointer", display: "flex" }}>
                  <Icon d={showPw ? "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24 M1 1l22 22" : "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"} size={17} />
                </span>
              </div>
              {errors.password && <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#ef4444" }}>{errors.password}</p>}
            </div>

            {isSignup && (
              <div style={{ marginTop: "14px", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#1a1a2e", display: "block", marginBottom: "7px" }}>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", display: "flex" }}>
                    <Icon d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4" size={17} />
                  </span>
                  <input type="password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Re-enter password"
                    style={{ width: "100%", boxSizing: "border-box", padding: "13px 14px 13px 40px", border: `1.5px solid ${errors.confirmPassword ? "#ef4444" : "#e8ecf0"}`, borderRadius: "12px", fontSize: "14px", fontFamily: "inherit", outline: "none", background: "#fafbfc", color: "#1a1a2e" }} />
                </div>
                {errors.confirmPassword && <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#ef4444" }}>{errors.confirmPassword}</p>}
              </div>
            )}

            {!isSignup && (
              <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px", cursor: "pointer" }}>
                <div onClick={() => setRemember(p => !p)}
                  style={{ width: "18px", height: "18px", borderRadius: "5px", border: `2px solid ${remember ? T.teal : "#d1d5db"}`, background: remember ? T.teal : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                  {remember && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontSize: "13px", color: "#4b5563", fontWeight: "500" }}>Remember me</span>
              </label>
            )}

            <button onClick={submit} disabled={loading}
              style={{ width: "100%", padding: "15px", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: "700", fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer", background: loading ? "#b2d8d5" : T.teal, color: "#fff", boxShadow: loading ? "none" : "0 4px 18px rgba(15,155,142,0.38)", marginTop: "20px", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              {loading && <span style={{ width: "16px", height: "16px", border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />}
              {isSignup ? "Create Account" : "Sign In"}
            </button>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#6b7280", marginTop: "18px" }}>
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <span onClick={() => { setMode(isSignup ? "login" : "signup"); setErrors({}); }} style={{ color: T.teal, fontWeight: "700", cursor: "pointer" }}>
                {isSignup ? "Sign In" : "Create Account"}
              </span>
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
