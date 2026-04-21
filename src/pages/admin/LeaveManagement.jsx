import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  FileText,
  User,
  Building,
  Trash2,
  Printer,
  CheckCircle,
  XCircle,
  Edit2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster, toast } from "sonner";

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    employeeId: "",
    internalId: "",
    totalDays: "",
    startDate: "",
    endDate: "",
    department: "",
    purpose: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [leavesRes, employeesRes] = await Promise.all([
        fetch("https://ems-backend.vercel.app/api/leaves", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://ems-backend.vercel.app/api/employees", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const leavesData = await leavesRes.json();
      const employeesData = await employeesRes.json();
      setLeaves(Array.isArray(leavesData) ? leavesData : []);
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://ems-backend.vercel.app/api/leaves", {
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
          employeeId: "",
          internalId: "",
          totalDays: "",
          startDate: "",
          endDate: "",
          department: "",
          purpose: "",
        });
        fetchData();
        toast.success("Leave request submitted successfully!");
      } else {
        toast.error("Failed to submit leave request.");
      }
    } catch (err) {
      console.error("Error submitting leave:", err);
      toast.error("An error occurred.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://ems-backend.vercel.app/api/leaves/${selectedLeave._id}`,
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
        setSelectedLeave(null);
        fetchData();
        toast.success("Leave request updated successfully!");
      } else {
        toast.error("Failed to update leave request.");
      }
    } catch (err) {
      console.error("Error updating leave request:", err);
      toast.error("An error occurred.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://ems-backend.vercel.app/api/leaves/${selectedLeave._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        setShowDeleteModal(false);
        setSelectedLeave(null);
        fetchData();
        toast.success("Leave request deleted successfully!");
      } else {
        toast.error("Failed to delete leave request.");
      }
    } catch (err) {
      console.error("Error deleting leave request:", err);
      toast.error("An error occurred.");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://ems-backend.vercel.app/api/leaves/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );
      if (res.ok) {
        fetchData();
        toast.success(`Leave request ${status.toLowerCase()} successfully!`);
      } else {
        toast.error(`Failed to ${status.toLowerCase()} leave request.`);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("An error occurred.");
    }
  };

  const openEditModal = (leave) => {
    setSelectedLeave(leave);
    setFormData(leave);
    setShowEditModal(true);
  };

  const openDeleteModal = (leave) => {
    setSelectedLeave(leave);
    setShowDeleteModal(true);
  };

  const filteredLeaves = leaves.filter((leave) =>
    leave.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Leave Approval Flow
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Manage employee leave requests with approval logic.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Leave Record
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex flex-col sm:row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium shadow-sm text-white placeholder:text-slate-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all border border-white/10">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-white/40">
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Employee
                </th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Department name
                </th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Duration
                </th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                  Total
                </th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                  Status
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
                    colSpan="5"
                    className="py-12 text-center text-slate-500 font-bold"
                  >
                    Loading leaves...
                  </td>
                </tr>
              ) : filteredLeaves.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-12 text-center text-slate-500 font-medium italic"
                  >
                    No leave requests.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <tr
                    key={leave._id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white">
                            {leave.employee?.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-300">
                          {leave.department || "General"}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-sm font-medium text-slate-300">
                      {new Date(leave.startDate).toLocaleDateString()} -{" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-5 px-6 text-center text-sm font-black text-white tracking-tight">
                      {leave.totalDays} Days
                    </td>
                    <td className="py-5 px-6 text-right">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${leave.status === "Approved" ? "bg-emerald-100 text-emerald-700" : leave.status === "Rejected" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        {leave.status === "Pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(leave._id, "Approved")
                              }
                              className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(leave._id, "Rejected")
                              }
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openEditModal(leave)}
                          className="p-2 text-slate-400 hover:text-lavender-600 hover:bg-lavender-50 rounded-xl transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(leave)}
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

      {/* Add Leave Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative  backdrop-blur-2xl rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden border border-white"
            >
              <div className="p-8 border-b  bg-gradient-to-r from-indigo-50 to-violet-50">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Apply for Leave
                </h2>
                <p className="text-slate-500 text-sm mt-1 font-medium">
                  Create a new leave request for an employee.
                </p>
              </div>
              <form onSubmit={handleAddSubmit} className="p-8 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    Employee
                  </label>
                  <select
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold shadow-sm"
                    value={formData.employeeId}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeId: e.target.value })
                    }
                  >
                    <option value="">Select Employee</option>
                    {employees.map((e) => (
                      <option key={e._id} value={e._id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      Internal ID
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-4 rounded-xl  border-slate-100 text-sm font-bold"
                      value={formData.internalId}
                      onChange={(e) =>
                        setFormData({ ...formData, internalId: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      Dept
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-4 rounded-xl  border-slate-100 text-sm font-bold"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-4 rounded-xl  border border-slate-100 text-sm font-bold"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-4 rounded-xl  border border-slate-100 text-sm font-bold"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                    Total Days
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-4 rounded-xl  border border-slate-100 text-sm font-black"
                    value={formData.totalDays}
                    onChange={(e) =>
                      setFormData({ ...formData, totalDays: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                    Purpose
                  </label>
                  <textarea
                    required
                    rows="2"
                    className="w-full px-4 py-4 rounded-xl  border border-slate-100 text-sm font-medium resize-none"
                    value={formData.purpose}
                    onChange={(e) =>
                      setFormData({ ...formData, purpose: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 border border-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Leave Modal */}
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
              className="relative  backdrop-blur-2xl rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden border border-white"
            >
              <div className="p-8 border-b  bg-gradient-to-r from-indigo-50 to-violet-50">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Edit Leave Request
                </h2>
                <p className="text-slate-500 text-sm mt-1 font-medium">
                  Update the leave request for {selectedLeave?.employee?.name}.
                </p>
              </div>
              <form onSubmit={handleEditSubmit} className="p-8 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    Employee
                  </label>
                  <select
                    required
                    className="w-full px-6 py-4 rounded-2xl  border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold shadow-sm"
                    value={formData.employeeId}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeId: e.target.value })
                    }
                  >
                    <option value="">Select Employee</option>
                    {employees.map((e) => (
                      <option key={e._id} value={e._id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      Internal ID
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-4 rounded-xl  border border-slate-100 text-sm font-bold"
                      value={formData.internalId}
                      onChange={(e) =>
                        setFormData({ ...formData, internalId: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      Dept
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-4 rounded-xl  border border-slate-100 text-sm font-bold"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-4 rounded-xl  border border-slate-100 text-sm font-bold"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-4 rounded-xl  border border-slate-100 text-sm font-bold"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                    Total Days
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-4 rounded-xl  border border-slate-100 text-sm font-black"
                    value={formData.totalDays}
                    onChange={(e) =>
                      setFormData({ ...formData, totalDays: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                    Purpose
                  </label>
                  <textarea
                    required
                    rows="2"
                    className="w-full px-4 py-4 rounded-xl bg-white border border-slate-100 text-sm font-medium resize-none"
                    value={formData.purpose}
                    onChange={(e) =>
                      setFormData({ ...formData, purpose: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-4 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 border border-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all"
                  >
                    Update
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
              className="relative bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden border border-white"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto">
                  <Trash2 className="w-10 h-10 text-rose-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-6">
                  Delete Leave Request
                </h2>
                <p className="text-slate-500 text-sm mt-2 font-medium">
                  Are you sure you want to delete this leave request? This
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
