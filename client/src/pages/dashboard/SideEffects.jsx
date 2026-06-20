import { useState, useEffect } from "react";
import { getSideEffectsAPI, logSideEffectAPI, deleteSideEffectAPI } from "../../api/sideEffectAPI";

const severityColor = (s) =>
  s === "Mild"     ? { bg: "#dcfce7", color: "#166534" } :
  s === "Moderate" ? { bg: "#fef3c7", color: "#92400e" } :
                     { bg: "#fee2e2", color: "#991b1b" };

export default function SideEffects({ meds }) {
  const [list, setList]         = useState([]);
  const [newEffect, setNewEffect] = useState({ med: "", effect: "", severity: "Mild" });
  const [loading, setLoading]   = useState(false);

  const inputStyle = {
    width:        "100%",
    border:       "2px solid #d1e9e7",
    borderRadius: "14px",
    padding:      "14px 18px",
    fontSize:     "15px",
    outline:      "none",
    fontFamily:   "inherit",
    color:        "#0f4a47",
    background:   "#f8fffe",
    boxSizing:    "border-box",
  };

  const labelStyle = {
    fontSize:      "14px",
    fontWeight:    "700",
    color:         "#0f4a47",
    display:       "block",
    marginBottom:  "8px",
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await getSideEffectsAPI();
        setList(res.data);
      } catch (err) {
        console.error("Failed to fetch side effects:", err);
      }
    };
    fetchList();
  }, []);

  const save = async () => {
    if (!newEffect.med || !newEffect.effect) return;
    setLoading(true);
    try {
      const res = await logSideEffectAPI(newEffect);
      setList(prev => [res.data, ...prev]);
      setNewEffect({ med: "", effect: "", severity: "Mild" });
    } catch (err) {
      console.error("Failed to log side effect:", err);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    try {
      await deleteSideEffectAPI(id);
      setList(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error("Failed to delete side effect:", err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* ── Add form ── */}
      <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#fff4ed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>⚡</div>
          <div>
            <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0f4a47", margin: 0 }}>Log a Side Effect</h2>
            <p style={{ fontSize: "12px", color: "#6b9e9a", marginTop: "2px" }}>Record any symptoms or reactions</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Medication */}
          <div>
            <label style={labelStyle}>Which Medication?</label>
            <select
              value={newEffect.med}
              onChange={e => setNewEffect(p => ({ ...p, med: e.target.value }))}
              style={{ ...inputStyle, appearance: "auto" }}
            >
              <option value="">Select a medication</option>
              {meds.map(m => (
                <option key={m._id || m.id} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Effect */}
          <div>
            <label style={labelStyle}>What did you feel?</label>
            <input
              type="text"
              placeholder="e.g. Nausea, Dizziness, Headache"
              value={newEffect.effect}
              onChange={e => setNewEffect(p => ({ ...p, effect: e.target.value }))}
              style={inputStyle}
            />
          </div>

          {/* Severity */}
          <div>
            <label style={labelStyle}>How severe was it?</label>
            <div style={{ display: "flex", gap: "10px" }}>
              {["Mild", "Moderate", "Severe"].map(s => {
                const sc     = severityColor(s);
                const active = newEffect.severity === s;
                return (
                  <button
                    key={s}
                    onClick={() => setNewEffect(p => ({ ...p, severity: s }))}
                    style={{ flex: 1, padding: "14px 8px", borderRadius: "14px", border: `3px solid ${active ? sc.color : "transparent"}`, background: sc.bg, color: sc.color, fontFamily: "inherit", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.15s" }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px", marginTop: "24px", maxWidth: "400px" }}>
          <button
            onClick={() => setNewEffect({ med: "", effect: "", severity: "Mild" })}
            style={{ flex: 1, padding: "13px", borderRadius: "12px", border: "2px solid #d1e9e7", background: "#fff", fontSize: "14px", fontWeight: "700", color: "#6b9e9a", fontFamily: "inherit", cursor: "pointer" }}
          >
            Clear
          </button>
          <button
            onClick={save}
            disabled={loading}
            style={{ flex: 2, padding: "13px", borderRadius: "12px", border: "none", background: loading ? "#b2d8d5" : "#f97316", fontSize: "14px", fontWeight: "700", color: "#fff", fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Saving..." : "⚡ Save Side Effect"}
          </button>
        </div>
      </div>

      {/* ── Logged side effects list ── */}
      <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📋</div>
          <div>
            <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0f4a47", margin: 0 }}>Logged Side Effects</h2>
            <p style={{ fontSize: "12px", color: "#6b9e9a", marginTop: "2px" }}>{list.length} effect{list.length !== 1 ? "s" : ""} recorded</p>
          </div>
        </div>

        {list.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#9bbcba" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚡</div>
            <div style={{ fontSize: "14px", fontWeight: "600" }}>No side effects logged yet</div>
            <div style={{ fontSize: "13px", marginTop: "6px" }}>Use the form above to log a symptom.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {list.map(se => {
              const sc = severityColor(se.severity);
              return (
                <div
                  key={se._id}
                  style={{ background: "#f8fffe", borderRadius: "18px", padding: "16px", border: "1.5px solid #e6f7f5" }}
                >
                  {/* Top row: icon + text */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#fff4ed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                      ⚡
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "15px", fontWeight: "800", color: "#0f4a47" }}>{se.effect}</div>
                      <div style={{ fontSize: "13px", color: "#6b9e9a", marginTop: "3px" }}>
                        {se.med} · {new Date(se.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </div>
                  </div>

                  {/* Bottom row: severity badge + delete */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ padding: "7px 16px", borderRadius: "99px", fontSize: "13px", fontWeight: "700", background: sc.bg, color: sc.color }}>
                      {se.severity}
                    </span>
                    <button
                      onClick={() => remove(se._id)}
                      style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1.5px solid #fecaca", background: "#fff5f5", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
