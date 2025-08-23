import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import NotesPage from "./pages/NotesPage";
import AuthPage from "./pages/AuthPage";
import SharedNotePage from "./pages/SharedNotePage";
import Navbar from "./components/Navbar";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export const AuthContext = React.createContext();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Try to fetch user info if a token exists (implement /api/auth/me if desired)
    // For simplicity, user is set after login/signup
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/notes" element={
            user ? <NotesPage /> : <Navigate to="/login" />
          } />
          <Route path="/shared/:key" element={<SharedNotePage />} />
          <Route path="*" element={<Navigate to={user ? "/notes" : "/login"} />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
