import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings,
  Building,
  Briefcase,
  ShieldCheck,
  Database,
  Bell,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Info,
  X,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  Lock,
  Calendar,
  Clock,
  Layout,
  FileText,
  Users,
} from "lucide-react";

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState("general");
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [showAddDept, setShowAddDept] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [newDept, setNewDept] = useState({
    name: "",
    headOfDept: "",
    status: "Active",
  });

  const [companyInfo, setCompanyInfo] = useState({
    name: "Saxena's Group of Industries",
    email: "admin@saxenagroup.com",
    contact: "+91 98765 43210",
    address: "New Delhi, India",
    timezone: "GMT +5:30 (India)",
    logo: null,
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const handleAddDept = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editingDept
        ? `http://localhost:5000/api/departments/${editingDept._id}`
        : "http://localhost:5000/api/departments";
      const method = editingDept ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDept),
      });
      if (res.ok) {
        setShowAddDept(false);
        setEditingDept(null);
        setNewDept({ name: "", headOfDept: "", status: "Active" });
        fetchDepartments();
      }
    } catch (err) {
      console.error("Error processing department:", err);
    }
  };

  const handleDeleteDept = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/departments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchDepartments();
      }
    } catch (err) {
      console.error("Error deleting department:", err);
    }
  };

  const sections = [
    { id: "general", label: "General Settings", icon: Settings },
    { id: "departments", label: "Departments", icon: Building },
    { id: "roles", label: "Roles & Permissions", icon: ShieldCheck },
    { id: "attendance", label: "Attendance & Leave", icon: Calendar },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "data", label: "Data & Backup", icon: Database },
  ];

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyInfo({ ...companyInfo, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10"
    >
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight">
          System Configuration
        </h1>
        <p className="text-slate-400 mt-2 font-medium">
          Control the core infrastructure and enterprise-level settings.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-10 items-start">
        {/* Sidebar Navigation */}
        <div className="flex flex-col gap-3 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-5 shadow-2xl">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                activeSection === section.id
                  ? "bg-[#6D28D9] text-white shadow-xl shadow-[#6D28D9]/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeSection === "general" && (
              <motion.div
                key="general"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 p-10 shadow-2xl flex flex-col gap-10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#6D28D9]/10 flex items-center justify-center text-[#6D28D9] border border-[#6D28D9]/20">
                    <Settings className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    General Enterprise Settings
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Logo Upload */}
                  <div className="col-span-2 flex flex-col items-center justify-center p-10 border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                    <div className="w-32 h-32 rounded-3xl bg-white/5 flex items-center justify-center mb-6 overflow-hidden border border-white/10 relative">
                      {companyInfo.logo ? (
                        <img
                          src={companyInfo.logo}
                          className="w-full h-full object-contain"
                          alt="Logo"
                        />
                      ) : (
                        <Building className="w-12 h-12 text-slate-600" />
                      )}
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                        <Upload className="w-8 h-8 text-white" />
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleLogoUpload}
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <p className="text-sm font-black text-white uppercase tracking-widest">
                      Company Logo
                    </p>
                    <p className="text-xs text-slate-500 mt-2 font-bold">
                      Recommended: 512x512px SVG or PNG
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-[#6D28D9]"
                      value={companyInfo.name}
                      onChange={(e) =>
                        setCompanyInfo({ ...companyInfo, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                      Company Email
                    </label>
                    <input
                      type="email"
                      className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-[#6D28D9]"
                      value={companyInfo.email}
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-[#6D28D9]"
                      value={companyInfo.contact}
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          contact: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                      Time Zone
                    </label>
                    <select
                      className="px-6 py-4 rounded-2xl bg-[#0a0a1a] border border-white/10 text-white outline-none focus:ring-2 focus:ring-[#6D28D9]"
                      value={companyInfo.timezone}
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          timezone: e.target.value,
                        })
                      }
                    >
                      <option>GMT +5:30 (India)</option>
                      <option>GMT +0 (UTC)</option>
                      <option>EST (USA)</option>
                    </select>
                  </div>

                  <div className="col-span-2 flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                      Office Address
                    </label>
                    <textarea
                      rows="3"
                      className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-[#6D28D9] resize-none"
                      value={companyInfo.address}
                      onChange={(e) =>
                        setCompanyInfo({
                          ...companyInfo,
                          address: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-white/10">
                  <button className="btn-enterprise btn-lavender px-12 py-4 rounded-2xl flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Save Configuration
                  </button>
                </div>
              </motion.div>
            )}

            {activeSection === "departments" && (
              <motion.div
                key="departments"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 p-10 shadow-2xl flex flex-col gap-10 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                      <Building className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">
                      Department Management
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setEditingDept(null);
                      setNewDept({
                        name: "",
                        headOfDept: "",
                        status: "Active",
                      });
                      setShowAddDept(true);
                    }}
                    className="btn-enterprise btn-mint px-6 py-3 rounded-xl flex items-center gap-2 text-xs"
                  >
                    <Plus className="w-4 h-4" />
                    New Department
                  </button>
                </div>

                {/* Add/Edit Department Modal */}
                {showAddDept && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                      onClick={() => setShowAddDept(false)}
                    ></div>
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative bg-[#0a0a1a] border border-white/10 rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl"
                    >
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">
                          {editingDept ? "Update Dept" : "New Dept"}
                        </h3>
                        <button
                          onClick={() => setShowAddDept(false)}
                          className="text-slate-500 hover:text-white"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                      <form
                        onSubmit={handleAddDept}
                        className="flex flex-col gap-6"
                      >
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                            Dept Name
                          </label>
                          <input
                            type="text"
                            required
                            className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-[#10B981]"
                            value={newDept.name}
                            onChange={(e) =>
                              setNewDept({ ...newDept, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                            Head of Dept
                          </label>
                          <input
                            type="text"
                            required
                            className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-[#10B981]"
                            value={newDept.headOfDept}
                            onChange={(e) =>
                              setNewDept({
                                ...newDept,
                                headOfDept: e.target.value,
                              })
                            }
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn-enterprise btn-mint py-4 rounded-2xl font-black uppercase tracking-widest text-xs mt-4"
                        >
                          {editingDept
                            ? "Update Records"
                            : "Establish Department"}
                        </button>
                      </form>
                    </motion.div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-6 relative z-10">
                  {departments.length === 0 ? (
                    <div className="col-span-2 text-center py-10 text-slate-500 font-bold italic">
                      No departments registered.
                    </div>
                  ) : (
                    departments.map((dept) => (
                      <div
                        key={dept._id}
                        className="bg-white/5 border border-white/5 rounded-[2rem] p-6 hover:bg-white/[0.08] transition-all group"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex flex-col">
                            <h4 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors tracking-tight">
                              {dept.name}
                            </h4>
                            <span className="text-xs text-slate-500 font-bold mt-1">
                              Head: {dept.headOfDept}
                            </span>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${dept.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"}`}
                          >
                            {dept.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-600" />
                            <span className="text-sm font-black text-white">
                              Active Ops
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingDept(dept);
                                setNewDept({
                                  name: dept.name,
                                  headOfDept: dept.headOfDept,
                                  status: dept.status,
                                });
                                setShowAddDept(true);
                              }}
                              className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDept(dept._id)}
                              className="p-2 rounded-lg bg-white/5 text-rose-400 hover:bg-rose-500/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeSection === "roles" && (
              <motion.div
                key="roles"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 p-10 shadow-2xl flex flex-col gap-10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Role Architecture & Permissions
                  </h2>
                </div>
                <div className="grid gap-6">
                  {[
                    {
                      role: "Super Admin",
                      access: [
                        "Full System Control",
                        "Financial Access",
                        "User Deletion",
                      ],
                      users: 1,
                    },
                    {
                      role: "HR Executive",
                      access: [
                        "Employee Management",
                        "Leave Approvals",
                        "Queries",
                      ],
                      users: 3,
                    },
                    {
                      role: "Standard Employee",
                      access: [
                        "Personal Dashboard",
                        "Leave Request",
                        "Attendance",
                      ],
                      users: 450,
                    },
                  ].map((role, i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 hover:bg-white/[0.08] transition-all group"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div className="flex flex-col gap-3">
                          <h4 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors tracking-tight uppercase">
                            {role.role}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {role.access.map((perm, j) => (
                              <span
                                key={j}
                                className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/5"
                              >
                                {perm}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-3xl font-black text-white">
                            {role.users}
                          </span>
                          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                            Active Entities
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection === "attendance" && (
              <motion.div
                key="attendance"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 p-10 shadow-2xl flex flex-col gap-10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Attendance & Leave Policy
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col gap-6">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-4">
                      Standard Shift
                    </h4>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-black">
                        Clock-In Window
                      </span>
                      <input
                        type="time"
                        defaultValue="09:00"
                        className="bg-[#0a0a1a] text-white px-4 py-2 rounded-lg border border-white/10 outline-none"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-black">
                        Clock-Out Window
                      </span>
                      <input
                        type="time"
                        defaultValue="18:00"
                        className="bg-[#0a0a1a] text-white px-4 py-2 rounded-lg border border-white/10 outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col gap-6">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-4">
                      Leave Quota (Annual)
                    </h4>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-black">
                        Sick Leave
                      </span>
                      <input
                        type="number"
                        defaultValue="12"
                        className="bg-[#0a0a1a] text-white px-4 py-2 rounded-lg border border-white/10 w-20 outline-none"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-black">
                        Earned Leave
                      </span>
                      <input
                        type="number"
                        defaultValue="18"
                        className="bg-[#0a0a1a] text-white px-4 py-2 rounded-lg border border-white/10 w-20 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 p-10 shadow-2xl flex flex-col gap-10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
                    <Bell className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Communication & Alerts
                  </h2>
                </div>
                <div className="flex flex-col gap-6">
                  {[
                    {
                      label: "Email System",
                      desc: "Automated workflow notifications.",
                      enabled: true,
                    },
                    {
                      label: "Internal Messages",
                      desc: "Dashboard alert notifications.",
                      enabled: true,
                    },
                    {
                      label: "Security Alerts",
                      desc: "Immediate critical system alerts.",
                      enabled: true,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-white uppercase tracking-widest">
                          {item.label}
                        </span>
                        <p className="text-xs text-slate-500 font-bold">
                          {item.desc}
                        </p>
                      </div>
                      <div
                        className={`w-14 h-7 rounded-full relative cursor-pointer transition-all ${item.enabled ? "bg-[#10B981]" : "bg-white/10"}`}
                      >
                        <div
                          className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${item.enabled ? "left-8" : "left-1"}`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 p-10 shadow-2xl flex flex-col gap-10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Enterprise Security
                  </h2>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col gap-4">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-xs text-slate-500 font-bold">
                      Require 2FA for all administrative accounts.
                    </p>
                    <button className="w-fit px-6 py-2 rounded-lg bg-[#6D28D9]/20 text-[#6D28D9] border border-[#6D28D9]/30 text-[10px] font-black uppercase tracking-widest hover:bg-[#6D28D9] hover:text-white transition-all">
                      Enable Security Protocol
                    </button>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col gap-4">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">
                      Session Management
                    </h4>
                    <p className="text-xs text-slate-500 font-bold">
                      Auto-terminate inactive administrative sessions.
                    </p>
                    <select className="w-fit bg-[#0a0a1a] text-white px-4 py-2 rounded-lg border border-white/10 outline-none text-xs font-bold">
                      <option>15 Minutes</option>
                      <option>30 Minutes</option>
                      <option>1 Hour</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "data" && (
              <motion.div
                key="data"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 p-10 shadow-2xl flex flex-col gap-10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                    <Database className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Data Control & Backup
                  </h2>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-white">
                      <Save className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tight">
                        Critical Snapshot
                      </h4>
                      <p className="text-sm text-slate-400 font-bold">
                        Full database backup to secure cloud nodes.
                      </p>
                    </div>
                  </div>
                  <button className="btn-enterprise btn-lavender px-10 py-5 rounded-2xl whitespace-nowrap">
                    Initiate Backup
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col gap-4">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">
                      Data Retention
                    </h4>
                    <p className="text-xs text-slate-500 font-bold">
                      Clear system logs older than 90 days.
                    </p>
                    <button className="w-fit px-6 py-2 rounded-lg bg-white/5 text-slate-400 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all">
                      Clear Logs
                    </button>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col gap-4">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">
                      Maintenance Mode
                    </h4>
                    <p className="text-xs text-slate-500 font-bold">
                      Suspend all non-admin access for maintenance.
                    </p>
                    <div className="w-14 h-7 rounded-full bg-white/10 relative cursor-pointer">
                      <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
