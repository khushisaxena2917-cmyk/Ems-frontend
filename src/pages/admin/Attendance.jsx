import React, { useState, useEffect } from "react";
import {
  Trash2,
  Search,
  Filter,
  Clock,
  Printer,
  User,
  Calendar,
  Edit2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster, toast } from "sonner";

export default function AdminAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    status: "",
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://ems-backend.vercel.app/api/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAttendanceData(
        Array.isArray(data)
          ? data.sort((a, b) => new Date(b.date) - new Date(a.date))
          : [],
      );
      setLoading(false);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://ems-backend.vercel.app/api/attendance/${selectedRecord._id}`,
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
        setSelectedRecord(null);
        fetchAttendance();
        toast.success("Attendance record updated successfully!");
      } else {
        toast.error("Failed to update attendance record.");
      }
    } catch (err) {
      console.error("Error updating attendance record:", err);
      toast.error("An error occurred.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://ems-backend.vercel.app/api/attendance/${selectedRecord._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        setShowDeleteModal(false);
        setSelectedRecord(null);
        fetchAttendance();
        toast.success("Attendance record deleted successfully!");
      } else {
        toast.error("Failed to delete attendance record.");
      }
    } catch (err) {
      console.error("Error deleting attendance record:", err);
      toast.error("An error occurred.");
    }
  };

  const openEditModal = (record) => {
    setSelectedRecord(record);
    setFormData(record);
    setShowEditModal(true);
  };

  const openDeleteModal = (record) => {
    setSelectedRecord(record);
    setShowDeleteModal(true);
  };

  const handlePrint = () => window.print();

  const filteredAttendance = attendanceData.filter((record) =>
    record.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <Toaster richColors position="top-center" />
      <style>{`@media print { .no-print { display: none !important; } .print-only { display: block !important; } } .print-only { display: none; }`}</style>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            E-Attendance Records
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-bold">
            Track real-time check-ins and professional reports.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-white/40 backdrop-blur-md border border-white/40 text-slate-700 px-4 py-2.5 rounded-2xl text-sm font-bold shadow-sm hover:shadow-md transition-all"
        >
          <Printer className="w-4 h-4" /> Print Report
        </button>
      </div>

      <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-white/40 flex flex-col sm:row justify-between items-center gap-4 no-print">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee..."
              spellCheck="false"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/60 border border-white focus:ring-2 focus:ring-mint-500 outline-none transition-all text-sm font-bold text-slate-800 shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="date"
              className="px-4 py-2.5 rounded-xl border border-white bg-white/60 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-mint-500 shadow-sm"
            />
            <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-mint-600 px-4 py-2.5 rounded-xl hover:bg-white/60 transition-all border border-white backdrop-blur-sm">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-white/40">
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  S.N.
                </th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Employee Name
                </th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Department
                </th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Date
                </th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Login In
                </th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Log Out
                </th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                  Status
                </th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right no-print">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-12 text-center text-slate-500 font-bold"
                  >
                    Loading records...
                  </td>
                </tr>
              ) : filteredAttendance.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-12 text-center text-slate-500 font-medium italic"
                  >
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((record, index) => (
                  <tr
                    key={record._id}
                    className="hover:bg-white/40 transition-colors group"
                  >
                    <td className="py-5 px-6 text-sm text-slate-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#6D28D9]/5 flex items-center justify-center text-[#6D28D9] group-hover:bg-[#6D28D9] group-hover:text-white transition-all shadow-sm border border-white/10">
                          <User className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-black text-white">
                          {record.employee?.name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <span className="text-sm font-bold text-slate-300">
                        {record.department || "--"}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-sm font-black text-white uppercase tracking-tight">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="py-5 px-8 text-sm font-bold text-slate-300">
                      {record.checkIn}
                    </td>
                    <td className="py-5 px-8 text-sm font-bold text-slate-300">
                      {record.checkOut || "--:--"}
                    </td>
                    <td className="py-5 px-6 text-right">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${record.status === "Present" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-right no-print">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(record)}
                          className="p-2 text-slate-400 hover:text-lavender-600 hover:bg-lavender-50 rounded-xl transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(record)}
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

      {/* Edit Attendance Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print">
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
              className="relative bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white"
            >
              <div className="p-8 border-b  bg-gradient-to-r from-lavender-50 to-indigo-50">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Edit Attendance
                </h2>
                <p className="text-slate-500 text-sm mt-1 font-medium">
                  Update the attendance record for{" "}
                  {selectedRecord?.employee?.name}.
                </p>
              </div>
              <form
                onSubmit={handleEditSubmit}
                className="p-8 grid grid-cols-2 gap-x-6 gap-y-5"
              >
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    Check In
                  </label>
                  <input
                    type="time"
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 text-sm font-bold shadow-sm"
                    value={formData.checkIn}
                    onChange={(e) =>
                      setFormData({ ...formData, checkIn: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    Check Out
                  </label>
                  <input
                    type="time"
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 text-sm font-bold shadow-sm"
                    value={formData.checkOut}
                    onChange={(e) =>
                      setFormData({ ...formData, checkOut: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    Status
                  </label>
                  <select
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 text-sm font-bold shadow-sm"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
                <div className="col-span-2 flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-4 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 border border-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-r from-lavender-600 to-indigo-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all"
                  >
                    Update Record
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print">
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
                  Delete Record
                </h2>
                <p className="text-slate-500 text-sm mt-2 font-medium">
                  Are you sure you want to delete this record? This action
                  cannot be undone.
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
