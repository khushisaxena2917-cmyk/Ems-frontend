import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  FileText,
  Send,
  ArrowRight,
  ClipboardList,
  Info,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ApplyLeave() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}") || {};
  const [loading, setLoading] = useState(false);

  if (user.role !== "employee") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-10 text-center">
        <div className="w-24 h-24 rounded-full bg-rose-500/10 flex items-center justify-center">
          <Info className="w-12 h-12 text-rose-500" />
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">
          Access Denied
        </h2>
        <p className="text-slate-400 max-w-md font-bold">
          Only employees are authorized to apply for leave requests through this
          portal.
        </p>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black uppercase tracking-widest transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    employeeName: user.name || "",
    employeeId: user.id || "",
    designation: user.designation || "",
    department: user.department || "",
    leaveType: "Sick Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/departments");
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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          leaveType: formData.leaveType,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Leave application submitted successfully!");
        setTimeout(() => navigate("/employee/leave-status"), 2000);
      } else {
        toast.error(data.message || "Failed to submit leave application");
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
          <FileText className="w-10 h-10 text-lavender-400" />
          Leave Application
        </h1>
        <p className="text-slate-400 font-medium">
          Submit your leave request for approval.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-lavender-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>

            <form
              onSubmit={handleSubmit}
              className="relative z-10 flex flex-col gap-8"
            >
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">
                    Employee Name
                  </label>
                  <div className="relative">
                    <ClipboardList className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender-400" />
                    <input
                      type="text"
                      name="employeeName"
                      value={formData.employeeName}
                      readOnly
                      required
                      placeholder="Enter full name"
                      className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-white/5 border border-white/10 outline-none transition-all font-bold text-slate-400 cursor-not-allowed shadow-inner"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">
                    Employee ID
                  </label>
                  <div className="relative">
                    <ClipboardList className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender-400" />
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      readOnly
                      required
                      placeholder="Enter employee ID"
                      className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-white/5 border border-white/10 outline-none transition-all font-bold text-slate-400 cursor-not-allowed shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">
                    Designation
                  </label>
                  <div className="relative">
                    <ClipboardList className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender-400" />
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      readOnly
                      required
                      placeholder="e.g. Senior Developer"
                      className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-white/5 border border-white/10 outline-none transition-all font-bold text-slate-400 cursor-not-allowed shadow-inner"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">
                    Department
                  </label>
                  <div className="relative">
                    <ClipboardList className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender-400" />
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      readOnly
                      required
                      placeholder="e.g. Engineering"
                      className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-white/5 border border-white/10 outline-none transition-all font-bold text-slate-400 cursor-not-allowed shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">
                    Leave Type
                  </label>
                  <div className="relative">
                    <ClipboardList className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender-400" />
                    <select
                      name="leaveType"
                      value={formData.leaveType}
                      onChange={handleChange}
                      className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white appearance-none"
                    >
                      <option value="Sick Leave" className="bg-[#1a1a3a]">
                        Sick Leave
                      </option>
                      <option value="Casual Leave" className="bg-[#1a1a3a]">
                        Casual Leave
                      </option>
                      <option value="Earned Leave" className="bg-[#1a1a3a]">
                        Earned Leave
                      </option>
                      <option value="Maternity Leave" className="bg-[#1a1a3a]">
                        Maternity Leave
                      </option>
                      <option value="Other" className="bg-[#1a1a3a]">
                        Other
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">
                    Requested Dates
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender-400" />
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white"
                      />
                    </div>
                    <span className="text-slate-500 font-bold">to</span>
                    <div className="relative flex-1">
                      <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-lavender-400" />
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">
                  Reason for Leave
                </label>
                <div className="relative">
                  <FileText className="absolute left-6 top-6 w-5 h-5 text-lavender-400" />
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Describe the reason for your leave request..."
                    className="w-full pl-16 pr-6 py-6 rounded-[2rem] bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-medium text-white resize-none placeholder:text-slate-600"
                  ></textarea>
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
                        Submit Application
                        <Send className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 shadow-xl">
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest flex items-center gap-3">
              <Info className="w-5 h-5 text-lavender-400" />
              Guidelines
            </h3>
            <ul className="flex flex-col gap-6">
              {[
                "Submit requests at least 2 days in advance",
                "Ensure all pending tasks are handed over",
                "Mention emergency contact if necessary",
                "Approval depends on manager's discretion",
              ].map((tip, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 text-sm font-medium text-slate-400"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-lavender-500 mt-1.5 shrink-0"></div>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-lavender-500/10 to-indigo-500/10 backdrop-blur-xl rounded-[2.5rem] border border-lavender-500/20 p-8 shadow-xl">
            <p className="text-xs font-black text-lavender-400 uppercase tracking-[0.2em] mb-4">
              Quick Links
            </p>
            <button
              onClick={() => navigate("/employee/leave-status")}
              className="text-white font-black text-sm uppercase tracking-widest hover:text-lavender-400 transition-colors flex items-center gap-2"
            >
              View Leave History
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
