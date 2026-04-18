import React, { useState } from "react";
import { motion } from "motion/react";
import { KeyRound, ShieldCheck, ArrowRight, Lock, Eye, EyeOff } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function Settings() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    if (passwords.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters!");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Password updated successfully!");
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.message || "Failed to update password");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10"
    >
      <Toaster richColors position="top-center" />
      
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
          <KeyRound className="w-10 h-10 text-lavender-400" />
          Account Settings
        </h1>
        <p className="text-slate-400 font-medium">
          Manage your security and account preferences here.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-lavender-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-lavender-500/10 rounded-2xl flex items-center justify-center text-lavender-400 border border-lavender-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Security Update</h2>
                  <p className="text-slate-400 text-sm font-medium">Update your password to keep your account secure.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="grid sm:grid-cols-1 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">
                      Current Password
                    </label>
                    <div className="relative group/input">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-lavender-400 transition-colors" />
                      <input
                        type={showOldPassword ? "text" : "password"}
                        name="oldPassword"
                        value={passwords.oldPassword}
                        onChange={handleChange}
                        className="w-full pl-16 pr-16 py-5 rounded-[2rem] bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 focus:border-lavender-500/50 outline-none transition-all font-bold text-white shadow-inner placeholder:text-slate-600"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-2"
                      >
                        {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">
                        New Password
                      </label>
                      <div className="relative group/input">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-lavender-400 transition-colors" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwords.newPassword}
                          onChange={handleChange}
                          className="w-full pl-16 pr-16 py-5 rounded-[2rem] bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 focus:border-lavender-500/50 outline-none transition-all font-bold text-white shadow-inner placeholder:text-slate-600"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-2"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">
                        Confirm New Password
                      </label>
                      <div className="relative group/input">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-lavender-400 transition-colors" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwords.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-16 pr-16 py-5 rounded-[2rem] bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 focus:border-lavender-500/50 outline-none transition-all font-bold text-white shadow-inner placeholder:text-slate-600"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-2"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-enterprise btn-lavender px-12 py-5 rounded-[2rem] flex items-center gap-4 group/btn relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-4">
                      {loading ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Save New Password
                          <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 shadow-xl">
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest">Password Tips</h3>
            <ul className="flex flex-col gap-6">
              {[
                "Use at least 6 characters",
                "Include a mix of symbols and numbers",
                "Avoid using common words",
                "Change it every 3-6 months"
              ].map((tip, idx) => (
                <li key={idx} className="flex items-start gap-4 text-sm font-medium text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-lavender-500 mt-1.5 shrink-0"></div>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-lavender-500/10 to-indigo-500/10 backdrop-blur-xl rounded-[2.5rem] border border-lavender-500/20 p-8 shadow-xl">
            <p className="text-xs font-black text-lavender-400 uppercase tracking-[0.2em] mb-4">Support</p>
            <p className="text-sm font-medium text-slate-300 mb-6">Having trouble changing your password?</p>
            <button className="text-white font-black text-sm uppercase tracking-widest hover:text-lavender-400 transition-colors flex items-center gap-2">
              Contact IT Support
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
