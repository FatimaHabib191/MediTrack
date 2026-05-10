import { useState, useEffect } from "react";
import { sendReminderCodeAPI, verifyReminderCodeAPI, updateReminderEmailAPI } from "../../api/reminderEmailAPI";

const T = {
  teal:      "#0f9b8e",
  tealDark:  "#0a7a6e",
  tealLight: "#e6f7f5",
  bg:        "#f0fafa",
  white:     "#ffffff",
  text:      "#0f4a47",
  muted:     "#6b9e9a",
  border:    "#d1e9e7",
};

const Btn = ({ onClick, disabled, variant = "primary", children, style = {} }) => {
  const base = {
    padding: "11px 16px", borderRadius: "12px", border: "none",
    fontWeight: "700", fontSize: "13px", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit", transition: "background 0.15s", flexShrink: 0,
    whiteSpace: "nowrap", ...style,
  };
  const variants = {
    primary: { background: disabled ? "#e2e8f0" : T.teal, color: disabled ? T.muted : "#fff" },
    danger:  { background: "#fff5f5", color: "#ef4444", border: "1.5px solid #fecaca" },
    ghost:   { background: "transparent", color: T.muted, border: `1.5px solid ${T.border}` },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>{children}</button>;
};

export default function ReminderEmailCard({ user, onUserUpdate }) {
  const [step,      setStep]      = useState(user?.reminderEmail ? "active" : "idle");
  const [email,     setEmail]     = useState("");
  const [code,      setCode]      = useState("");
  const [loading,   setLoading]   = useState(false);
  const [status,    setStatus]    = useState(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    setStep(user?.reminderEmail ? "active" : "idle");
  }, [user?.reminderEmail]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const showStatus  = (type, msg) => setStatus({ type, msg });
  const clearStatus = () => setStatus(null);

  const handleSendCode = async () => {
    if (!email || !email.includes("@")) { showStatus("error", "Enter a valid email."); return; }
    setLoading(true); clearStatus();
    try {
      const res = await sendReminderCodeAPI(email);
      showStatus("success", res.message);
      setStep("entering_code");
      setCountdown(60);
    } catch (err) {
      showStatus("error", err?.response?.data?.message || "Failed to send code.");
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setLoading(true); clearStatus();
    try {
      const res = await sendReminderCodeAPI(email);
      showStatus("success", res.message);
      setCountdown(60);
    } catch (err) {
      showStatus("error", err?.response?.data?.message || "Failed to resend.");
    } finally { setLoading(false); }
  };

  const handleVerify = async () => {
    if (!code || code.length !== 6) { showStatus("error", "Enter the 6-digit code."); return; }
    setLoading(true); clearStatus();
    try {
      const res = await verifyReminderCodeAPI(email, code);
      onUserUpdate?.({ reminderEmail: res.reminderEmail });
      setStep("active");
      setCode("");
      showStatus("success", "Email verified and saved!");
    } catch (err) {
      showStatus("error", err?.response?.data?.message || "Verification failed.");
    } finally { setLoading(false); }
  };

  const handleRemove = async () => {
    setLoading(true); clearStatus();
    try {
      await updateReminderEmailAPI("");
      onUserUpdate?.({ reminderEmail: null });
      setStep("idle");
      setEmail(""); setCode("");
      showStatus("success", "Reminder email removed.");
    } catch (err) {
      showStatus("error", "Failed to remove.");
    } finally { setLoading(false); }
  };

  const isActive = step === "active";

  return (
    <div style={{
      background: T.white, borderRadius: "22px", padding: "22px 20px",
      border: `1.5px solid ${T.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      boxSizing: "border-box", width: "100%", overflow: "hidden",
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "14px", flexShrink: 0,
          background: isActive ? T.tealLight : "#f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
        }}>📧</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: "800", fontSize: "15px", color: T.text }}>Email Reminders</div>
          <div style={{ fontSize: "12px", color: T.muted, marginTop: "2px" }}>
            {isActive ? "Active" : "Off — add email for reminders"}
          </div>
        </div>
        <div style={{
          padding: "4px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "700",
          background: isActive ? T.tealLight : "#f1f5f9",
          color: isActive ? T.teal : T.muted, flexShrink: 0,
        }}>
          {isActive ? "● Active" : "○ Off"}
        </div>
      </div>

      {/* ── IDLE: enter email ── */}
      {step === "idle" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearStatus(); }}
            placeholder="Enter email for reminders…"
            onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
            style={{
              width: "100%", padding: "12px 14px", borderRadius: "12px",
              border: `1.5px solid ${T.border}`, background: T.bg,
              color: T.text, fontSize: "14px", fontFamily: "inherit",
              outline: "none", boxSizing: "border-box",
            }}
          />
          <Btn onClick={handleSendCode} disabled={loading || !email} style={{ width: "100%" }}>
            {loading ? "Sending…" : "Send Verification Code"}
          </Btn>
        </div>
      )}

      {/* ── ENTERING CODE: verify OTP ── */}
      {step === "entering_code" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Email being verified */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 14px", background: T.bg, borderRadius: "12px",
            border: `1.5px solid ${T.border}`, gap: "8px",
          }}>
            <div style={{ fontSize: "13px", color: T.text, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              📨 Code sent to <strong>{email}</strong>
            </div>
            <button
              onClick={() => { setStep("idle"); setCode(""); clearStatus(); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, fontSize: "12px", fontWeight: "600", flexShrink: 0 }}
            >
              Change
            </button>
          </div>

          {/* Code input */}
          <input
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); clearStatus(); }}
            placeholder="Enter 6-digit code"
            maxLength={6}
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            style={{
              width: "100%", padding: "14px", borderRadius: "12px",
              border: `1.5px solid ${T.border}`, background: T.bg,
              color: T.text, fontSize: "22px", fontFamily: "monospace",
              letterSpacing: "8px", fontWeight: "700",
              outline: "none", boxSizing: "border-box", textAlign: "center",
            }}
          />

          <Btn onClick={handleVerify} disabled={loading || code.length !== 6} style={{ width: "100%" }}>
            {loading ? "Verifying…" : "Verify Code"}
          </Btn>

          {/* Resend */}
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "13px", color: T.muted }}>Didn't receive it? </span>
            <button
              onClick={handleResend}
              disabled={countdown > 0 || loading}
              style={{
                background: "none", border: "none",
                cursor: countdown > 0 ? "not-allowed" : "pointer",
                color: countdown > 0 ? T.muted : T.teal,
                fontSize: "13px", fontWeight: "700", fontFamily: "inherit", padding: 0,
              }}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
            </button>
          </div>
        </div>
      )}

      {/* ── ACTIVE: email verified ── */}
      {step === "active" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Email display */}
          <div style={{
            padding: "12px 14px", borderRadius: "12px",
            border: `1.5px solid ${T.tealLight}`, background: T.tealLight,
            fontSize: "13px", color: T.teal, fontWeight: "600",
            display: "flex", alignItems: "center", gap: "8px",
            wordBreak: "break-all",
          }}>
            <span style={{ flexShrink: 0 }}>✅</span>
            <span>{user?.reminderEmail}</span>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "8px" }}>
            <Btn variant="danger" onClick={handleRemove} disabled={loading} style={{ flex: 1 }}>
              {loading ? "Removing…" : "Remove"}
            </Btn>
            <Btn variant="ghost" onClick={() => { setStep("idle"); setEmail(""); clearStatus(); }} disabled={loading} style={{ flex: 1 }}>
              Change
            </Btn>
          </div>
        </div>
      )}

      {/* Status message */}
      {status && (
        <div style={{
          marginTop: "12px", padding: "10px 14px", borderRadius: "10px",
          fontSize: "13px", fontWeight: "600",
          background: status.type === "success" ? T.tealLight : "#fee2e2",
          color:      status.type === "success" ? T.teal      : "#991b1b",
          wordBreak: "break-word",
        }}>
          {status.msg}
        </div>
      )}

      {/* Helper text */}
      {step !== "active" && (
        <p style={{ margin: "12px 0 0", fontSize: "12px", color: T.muted, lineHeight: "1.6" }}>
          A 6-digit code will be sent to verify ownership. Once verified, reminders will be sent at each medication's scheduled time.
        </p>
      )}
    </div>
  );
}
