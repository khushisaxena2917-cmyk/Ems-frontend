import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  User,
  Printer,
  Trash2,
  Edit2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster, toast } from "sonner";

export default function Payroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    employee: "",
    basicSalary: "",
    bonuses: 0,
    deductions: 0,
    paymentDate: "",
    status: "Pending",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [payRes, empRes] = await Promise.all([
        fetch("https://ems-backend.vercel.app/api/payrolls"),
        fetch("https://ems-backend.vercel.app/api/employees"),
      ]);
      setPayrolls(await payRes.json());
      setEmployees(await empRes.json());
      setLoading(false);
    } catch (err) {
      console.error("Error fetching payroll data:", err);
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const netSalary =
      parseFloat(formData.basicSalary) +
      parseFloat(formData.bonuses) -
      parseFloat(formData.deductions);
    try {
      const res = await fetch("https://ems-backend.vercel.app/api/payrolls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, netSalary }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setFormData({
          employee: "",
          basicSalary: "",
          bonuses: 0,
          deductions: 0,
          paymentDate: "",
          status: "Pending",
        });
        fetchData();
        toast.success("Payroll record created successfully!");
      } else {
        toast.error("Failed to create payroll record.");
      }
    } catch (err) {
      console.error("Error creating payroll record:", err);
      toast.error("An error occurred.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const netSalary =
      parseFloat(formData.basicSalary) +
      parseFloat(formData.bonuses) -
      parseFloat(formData.deductions);
    try {
      const res = await fetch(
        `https://ems-backend.vercel.app/api/payrolls/${selectedPayroll._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, netSalary }),
        },
      );
      if (res.ok) {
        setShowEditModal(false);
        setSelectedPayroll(null);
        fetchData();
        toast.success("Payroll record updated successfully!");
      } else {
        toast.error("Failed to update payroll record.");
      }
    } catch (err) {
      console.error("Error updating payroll record:", err);
      toast.error("An error occurred.");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `https://ems-backend.vercel.app/api/payrolls/${selectedPayroll._id}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        setShowDeleteModal(false);
        setSelectedPayroll(null);
        fetchData();
        toast.success("Payroll record deleted successfully!");
      } else {
        toast.error("Failed to delete payroll record.");
      }
    } catch (err) {
      console.error("Error deleting payroll record:", err);
      toast.error("An error occurred.");
    }
  };

  const openEditModal = (payroll) => {
    setSelectedPayroll(payroll);
    setFormData(payroll);
    setShowEditModal(true);
  };

  const openDeleteModal = (payroll) => {
    setSelectedPayroll(payroll);
    setShowDeleteModal(true);
  };

  const handlePrint = () => window.print();

  const filteredPayrolls = payrolls.filter((payroll) =>
    payroll.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <Toaster richColors position="top-center" />
      <style>{`@media print { .no-print { display: none !important; } .print-only { display: block !important; } table { font-size: 10px !important; } } .print-only { display: none; }`}</style>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Payroll Management
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage employee salaries and professional reports.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/40 text-slate-700 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-sm hover:shadow-md"
          >
            <Printer className="w-4 h-4" /> Print Report
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-lavender-600 to-indigo-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Record
          </button>
        </div>
      </div>

      <div className=" backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-white/40 flex flex-col sm:row justify-between items-center gap-4 no-print">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search payroll..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl  border border-white focus:ring-2 focus:ring-lavender-500 outline-none transition-all text-sm font-medium shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-lavender-600 px-4 py-2.5 rounded-xl hover:bg-white/60 transition-all border border-white">
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
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                  Basic
                </th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                  Bonus
                </th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                  Deduct
                </th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                  Net
                </th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                  Date
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
                    colSpan="8"
                    className="py-12 text-center text-slate-500 font-bold"
                  >
                    Loading payroll...
                  </td>
                </tr>
              ) : filteredPayrolls.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="py-12 text-center text-slate-500 font-medium italic"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredPayrolls.map((pay) => (
                  <tr
                    key={pay._id}
                    className="hover:bg-white/40 transition-colors group"
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-lavender-50 flex items-center justify-center text-lavender-600 group-hover:bg-lavender-600 group-hover:text-white transition-all shadow-sm">
                          <User className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {pay.employee?.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center text-sm font-medium text-slate-600">
                      ${pay.basicSalary}
                    </td>
                    <td className="py-5 px-6 text-center text-sm font-medium text-emerald-600">
                      +${pay.bonuses}
                    </td>
                    <td className="py-5 px-6 text-center text-sm font-medium text-rose-500">
                      -${pay.deductions}
                    </td>
                    <td className="py-5 px-6 text-center text-sm font-black text-slate-900 tracking-tight">
                      ${pay.netSalary}
                    </td>
                    <td className="py-5 px-6 text-center text-sm text-slate-600">
                      {new Date(pay.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="py-5 px-6 text-right">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${pay.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-right no-print">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(pay)}
                          className="p-2 text-slate-400 hover:text-lavender-600 hover:bg-lavender-50 rounded-xl transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(pay)}
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

      {/* Add Payroll Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print">
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
              className="relative  backdrop-blur-2xl rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white"
            >
              <div className="p-8 border-b  bg-gradient-to-r from-lavender-50 to-indigo-50">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Generate Payroll
                </h2>
                <p className="text-slate-500 text-sm mt-1 font-medium">
                  Create a new professional payment record.
                </p>
              </div>
              <form onSubmit={handleAddSubmit} className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    Employee
                  </label>
                  <select
                    required
                    className="w-full px-6 py-4 rounded-2xl  border border-slate-100 focus:ring-2 focus:ring-lavender-500 outline-none transition-all text-sm font-bold shadow-sm"
                    value={formData.employee}
                    onChange={(e) =>
                      setFormData({ ...formData, employee: e.target.value })
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
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      Basic
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-4 rounded-xl  border border-slate-100 text-sm font-bold"
                      value={formData.basicSalary}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          basicSalary: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      Bonus
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-4 rounded-xl  border border-slate-100 text-sm font-bold"
                      value={formData.bonuses}
                      onChange={(e) =>
                        setFormData({ ...formData, bonuses: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      Deduct
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-4 rounded-xl  border border-slate-100 text-sm font-bold"
                      value={formData.deductions}
                      onChange={(e) =>
                        setFormData({ ...formData, deductions: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-6 py-4 rounded-2xl  border border-slate-100 focus:ring-2 focus:ring-lavender-500 outline-none transition-all text-sm font-bold"
                    value={formData.paymentDate}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentDate: e.target.value })
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
                    className="flex-1 py-4 bg-gradient-to-r from-lavender-600 to-indigo-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all"
                  >
                    Generate
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Payroll Modal */}
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
              className="relative  backdrop-blur-2xl rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white"
            >
              <div className="p-8 border-b border-white bg-gradient-to-r from-lavender-50 to-indigo-50">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Edit Payroll
                </h2>
                <p className="text-slate-500 text-sm mt-1 font-medium">
                  Update the payroll record for{" "}
                  {selectedPayroll?.employee?.name}.
                </p>
              </div>
              <form onSubmit={handleEditSubmit} className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    Employee
                  </label>
                  <select
                    required
                    className="w-full px-6 py-4 rounded-2xl  border border-slate-100 focus:ring-2 focus:ring-lavender-500 outline-none transition-all text-sm font-bold shadow-sm"
                    value={formData.employee}
                    onChange={(e) =>
                      setFormData({ ...formData, employee: e.target.value })
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
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      Basic
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-4 rounded-xl border border-slate-100 text-sm font-bold"
                      value={formData.basicSalary}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          basicSalary: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      Bonus
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-4 rounded-xl  border border-slate-100 text-sm font-bold"
                      value={formData.bonuses}
                      onChange={(e) =>
                        setFormData({ ...formData, bonuses: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      Deduct
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-4 rounded-xl  border border-slate-100 text-sm font-bold"
                      value={formData.deductions}
                      onChange={(e) =>
                        setFormData({ ...formData, deductions: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-6 py-4 rounded-2xl  border border-slate-100 focus:ring-2 focus:ring-lavender-500 outline-none transition-all text-sm font-bold"
                    value={formData.paymentDate}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentDate: e.target.value })
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
              className="relative  backdrop-blur-2xl rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden border border-white"
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
