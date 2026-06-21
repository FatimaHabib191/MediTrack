import { useState } from "react";
import { T } from "../constants/theme";
import OInput from "../components/common/OInput";
import OBtn from "../components/common/OBtn";
import { loginAPI } from "../api/authAPI";

export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    setErrors(p => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = "Please enter a valid email address.";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (mode === "signup" && form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);

    setLoading(true);
    try {
      if (mode === "login") {
        const res = await loginAPI({ email: form.email, password: form.password });
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        onAuth({ email: form.email, isSignup: false, userData: res.user });
      } else {
        onAuth({ email: form.email, password: form.password, isSignup: true });
      }
    } catch (err) {
      setErrors({ email: err.response?.data?.message || "Invalid email or password." });
    } finally {
      setLoading(false);
    }
  };

  const isSignup = mode === "signup";

  return (
    <div style={{position:"fixed", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans', sans-serif"}}>
      <div style={{position:"fixed", inset:0, background:`linear-gradient(145deg, ${T.tealDark}, ${T.teal})`}} />

      <div style={{position:"relative", width:"100%", maxWidth:"480px", margin:"24px", background:"rgba(255,255,255,.96)", borderRadius:"28px", padding:"48px 44px", boxShadow:"0 30px 80px rgba(0,0,0,.25)"}}>

        <div style={{textAlign:"center", marginBottom:"30px"}}>
          <div style={{fontSize:"28px"}}>➕</div>
          <h2 style={{fontFamily:"'Playfair Display', serif", color:T.text}}>MediTrack</h2>
        </div>

        <div style={{display:"flex", background:T.bg, borderRadius:"14px", padding:"5px", marginBottom:"28px"}}>
          {["login","signup"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setErrors({});}} style={{flex:1,padding:"12px",border:0,borderRadius:"10px",background:mode===m?T.teal:"transparent",color:mode===m?T.white:T.muted}}>
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <h1 style={{fontFamily:"'Playfair Display', serif", color:T.text}}>
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>

        <OInput label="Email address" type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" icon="✉️" error={errors.email}/>
        <OInput label="Password" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" icon="🔒" error={errors.password}/>

        {isSignup && <OInput label="Confirm password" type="password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="••••••••" icon="🔒" error={errors.confirmPassword}/>} 

        <OBtn label={isSignup ? "Continue →" : "Sign In"} onClick={submit} loading={loading}/>

        <p style={{textAlign:"center",fontSize:"12px",color:T.muted,marginTop:"20px"}}>
          Secure login • Your data is protected
        </p>
      </div>
    </div>
  );
}
