import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  UserCircle,
  Facebook,
  Twitter,
  Chrome,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.message || "Login failed.");
        }
        return data;
      })
      .then((data) => {
        // Use the actual user data and role from the backend
        const userData = { ...data.user };
        if (userData.email === "admin@saxenagroup.com" && !userData.name) {
          userData.name = "Khushi Saxena";
        }
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", data.token);

        // Navigate based on the backend role
        if (userData.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/employee/dashboard");
        }
      })
      .catch((err) => {
        setError(String(err?.message || err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (
      !email ||
      email === "admin@saxenagroup.com" ||
      email === "employee@saxenagroup.com"
    ) {
      setEmail(
        role === "admin" ? "admin@saxenagroup.com" : "employee@saxenagroup.com",
      );
    }
    setPassword("password123");
  }, [role]);

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-4 relative overflow-hidden text-white">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
          .company-font {
            font-family: 'Playfair Display', serif;
          }
          .glass-card {
            background: rgba(230, 230, 250, 0.25);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }
          .lavender-glow {
            box-shadow: 0 0 30px rgba(154, 128, 196, 0.3);
          }
          .preserve-3d {
            transform-style: preserve-3d;
          }
          .input-focus-glow:focus-within {
            box-shadow: 0 0 20px rgba(167, 139, 250, 0.3);
          }
          .floating {
            animation: floating 3s ease-in-out infinite;
          }
          @keyframes floating {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>

      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-teal-900/20 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="inline-block p-5 bg-white/5 backdrop-blur-md rounded-[2.5rem] shadow-2xl mb-6 border border-white/10"
          >
            <Building2 className="w-12 h-12 text-purple-400" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white company-font tracking-tight mb-2">
            Saxena's Group
          </h1>
          <p className="text-purple-400 font-black tracking-[0.3em] uppercase text-xs">
            of Industries
          </p>
        </div>

        <motion.div
          whileHover={{
            rotateX: 5,
            rotateY: -5,
            translateZ: 50,
            scale: 1.02,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="glass-card rounded-[3rem] p-10 shadow-2xl relative overflow-hidden preserve-3d lavender-glow"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Sparkles className="w-20 h-20 text-purple-300 floating" />
          </div>

          <div className="flex flex-col items-center mb-8 relative z-10">
            <h2 className="text-3xl font-black text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-purple-200 mt-2 font-bold text-center">
              Please enter your credentials to access the portal
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
              {error}
            </motion.div>
          )}

          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-6 relative z-10"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="role"
                className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2"
              >
                Login Identity
              </label>
              <div className="relative input-focus-glow rounded-2xl">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/20 border border-white/30 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all font-black text-white appearance-none shadow-xl"
                >
                  <option value="admin" className="bg-[#1a1a3a] text-white">
                    Administrator
                  </option>
                  <option value="employee" className="bg-[#1a1a3a] text-white">
                    Corporate Employee
                  </option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-xs font-black text-purple-200 uppercase tracking-widest ml-2"
              >
                Email Address
              </label>
              <div className="relative input-focus-glow rounded-2xl">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  spellCheck="false"
                  placeholder="name@saxenagroup.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/20 border border-white/30 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all font-black text-white shadow-xl placeholder:text-purple-200/50"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-xs font-black text-purple-200 uppercase tracking-widest ml-2"
              >
                Secure Password
              </label>
              <div className="relative input-focus-glow rounded-2xl">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  spellCheck="false"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/20 border border-white/30 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all font-black text-white shadow-xl placeholder:text-purple-200/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-200/70 hover:text-white transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-enterprise btn-lavender w-full py-4 mt-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center relative z-10">
            <p className="text-slate-400 text-sm font-medium">
              New to the portal?{" "}
              <Link
                to="/register"
                className="text-purple-400 font-black hover:underline underline-offset-4 transition-colors"
              >
                Register as Employee
              </Link>
            </p>
          </div>

          {/* Social Login Section */}
          <div className="mt-8 relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">
                Or Sign Up Using
              </span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div className="flex justify-center gap-6">
              {[
                {
                  icon: Facebook,
                  color:
                    "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
                  label: "Facebook",
                },
                {
                  icon: Twitter,
                  color: "bg-sky-500/10 text-sky-400 border-sky-500/20",
                  label: "Twitter",
                },
                {
                  icon: Chrome,
                  color:
                    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                  label: "Google",
                },
              ].map((social, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-14 h-14 rounded-full ${social.color} flex items-center justify-center shadow-lg border transition-all`}
                  title={social.label}
                >
                  <social.icon className="w-6 h-6" />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 text-center text-slate-500 text-xs font-bold uppercase tracking-[0.3em]"
        >
          © 2026 Saxena's Group of Industries • Global Enterprise
        </motion.p>
      </motion.div>
    </div>
  );
}
