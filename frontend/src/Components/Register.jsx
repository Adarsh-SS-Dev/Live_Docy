import React, { useState, useContext } from "react";
import axios from "../Components/axiosInstance";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthContext } from "../Components/AuthContext";
import './Register.css'; // Make sure this import exists

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", form);

      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("userId", res.data.user._id);
      sessionStorage.setItem("username", res.data.user.name);

      login(res.data.user.name, res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="register-page">
      <Navbar />
      <div className="register-container">
        <div className="register-card">
          <h2 className="register-title">Create your account</h2>

          <form className="register-form" onSubmit={handleRegister}>
            <input
              className="input"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button type="submit" className="btn">
              Register
            </button>
          </form>

          <p className="switch-auth">
            Already have an account?{" "}
            <span className="switch-link" onClick={() => navigate("/login")}>
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
