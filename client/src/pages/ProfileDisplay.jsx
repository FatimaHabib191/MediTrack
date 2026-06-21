import { T } from "../constants/theme";

function Icon({ d, size = 18, color = "currentColor", stroke = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function ProfileDisplay({ user, onEnterApp }) {
  const initials = ((user.firstName[0] || "") + (user.lastName[0] || "")).toUpperCase();
  const genderIconD = user.gender === "Male"
    ? "M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z M5 22c0-4 3.1-7 7-7s7 3.1 7 7"
    : user.gender === "Female"
    ? "M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z M5 22c0-4 3.1-7 7-7s7 3.1 7 7 M12 17v5 M9 19h6"
    : "M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z M12 17v5";

  const infoCards = [
    { iconD: genderIconD, label: user.gender },
    { iconD: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z", label: `Age ${user.age}` },
    { iconD: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Active" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ background: "#fff", borderRadius: "28px", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.10)" }}>

          {/* Teal banner */}
          <div style={{ background: `linear-gradient(140deg, ${T.tealDark} 0%, ${T.teal} 100%)`, padding: "36px 28px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            {/* Decorative plus signs */}
            {[[30,20],[300,14],[16,80],[320,70],[160,10]].map(([x,y],i) => (
              <span key={i} style={{ position: "absolute", left: x, top: y, fontSize: "18px", color: "rgba(255,255,255,0.15)", fontWeight: "300" }}>+</span>
            ))}
            {/* Confetti dots */}
            {[["#f59e0b",60,30],["#a78bfa",80,50],["#f472b6",240,28],["#34d399",260,50],["#60a5fa",180,18],["#fb923c",140,45]].map(([c,x,y],i) => (
              <div key={i} style={{ position: "absolute", left: x, top: y, width: "8px", height: "8px", borderRadius: i%2===0 ? "2px" : "50%", background: c, transform: `rotate(${i*30}deg)` }} />
            ))}

            {/* Check circle */}
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke={T.teal} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#fff", margin: "0 0 6px" }}>You're all set!</h2>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", margin: 0 }}>Here's your profile summary</p>
          </div>

          {/* White card overlapping */}
          <div style={{ margin: "-28px 16px 0", background: "#fff", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", padding: "24px 20px 20px", position: "relative", zIndex: 1 }}>
            {/* Avatar */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ width: "68px", height: "68px", borderRadius: "18px", background: `linear-gradient(135deg, ${T.teal}, ${T.tealDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "800", color: "#fff", marginBottom: "12px" }}>
                {initials}
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#1a1a2e", margin: "0 0 3px" }}>{user.firstName} {user.lastName}</h3>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 14px" }}>{user.email}</p>

              {/* Info pills */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                {infoCards.map(({ iconD, label }, i) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", padding: "10px 16px", borderRadius: "12px", border: `1.5px solid ${i === 2 ? "#dcfce7" : "#f3f4f6"}`, background: i === 2 ? "#f0fdf4" : "#fafbfc", minWidth: "70px" }}>
                    <Icon d={iconD} size={18} color={i === 2 ? "#16a34a" : T.teal} stroke={1.8} />
                    <span style={{ fontSize: "12px", fontWeight: "700", color: i === 2 ? "#16a34a" : "#1a1a2e" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: "1px", background: "#f3f4f6", margin: "16px 0" }} />

            {/* Active message */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px", background: "#f0fdf4", borderRadius: "14px", border: "1.5px solid #dcfce7", marginBottom: "20px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" size={18} color="#16a34a" />
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#1a1a2e", marginBottom: "2px" }}>Your account is now active.</div>
                <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: "1.5" }}>You can start managing your medicines and health schedule.</div>
              </div>
            </div>

            <button onClick={onEnterApp}
              style={{ width: "100%", padding: "15px", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: "700", fontFamily: "inherit", cursor: "pointer", background: T.teal, color: "#fff", boxShadow: "0 4px 18px rgba(15,155,142,0.38)", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s" }}>
              <span />
              <span>Go to Dashboard</span>
              <Icon d="M5 12h14 M12 5l7 7-7 7" size={18} color="#fff" />
            </button>
          </div>

          <div style={{ height: "28px" }} />
        </div>
      </div>
    </div>
  );
}
