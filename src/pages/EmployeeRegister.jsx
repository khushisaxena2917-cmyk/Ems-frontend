import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Building2,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function EmployeeRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill all required fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    fetch("http://localhost:5000/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        status: "Active",
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.message || "Registration failed.");
        }
        return data;
      })
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        setError(String(err?.message || err));
      });
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-4 relative overflow-hidden text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] opacity-50"></div>
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-indigo-900/20 to-transparent opacity-70"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-[#11112a] rounded-[2rem] shadow-2xl border border-white/10 p-10 backdrop-blur-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Employee Registration
            </h1>
            <p className="text-slate-400 mt-2 text-center font-medium">
              Create your account for Saxena's Group portal
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  spellCheck="false"
                  className="pl-12 w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white font-medium placeholder:text-slate-500 shadow-inner"
                  placeholder="Full Name"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-300 uppercase tracking-widest ml-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  spellCheck="false"
                  className="pl-12 w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white font-medium placeholder:text-slate-500 shadow-inner"
                  placeholder="Email"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-slate-300 uppercase tracking-widest ml-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  spellCheck="false"
                  className="pl-12 w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white font-medium placeholder:text-slate-500 shadow-inner"
                  placeholder="+91 xxxxxxxxx"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-300 uppercase tracking-widest ml-2">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    spellCheck="false"
                    className="pl-12 pr-12 w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white font-medium placeholder:text-slate-500 shadow-inner"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-300 uppercase tracking-widest ml-2">
                  Confirm *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={onChange}
                    spellCheck="false"
                    className="pl-12 pr-12 w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white font-medium placeholder:text-slate-500 shadow-inner"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 font-bold flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              className="btn-enterprise btn-lavender w-full py-4 mt-4"
            >
              Create Account
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-sm text-slate-400 text-center font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-black text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-xs font-black text-slate-500 hover:text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Return to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
