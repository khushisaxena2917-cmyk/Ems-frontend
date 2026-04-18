import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Briefcase,
  DollarSign,
  Building,
  Trash2,
  Edit2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Positions() {
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    salaryRange: "",
    department: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [posRes, deptRes] = await Promise.all([
        fetch("http://localhost:5000/api/positions"),
        fetch("http://localhost:5000/api/departments"),
      ]);
      setPositions(await posRes.json());
      setDepartments(await deptRes.json());
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/positions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ title: "", salaryRange: "", department: "" });
        fetchData();
      }
    } catch (err) {
      console.error("Error creating position:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this position?")) {
      try {
        const res = await fetch(`/api/positions/${id}`, { method: "DELETE" });
        if (res.ok) fetchData();
      } catch (err) {
        console.error("Error deleting position:", err);
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Position Management
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage job titles and salary structures.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Position
        </button>
      </div>

      <div className=" backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-white/40 flex flex-col sm:row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search positions..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl  border border-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-600 px-4 py-2.5 rounded-xl hover:bg-white/60 transition-all border border-white">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-white/40">
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Job Title
                </th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Department
                </th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Salary Range
                </th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="py-12 text-center text-slate-500 font-bold"
                  >
                    Loading positions...
                  </td>
                </tr>
              ) : positions.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="py-12 text-center text-slate-500 font-medium italic"
                  >
                    No positions found.
                  </td>
                </tr>
              ) : (
                positions.map((pos) => (
                  <tr
                    key={pos._id}
                    className="hover:bg-white/40 transition-colors group"
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {pos.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">
                          {pos.department?.name || "Unassigned"}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-black text-slate-900 tracking-tight">
                          {pos.salaryRange}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pos._id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
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
              className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden border border-white"
            >
              <div className="p-8 border-b  bg-gradient-to-r from-emerald-50 to-teal-50">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Add Position
                </h2>
                <p className="text-slate-500 text-sm mt-1 font-medium">
                  Define a new job role and its salary.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 rounded-2xl  border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-bold shadow-sm"
                    placeholder="e.g. Senior Developer"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    Department
                  </label>
                  <select
                    required
                    className="w-full px-6 py-4 rounded-2xl  border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-bold shadow-sm"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-bold black shadow-sm"
                    placeholder="e.g. $80k - $120k"
                    value={formData.salaryRange}
                    onChange={(e) =>
                      setFormData({ ...formData, salaryRange: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-95 border border-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-2xl hover:shadow-lg active:scale-95 transition-all"
                  >
                    Create
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
