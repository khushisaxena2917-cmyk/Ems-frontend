import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  User,
  Mail,
  Calendar,
  Briefcase,
  DollarSign,
  Trash2,
  Edit2,
  Contact,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster, toast } from "sonner";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    doj: "",
    designation: "",
    department: "",
    salary: "",
    contact: "",
    address: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [inlineFormData, setInlineFormData] = useState({});

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://ems-backend.vercel.app/api/departments",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const handleInlineSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://ems-backend.vercel.app/api/employees/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(inlineFormData),
        },
      );
      if (res.ok) {
        setEditingId(null);
        fetchEmployees();
        toast.success("Employee updated directly!");
      } else {
        toast.error("Failed to update employee.");
      }
    } catch (err) {
      console.error("Error updating employee inline:", err);
      toast.error("An error occurred.");
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://ems-backend.vercel.app/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://ems-backend.vercel.app/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowAddModal(false);
        setFormData({
          name: "",
          email: "",
          dob: "",
          doj: "",
          designation: "",
          salary: "",
          contact: "",
          address: "",
        });
        fetchEmployees();
        toast.success("Employee added successfully!");
      } else {
        toast.error("Failed to add employee.");
      }
    } catch (err) {
      console.error("Error creating employee:", err);
      toast.error("An error occurred.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://ems-backend.vercel.app/api/employees/${selectedEmployee._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );
      if (res.ok) {
        setShowEditModal(false);
        setSelectedEmployee(null);
        fetchEmployees();
        toast.success("Employee updated successfully!");
      } else {
        toast.error("Failed to update employee.");
      }
    } catch (err) {
      console.error("Error updating employee:", err);
      toast.error("An error occurred.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://ems-backend.vercel.app/api/employees/${selectedEmployee._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        setShowDeleteModal(false);
        setSelectedEmployee(null);
        fetchEmployees();
        toast.success("Employee deleted successfully!");
      } else {
        toast.error("Failed to delete employee.");
      }
    } catch (err) {
      console.error("Error deleting employee:", err);
      toast.error("An error occurred.");
    }
  };

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setFormData(employee);
    setShowEditModal(true);
  };

  const openDeleteModal = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee._id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <Toaster richColors position="top-center" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Employee Management
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-bold">
            Manage all employees of Saxena's Group of Industries.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-enterprise btn-lavender"
        >
          <Plus className="w-5 h-5" />
          Add Employee
        </button>
      </div>

      <div className="card-enterprise">
        <div className="card-header-lavender flex flex-col sm:row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees..."
              spellCheck="false"
              className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/60 border border-white focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all text-sm font-bold text-slate-800 shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
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
                  Employee
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Designation
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Department
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  DOJ
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                  Salary
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
                    colSpan="5"
                    className="py-12 text-center text-slate-500 font-black uppercase tracking-widest text-xs"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-12 text-center text-slate-500 font-bold italic"
                  >
                    No employees found.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp._id}
                    className={`${editingId === emp._id ? "bg-lavender-50/50" : "hover:bg-white/60"} transition-colors group`}
                  >
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#6D28D9]/5 flex items-center justify-center text-[#6D28D9] group-hover:bg-[#6D28D9] group-hover:text-white transition-all shadow-sm border border-white/10">
                          <User className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                          {editingId === emp._id ? (
                            <input
                              type="text"
                              className="text-sm font-black text-slate-800 bg-white border border-lavender-200 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-lavender-500"
                              value={inlineFormData.name}
                              onChange={(e) =>
                                setInlineFormData({
                                  ...inlineFormData,
                                  name: e.target.value,
                                })
                              }
                            />
                          ) : (
                            <span className="text-sm font-black text-white">
                              {emp.name}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {emp.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8 text-sm font-bold text-slate-300">
                      {editingId === emp._id ? (
                        <input
                          type="text"
                          className="text-sm font-bold text-slate-800 bg-white border border-lavender-200 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-lavender-500"
                          value={inlineFormData.designation}
                          onChange={(e) =>
                            setInlineFormData({
                              ...inlineFormData,
                              designation: e.target.value,
                            })
                          }
                        />
                      ) : (
                        emp.designation
                      )}
                    </td>
                    <td className="py-5 px-8 text-sm font-bold text-slate-300">
                      {editingId === emp._id ? (
                        <select
                          className="text-sm font-bold text-slate-800 bg-white border border-lavender-200 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-lavender-500"
                          value={inlineFormData.department}
                          onChange={(e) =>
                            setInlineFormData({
                              ...inlineFormData,
                              department: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Dept</option>
                          {departments.map((dept) => (
                            <option key={dept._id} value={dept.name}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        emp.department || "N/A"
                      )}
                    </td>
                    <td className="py-5 px-8 text-sm font-bold text-slate-300">
                      {new Date(emp.doj).toLocaleDateString()}
                    </td>
                    <td className="py-5 px-8 text-right text-sm font-black text-white tracking-tight">
                      {editingId === emp._id ? (
                        <input
                          type="number"
                          className="w-24 text-right text-sm font-black text-slate-800 bg-white border border-lavender-200 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-lavender-500"
                          value={inlineFormData.salary}
                          onChange={(e) =>
                            setInlineFormData({
                              ...inlineFormData,
                              salary: e.target.value,
                            })
                          }
                        />
                      ) : (
                        `$${emp.salary}`
                      )}
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex justify-end gap-3">
                        {editingId === emp._id ? (
                          <>
                            <button
                              onClick={() => handleInlineSave(emp._id)}
                              className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingId(emp._id);
                                setInlineFormData(emp);
                              }}
                              className="p-2.5 text-slate-400 hover:text-[#6D28D9] hover:bg-[#6D28D9]/10 rounded-lg transition-all"
                              title="Direct Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(emp)}
                              className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#11112a] rounded-[2.5rem] shadow-[0_0_50px_rgba(109,40,217,0.3)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-white/10"
            >
              <div className="p-8 border-b border-white/10 bg-gradient-to-r from-[#6D28D9]/20 to-transparent shrink-0">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Add New Employee
                </h2>
                <p className="text-slate-400 text-sm mt-1 font-bold">
                  Enter the details for the new team member.
                </p>
              </div>
              <form
                onSubmit={handleAddSubmit}
                className="flex flex-col flex-1 overflow-hidden bg-[#11112a]"
              >
                <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 gap-x-6 gap-y-5 custom-scrollbar">
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      spellCheck="false"
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:ring-2 focus:ring-[#6D28D9] focus:bg-white/10 outline-none transition-all placeholder:text-slate-500"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      spellCheck="false"
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:ring-2 focus:ring-[#6D28D9] focus:bg-white/10 outline-none transition-all placeholder:text-slate-500"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:ring-2 focus:ring-[#6D28D9] focus:bg-white/10 outline-none transition-all"
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      Date of Joining
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:ring-2 focus:ring-[#6D28D9] focus:bg-white/10 outline-none transition-all"
                      value={formData.doj}
                      onChange={(e) =>
                        setFormData({ ...formData, doj: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      required
                      spellCheck="false"
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:ring-2 focus:ring-[#6D28D9] focus:bg-white/10 outline-none transition-all placeholder:text-slate-500"
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          designation: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      Department
                    </label>
                    <select
                      required
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:ring-2 focus:ring-[#6D28D9] focus:bg-white/10 outline-none transition-all appearance-none cursor-pointer"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                    >
                      <option value="" className="bg-[#11112a]">
                        Select Department
                      </option>
                      {departments.map((dept) => (
                        <option
                          key={dept._id}
                          value={dept.name}
                          className="bg-[#11112a]"
                        >
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      Salary
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:ring-2 focus:ring-[#6D28D9] focus:bg-white/10 outline-none transition-all placeholder:text-slate-500"
                      value={formData.salary}
                      onChange={(e) =>
                        setFormData({ ...formData, salary: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      Contact
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:ring-2 focus:ring-[#6D28D9] focus:bg-white/10 outline-none transition-all placeholder:text-slate-500"
                      value={formData.contact}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      Address
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:ring-2 focus:ring-[#6D28D9] focus:bg-white/10 outline-none transition-all placeholder:text-slate-500"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="p-8 border-t border-white/10 flex gap-4 shrink-0 bg-[#11112a]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 text-slate-400 font-black rounded-xl hover:bg-white/5 transition-all active:scale-95 border border-white/10 uppercase tracking-widest text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-[#6D28D9] text-white font-black rounded-xl hover:bg-[#7C3AED] shadow-lg shadow-[#6D28D9]/30 active:scale-95 transition-all uppercase tracking-widest text-xs"
                  >
                    Add Employee
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Employee Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#11112a] rounded-[2.5rem] shadow-[0_0_50px_rgba(109,40,217,0.3)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-white/10"
            >
              <div className="p-8 border-b border-white/10 bg-gradient-to-r from-lavender-900/40 to-transparent shrink-0">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Edit Employee
                </h2>
                <p className="text-slate-400 text-sm mt-1 font-medium">
                  Update the details for {selectedEmployee?.name}.
                </p>
              </div>
              <form
                onSubmit={handleEditSubmit}
                className="flex flex-col flex-1 overflow-hidden bg-[#11112a]"
              >
                <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 gap-x-6 gap-y-5 custom-scrollbar">
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      spellCheck="false"
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:ring-2 focus:ring-lavender-500 focus:bg-white/10 outline-none transition-all placeholder:text-slate-500"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      spellCheck="false"
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:ring-2 focus:ring-lavender-500 focus:bg-white/10 outline-none transition-all placeholder:text-slate-500"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:ring-2 focus:ring-lavender-500 focus:bg-white/10 outline-none transition-all"
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      Date of Joining
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:ring-2 focus:ring-lavender-500 focus:bg-white/10 outline-none transition-all"
                      value={formData.doj}
                      onChange={(e) =>
                        setFormData({ ...formData, doj: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      required
                      spellCheck="false"
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:ring-2 focus:ring-lavender-500 focus:bg-white/10 outline-none transition-all placeholder:text-slate-500"
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          designation: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      Department
                    </label>
                    <select
                      required
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:ring-2 focus:ring-lavender-500 focus:bg-white/10 outline-none transition-all appearance-none cursor-pointer"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                    >
                      <option value="" className="bg-[#11112a]">
                        Select Department
                      </option>
                      {departments.map((dept) => (
                        <option
                          key={dept._id}
                          value={dept.name}
                          className="bg-[#11112a]"
                        >
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      Salary
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:ring-2 focus:ring-lavender-500 focus:bg-white/10 outline-none transition-all placeholder:text-slate-500"
                      value={formData.salary}
                      onChange={(e) =>
                        setFormData({ ...formData, salary: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      Contact
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:ring-2 focus:ring-lavender-500 focus:bg-white/10 outline-none transition-all placeholder:text-slate-500"
                      value={formData.contact}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                      Address
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:ring-2 focus:ring-lavender-500 focus:bg-white/10 outline-none transition-all placeholder:text-slate-500"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="p-8 border-t border-white/10 flex gap-4 shrink-0 bg-[#11112a]">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-4 text-slate-400 font-bold rounded-xl hover:bg-white/5 border border-white/10 transition-all active:scale-95 uppercase tracking-widest text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-r from-lavender-600 to-indigo-600 text-white font-black rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs"
                  >
                    Update Employee
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative  backdrop-blur-2xl rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden border border-white"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto">
                  <Trash2 className="w-10 h-10 text-rose-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-6">
                  Delete Employee
                </h2>
                <p className="text-slate-500 text-sm mt-2 font-medium">
                  Are you sure you want to delete {selectedEmployee?.name}? This
                  action cannot be undone.
                </p>
                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-4 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 border border-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 py-4 bg-rose-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
