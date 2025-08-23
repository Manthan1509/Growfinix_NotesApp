import React, { useContext } from "react";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = async () => {
    await axios.post("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav>
      <span>Notes App</span>
      <button onClick={() => document.body.classList.toggle('dark')}>
        Toggle Dark Mode
      </button>
      {user ?
        <button onClick={logout}>Logout</button>
        : null
      }
    </nav>
  );
}
