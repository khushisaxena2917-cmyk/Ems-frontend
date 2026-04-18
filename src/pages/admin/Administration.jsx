import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Building,
  Users,
  Upload,
  Trash2,
  Mail,
  Phone,
  Printer,
  Calendar,
  GraduationCap,
  Briefcase,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import EmployeeTable from "../../components/admin/EmployeeTable";
import { Toaster, toast } from "sonner";

export default function Administration() {
  const [activeTab, setActiveTab] = useState("department");
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setDepartments(data);
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    userEmail: "",
    userPassword: "",
    contact: "",
    department: "",
    dob: "",
    doj: "",
    experience: "",
    qualification: "",
    workingTime: "",
    salary: "",
    progressReport: 0,
    userStatus: "Active",
    deptName: "",
    deptHead: "",
    deptStatus: "enable",
  });

  const handleDeptSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.deptName,
        headOfDept: formData.deptHead,
        status: formData.deptStatus,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          toast.success("Department added successfully!");
          fetchDepartments();
          setFormData((prev) => ({
            ...prev,
            deptName: "",
            deptHead: "",
            deptStatus: "enable",
          }));
        } else {
          toast.error(data.message || "Error adding department");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        toast.error("A network error occurred.");
      });
  };

  const fetchEmployees = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/employees", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is an array
        setEmployees(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching employees:", err);
        setEmployees([]);
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = {
      name: formData.name,
      email: formData.userEmail,
      password: formData.userPassword,
      phone: formData.contact,
      department: formData.department,
      dob: formData.dob,
      doj: formData.doj,
      experience: formData.experience,
      qualification: formData.qualification,
      workingTime: formData.workingTime,
      salary: Number(formData.salary),
      progressReport: Number(formData.progressReport),
      status: formData.userStatus,
      role: "employee",
    };

    fetch("http://localhost:5000/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          fetchEmployees();
          setFormData({
            name: "",
            userEmail: "",
            userPassword: "",
            contact: "",
            department: "",
            dob: "",
            doj: "",
            experience: "",
            qualification: "",
            workingTime: "",
            salary: "",
            progressReport: 0,
            userStatus: "Active",
          });
          toast.success("Employee account created successfully!");
        } else {
          toast.error(data.message || "Error adding employee");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        toast.error("A network error occurred.");
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10 max-w-6xl mx-auto"
    >
      <Toaster richColors position="top-center" />
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight">
          Administration Portal
        </h1>
        <p className="text-slate-400 mt-2 font-medium">
          Global management of company departments and corporate accounts.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/5 backdrop-blur-md p-2 rounded-3xl w-fit border border-white/10 shadow-2xl">
        <button
          onClick={() => setActiveTab("department")}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
            activeTab === "department"
              ? "bg-[#6D28D9] text-white shadow-xl shadow-[#6D28D9]/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Building className="w-4 h-4" />
          Departments
        </button>
        <button
          onClick={() => setActiveTab("user")}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
            activeTab === "user"
              ? "bg-[#6D28D9] text-white shadow-xl shadow-[#6D28D9]/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Users className="w-4 h-4" />
          Employee Accounts
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 p-10 shadow-2xl overflow-visible relative">
        <style>
          {`
            :root {
              --lavender-600: #6D28D9;
              --mint-600: #10B981;
            }
          `}
        </style>
        <AnimatePresence mode="wait">
          {activeTab === "department" && (
            <motion.div
              key="department"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-black text-white mb-8 tracking-tight">
                Add New Department
              </h2>
              <form className="flex flex-col gap-8" onSubmit={handleDeptSubmit}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="deptName"
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                    >
                      Department Name
                    </label>
                    <input
                      type="text"
                      id="deptName"
                      value={formData.deptName}
                      onChange={handleInputChange}
                      spellCheck="false"
                      className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-[#6D28D9] focus:bg-white/20 outline-none transition-all font-bold text-white shadow-xl placeholder:text-slate-500"
                      placeholder="e.g., Engineering"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="deptHead"
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                    >
                      Head of Department
                    </label>
                    <input
                      type="text"
                      id="deptHead"
                      value={formData.deptHead}
                      onChange={handleInputChange}
                      spellCheck="false"
                      className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-[#6D28D9] focus:bg-white/20 outline-none transition-all font-bold text-white shadow-xl placeholder:text-slate-500"
                      placeholder="e.g., Dr. Jane Smith"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="deptStatus"
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                    >
                      Operation Status
                    </label>
                    <select
                      id="deptStatus"
                      value={formData.deptStatus}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-[#1a1a3a] border border-white/20 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-bold text-white appearance-none shadow-xl cursor-pointer"
                    >
                      <option
                        value="enable"
                        className="bg-[#1a1a3a] text-white"
                      >
                        Enabled
                      </option>
                      <option
                        value="disable"
                        className="bg-[#1a1a3a] text-white"
                      >
                        Disabled
                      </option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="btn-enterprise btn-lavender px-10 py-5 rounded-[2rem]"
                  >
                    <Plus className="w-5 h-5" />
                    Register Department
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === "user" && (
            <motion.div
              key="user"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-black text-white mb-8 tracking-tight">
                Create Employee Account
              </h2>
              <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="name"
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-[#1a1a3a] border border-white/20 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-bold text-white shadow-xl placeholder:text-slate-500"
                      placeholder="e.g., Jane Doe"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="userEmail"
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                    >
                      Work Email
                    </label>
                    <input
                      type="email"
                      id="userEmail"
                      value={formData.userEmail}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-[#1a1a3a] border border-white/20 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-bold text-white shadow-xl placeholder:text-slate-500"
                      placeholder="jane@saxenagroup.com"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="userPassword"
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                    >
                      Secure Password
                    </label>
                    <input
                      type="password"
                      id="userPassword"
                      value={formData.userPassword}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-[#1a1a3a] border border-white/20 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-bold text-white shadow-xl placeholder:text-slate-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="contact"
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                    >
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      id="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-[#1a1a3a] border border-white/20 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-bold text-white shadow-xl placeholder:text-slate-500"
                      placeholder="+91 00000 00000"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="department"
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                    >
                      Primary Department
                    </label>
                    <select
                      id="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-[#1a1a3a] border border-white/20 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-bold text-white appearance-none shadow-xl cursor-pointer"
                    >
                      <option value="" className="bg-[#1a1a3a] text-white">
                        Select Department
                      </option>
                      {departments.map((dept) => (
                        <option
                          key={dept._id}
                          value={dept.name}
                          className="bg-[#1a1a3a] text-white"
                        >
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="dob"
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-[#1a1a3a] border border-white/20 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-bold text-white shadow-xl"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="doj"
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                    >
                      Date of Joining
                    </label>
                    <input
                      type="date"
                      id="doj"
                      value={formData.doj}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-[#1a1a3a] border border-white/20 focus:ring-2 focus:ring-[#10B981] outline-none transition-all font-bold text-white shadow-xl"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="experience"
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                    >
                      Experience
                    </label>
                    <input
                      type="text"
                      id="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-[#1a1a3a] border border-white/20 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-bold text-white shadow-xl placeholder:text-slate-500"
                      placeholder="e.g., 2 Years"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="qualification"
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                    >
                      Qualification
                    </label>
                    <input
                      type="text"
                      id="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-[#1a1a3a] border border-white/20 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-bold text-white shadow-xl placeholder:text-slate-500"
                      placeholder="e.g., B.Tech"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="workingTime"
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                    >
                      Working Time
                    </label>
                    <input
                      type="text"
                      id="workingTime"
                      value={formData.workingTime}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-[#1a1a3a] border border-white/20 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-bold text-white shadow-xl placeholder:text-slate-500"
                      placeholder="e.g., 9:00 AM - 6:00 PM"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="salary"
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                    >
                      Salary
                    </label>
                    <input
                      type="number"
                      id="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-[#1a1a3a] border border-white/20 focus:ring-2 focus:ring-[#10B981] outline-none transition-all font-bold text-white shadow-xl"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="progressReport"
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                    >
                      Progress Report (%)
                    </label>
                    <input
                      type="number"
                      id="progressReport"
                      min="0"
                      max="100"
                      value={formData.progressReport}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-[#1a1a3a] border border-white/20 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-bold text-white shadow-xl"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="userStatus"
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4"
                    >
                      Status
                    </label>
                    <select
                      id="userStatus"
                      value={formData.userStatus}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-[#1a1a3a] border border-white/20 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-bold text-white appearance-none shadow-xl cursor-pointer"
                    >
                      <option
                        value="Active"
                        className="bg-[#1a1a3a] text-white"
                      >
                        Active
                      </option>
                      <option
                        value="Inactive"
                        className="bg-[#1a1a3a] text-white"
                      >
                        Inactive
                      </option>
                      <option
                        value="On Leave"
                        className="bg-[#1a1a3a] text-white"
                      >
                        On Leave
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-8 border-t border-white/10">
                  <button
                    type="submit"
                    className="px-10 py-4 bg-gradient-to-r from-lavender-600 to-indigo-600 text-white rounded-2xl text-sm font-black hover:from-lavender-700 hover:to-indigo-700 transition-all shadow-xl shadow-lavender-100 flex items-center gap-2 active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                    Add User
                  </button>
                </div>
              </form>

              <div className="mt-12">
                <EmployeeTable employees={employees} loading={loading} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
