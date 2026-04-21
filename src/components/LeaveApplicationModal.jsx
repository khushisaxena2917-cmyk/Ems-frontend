import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, FileText, Send, Sparkles } from "lucide-react";

const LeaveApplicationModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    designation: "",
    department: "",
    leaveType: "Sick Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(
          "https://ems-backend.vercel.app/api/departments",
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setDepartments(data.map((d) => d.name));
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://ems-backend.vercel.app/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        onClose();
        setFormData({
          employeeName: "",
          employeeId: "",
          designation: "",
          department: "",
          leaveType: "Sick Leave",
          startDate: "",
          endDate: "",
          reason: "",
        });
      }
    } catch (err) {
      console.error("Error submitting leave request:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateX: 20, y: 50 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateX: -20, y: 50 }}
            className="relative bg-[#0a0a1a] rounded-[2.5rem] shadow-[0_0_50px_rgba(109,40,217,0.3)] w-full max-w-xl max-h-[90vh] overflow-hidden border border-white/10 preserve-3d flex flex-col"
          >
            {/* 3D Decorative Sparkle */}
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sparkles className="w-16 h-16 text-lavender-400 animate-pulse" />
            </div>

            <div className="p-10 border-b border-white/5 bg-gradient-to-br from-[#6D28D9]/10 to-transparent flex justify-between items-center relative z-10 shrink-0">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  Apply for Leave
                </h2>
                <p className="text-slate-400 text-sm mt-2 font-bold uppercase tracking-widest">
                  Enterprise Request Portal
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <form
                onSubmit={handleSubmit}
                className="p-10 space-y-8 relative z-10"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">
                      Employee Name
                    </label>
                    <div className="relative group">
                      <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender-400 group-focus-within:scale-110 transition-transform" />
                      <input
                        type="text"
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={handleInputChange}
                        required
                        placeholder="Full Name"
                        className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">
                      Employee ID
                    </label>
                    <div className="relative group">
                      <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender-400 group-focus-within:scale-110 transition-transform" />
                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        required
                        placeholder="ID"
                        className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">
                      Designation
                    </label>
                    <div className="relative group">
                      <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender-400 group-focus-within:scale-110 transition-transform" />
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        required
                        placeholder="Role"
                        className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">
                      Department
                    </label>
                    <div className="relative group">
                      <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender-400 group-focus-within:scale-110 transition-transform" />
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white appearance-none"
                      >
                        <option value="" className="bg-[#0a0a1a]">
                          Select Department
                        </option>
                        {departments.map((dept) => (
                          <option
                            key={dept}
                            value={dept}
                            className="bg-[#0a0a1a]"
                          >
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">
                    Leave Category
                  </label>
                  <div className="relative group">
                    <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender-400 group-focus-within:scale-110 transition-transform" />
                    <select
                      name="leaveType"
                      value={formData.leaveType}
                      onChange={handleInputChange}
                      className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white appearance-none"
                    >
                      <option value="Sick Leave" className="bg-[#0a0a1a]">
                        Sick Leave
                      </option>
                      <option value="Casual Leave" className="bg-[#0a0a1a]">
                        Casual Leave
                      </option>
                      <option value="Earned Leave" className="bg-[#0a0a1a]">
                        Earned Leave
                      </option>
                      <option value="Maternity Leave" className="bg-[#0a0a1a]">
                        Maternity Leave
                      </option>
                      <option value="Other" className="bg-[#0a0a1a]">
                        Other
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">
                      Start Date
                    </label>
                    <div className="relative group">
                      <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender-400 group-focus-within:scale-110 transition-transform" />
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">
                      End Date
                    </label>
                    <div className="relative group">
                      <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender-400 group-focus-within:scale-110 transition-transform" />
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">
                    Reason for Leave
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="Briefly describe the purpose of your leave..."
                    className="w-full px-8 py-6 rounded-[2rem] bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-[#6D28D9] to-[#4F46E5] text-white font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(109,40,217,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-4"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Application
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeaveApplicationModal;
