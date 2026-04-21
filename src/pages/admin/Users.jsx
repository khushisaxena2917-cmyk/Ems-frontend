import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  ShieldCheck,
  User,
  Mail,
  Trash2,
  Edit2,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://ems-backend.vercel.app/api/auth/users");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `https://ems-backend.vercel.app/api/auth/users/${selectedId}`
        : "https://ems-backend.vercel.app/api/auth/register";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setIsEditing(false);
        setSelectedId(null);
        setFormData({ name: "", email: "", password: "", role: "employee" });
        fetchUsers();
      }
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setSelectedId(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Don't pre-fill password for security
      role: user.role,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await fetch(
          `https://ems-backend.vercel.app/api/auth/users/${id}`,
          {
            method: "DELETE",
          },
        );
        if (res.ok) fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Users & Roles
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-bold">
            Manage system access and role-based permissions.
          </p>
        </div>
        <button
          onClick={() => {
            setIsEditing(false);
            setFormData({
              name: "",
              email: "",
              password: "",
              role: "employee",
            });
            setShowModal(true);
          }}
          className="btn-enterprise btn-lavender"
        >
          <Plus className="w-5 h-5" /> Add User
        </button>
      </div>

      <div className="card-enterprise">
        <div className="card-header-lavender flex flex-col sm:row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              spellCheck="false"
              className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/60 border border-white focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all text-sm font-bold text-slate-800 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 text-sm font-black text-slate-600 hover:text-[#6D28D9] px-6 py-2.5 rounded-lg hover:bg-white/60 transition-all border border-white shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-white/40">
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  User Details
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Email
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Role
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="py-12 text-center text-slate-500 font-black uppercase tracking-widest text-xs"
                  >
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="py-12 text-center text-slate-500 font-bold italic"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-white/60 transition-colors group"
                  >
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#6D28D9]/5 flex items-center justify-center text-[#6D28D9] group-hover:bg-[#6D28D9] group-hover:text-white transition-all shadow-sm border border-white/10">
                          <User className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-black text-white">
                          {u.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-2 text-sm text-slate-300 font-bold">
                        <Mail className="w-4 h-4 text-slate-400" /> {u.email}
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          u.role === "admin"
                            ? " text-rose-700 border-rose-200"
                            : u.role === "hr"
                              ? "bg-amber-100 text-amber-700 border-amber-200"
                              : " text-indigo-700 border-indigo-200"
                        }`}
                      >
                        <Shield className="w-3 h-3" /> {u.role}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleEdit(u)}
                          className="p-2.5 text-slate-400 hover:text-[#6D28D9] hover:bg-[#6D28D9]/10 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative  backdrop-blur-2xl rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-white"
            >
              <div className="p-8 border-b border-white bg-gradient-to-r from-[#6D28D9]/10 to-transparent">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {isEditing ? "Edit User" : "Create Account"}
                </h2>
                <p className="text-slate-500 text-sm mt-1 font-bold">
                  {isEditing
                    ? `Update details for ${formData.name}.`
                    : "Setup a new user with specific permissions."}
                </p>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    spellCheck="false"
                    className="w-full px-6 py-4 rounded-lg border border-slate-100 text-sm font-bold text-slate-800 shadow-sm focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    spellCheck="false"
                    className="w-full px-6 py-4 rounded-lg border border-slate-100 text-sm font-bold text-slate-800 shadow-sm focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    {isEditing ? "New Password (optional)" : "Initial Password"}
                  </label>
                  <input
                    type="password"
                    required={!isEditing}
                    spellCheck="false"
                    className="w-full px-6 py-4 rounded-lg  border border-slate-100 text-sm font-bold text-slate-800 shadow-sm focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    Assigned Role
                  </label>
                  <select
                    required
                    className="w-full px-6 py-4 rounded-lg  border border-slate-100 text-sm font-bold text-slate-800 shadow-sm focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option value="employee">Corporate Employee</option>
                    <option value="hr">HR Administrator</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 text-slate-500 font-black rounded-lg hover:bg-slate-50 border border-slate-100 uppercase tracking-widest text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-[#6D28D9] text-black font-black rounded-lg shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs"
                  >
                    {isEditing ? "Update" : "Register"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
