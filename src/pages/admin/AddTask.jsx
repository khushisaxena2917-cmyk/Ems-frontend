import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function AddTask() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    department: "",
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch Employees
    fetch("http://localhost:5000/api/employees", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setEmployees(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching employees:", err));

    // Fetch Departments
    fetch("http://localhost:5000/api/departments", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDepartments(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching departments:", err));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.assignedTo) {
      setError("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || "Failed to add task.");
        return data;
      })
      .then(() => {
        navigate("/admin/dashboard");
      })
      .catch((err) => setError(err.message));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto flex flex-col gap-10"
    >
      <div className="flex items-center gap-6">
        <Link
          to="/admin/dashboard"
          className="p-4 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-white/10"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Register New Task
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-black uppercase tracking-widest">
            Corporate Operation Deployment Center
          </p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6D28D9]/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>

        {error && (
          <div className="mb-8 p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-black flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
            {error}
          </div>
        )}

        <form
          className="relative z-10 flex flex-col gap-10"
          onSubmit={handleSubmit}
        >
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <label
                htmlFor="department"
                className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4"
              >
                Operation Department
              </label>
              <select
                id="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-bold text-white appearance-none shadow-xl"
              >
                <option value="" className="bg-[#0a0a1a]">
                  Select Department
                </option>
                {departments.map((dept) => (
                  <option
                    key={dept._id}
                    value={dept.name}
                    className="bg-[#0a0a1a]"
                  >
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <label
                htmlFor="assignedTo"
                className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4"
              >
                Designated Employee
              </label>
              <select
                id="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-bold text-white appearance-none shadow-xl"
                required
              >
                <option value="" className="bg-[#0a0a1a]">
                  Select Agent
                </option>
                {employees.map((emp) => (
                  <option
                    key={emp._id}
                    value={emp._id}
                    className="bg-[#0a0a1a]"
                  >
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label
              htmlFor="title"
              className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4"
            >
              Task Objective Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleChange}
              spellCheck="false"
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-bold text-white shadow-xl"
              placeholder="e.g., Strategic Infrastructure Audit"
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <label
              htmlFor="description"
              className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4"
            >
              Operational Briefing
            </label>
            <textarea
              id="description"
              rows={6}
              value={formData.description}
              onChange={handleChange}
              spellCheck="false"
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all resize-none font-bold text-white shadow-xl placeholder:text-slate-600"
              placeholder="Provide comprehensive instructions for the designated entity..."
            ></textarea>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <label
                htmlFor="priority"
                className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4"
              >
                Priority Classification
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-bold text-white appearance-none shadow-xl"
              >
                <option value="low" className="bg-[#0a0a1a]">
                  Low Priority
                </option>
                <option value="medium" className="bg-[#0a0a1a]">
                  Standard Priority
                </option>
                <option value="high" className="bg-[#0a0a1a]">
                  Critical Priority
                </option>
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <label
                htmlFor="dueDate"
                className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4"
              >
                Deployment Deadline
              </label>
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-bold text-white shadow-xl"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-6 mt-6 pt-10 border-t border-white/10">
            <Link
              to="/admin/dashboard"
              className="px-8 py-4 text-sm font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all"
            >
              Abort Mission
            </Link>
            <button
              type="submit"
              className="btn-enterprise btn-lavender px-12 py-4 rounded-2xl flex items-center gap-3 active:scale-95"
            >
              <Save className="w-5 h-5" />
              Deploy Task
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
