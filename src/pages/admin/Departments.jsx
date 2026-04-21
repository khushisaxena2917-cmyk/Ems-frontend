import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Building2,
  User,
  Users,
  Trash2,
  Edit2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    headOfDept: "",
    totalEmployees: 0,
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch("https://ems-backend.vercel.app/api/departments");
      const data = await res.json();
      setDepartments(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `https://ems-backend.vercel.app/api/departments/${selectedId}`
        : "https://ems-backend.vercel.app/api/departments";
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
        setFormData({ name: "", headOfDept: "", totalEmployees: 0 });
        fetchDepartments();
      }
    } catch (err) {
      console.error("Error saving department:", err);
    }
  };

  const handleEdit = (dept) => {
    setIsEditing(true);
    setSelectedId(dept._id);
    setFormData({
      name: dept.name,
      headOfDept: dept.headOfDept,
      totalEmployees: dept.totalEmployees,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        const res = await fetch(
          `https://ems-backend.vercel.app/api/departments/${id}`,
          {
            method: "DELETE",
          },
        );
        if (res.ok) fetchDepartments();
      } catch (err) {
        console.error("Error deleting department:", err);
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
            Department Management
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-bold">
            Organize and manage your company departments.
          </p>
        </div>
        <button
          onClick={() => {
            setIsEditing(false);
            setFormData({ name: "", headOfDept: "", totalEmployees: 0 });
            setShowModal(true);
          }}
          className="btn-enterprise btn-lavender"
        >
          <Plus className="w-5 h-5" />
          Add Department
        </button>
      </div>

      <div className="card-enterprise">
        <div className="card-header-lavender flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search departments..."
              spellCheck="false"
              className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/60 border border-white focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all text-sm font-bold text-slate-800 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 text-sm font-black text-slate-600 hover:text-[#6D28D9] px-6 py-2.5 rounded-lg hover:bg-white/60 transition-all border border-white shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-white/40">
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Dept Name
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Head of Dept
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Employees
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-[#6D28D9] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-500 font-black text-sm uppercase tracking-widest">
                        Loading...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : departments.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="py-12 text-center text-slate-500 font-bold italic"
                  >
                    No departments found.
                  </td>
                </tr>
              ) : (
                departments.map((dept) => (
                  <tr key={dept._id} className="hover: transition-colors group">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#6D28D9]/5 flex items-center justify-center text-[#6D28D9] group-hover:bg-[#6D28D9] group-hover:text-white transition-all shadow-sm border border-white/10">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-black text-white">
                          {dept.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-300">
                          {dept.headOfDept}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#10B981]" />
                        <span className="text-sm font-black text-white tracking-tight">
                          {dept.totalEmployees}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleEdit(dept)}
                          className="p-2.5 text-slate-400 hover:text-[#6D28D9] hover:bg-[#6D28D9]/10 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dept._id)}
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
                  {isEditing ? "Edit Department" : "Add Department"}
                </h2>
                <p className="text-slate-500 text-sm mt-1 font-bold">
                  {isEditing
                    ? `Update details for ${formData.name}.`
                    : "Enter details for the new department."}
                </p>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    Department Name
                  </label>
                  <input
                    type="text"
                    required
                    spellCheck="false"
                    className="w-full px-6 py-4 rounded-lg  border border-slate-100 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all text-sm font-bold text-slate-800 shadow-sm"
                    placeholder="e.g. Engineering"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    Head of Department
                  </label>
                  <input
                    type="text"
                    required
                    spellCheck="false"
                    className="w-full px-6 py-4 rounded-lg  border border-slate-100 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all text-sm font-bold text-slate-800 shadow-sm"
                    placeholder="e.g. John Doe"
                    value={formData.headOfDept}
                    onChange={(e) =>
                      setFormData({ ...formData, headOfDept: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 text-slate-500 font-black rounded-lg hover:bg-slate-50 transition-all active:scale-95 border border-slate-100 uppercase tracking-widest text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-[#6D28D9] text-white font-black rounded-lg hover:bg-[#7C3AED] shadow-lg shadow-[#6D28D9]/30 active:scale-95 transition-all uppercase tracking-widest text-xs"
                  >
                    {isEditing ? "Update" : "Create"}
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
