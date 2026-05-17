import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/auth/${mode}`, { email, password });
      setUser({ email });
      navigate("/notes");
    } catch (err) {
      setError(err.response?.data?.message || "Error");
    }
  };
  return (
    <div>
      
      <form className="form-container" onSubmit={handleAuth}>
        <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <div className="button-group">
        <button type="submit">{mode === "login" ? "Login" : "Sign Up"}</button>
        <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
        Switch to {mode === "login" ? "Sign Up" : "Login"}
        </button>
        </div>
        {error && <div style={{color: 'red'}}>{error}</div>}
      </form>
    </div>
  );
}
