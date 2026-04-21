import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CalendarCheck,
  FileText,
  Clock,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Eye,
  Printer,
  ChevronRight,
  User,
  Plus,
  X,
  Users,
} from "lucide-react";

export default function LeavesAttendance() {
  const [activeTab, setActiveTab] = useState("leaves");
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualData, setManualData] = useState({
    employeeId: "",
    department: "",
    checkIn: "09:00",
    status: "Present",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [leavesRes, attendanceRes, employeesRes] = await Promise.all([
          fetch("https://ems-backend.vercel.app/api/leaves", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://ems-backend.vercel.app/api/attendance", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://ems-backend.vercel.app/api/employees", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const [leavesData, attendanceData, employeesData] = await Promise.all([
          leavesRes.ok ? leavesRes.json() : Promise.resolve([]),
          attendanceRes.ok ? attendanceRes.json() : Promise.resolve([]),
          employeesRes.ok ? employeesRes.json() : Promise.resolve([]),
        ]);
        setLeaves(Array.isArray(leavesData) ? leavesData : []);
        setAttendance(Array.isArray(attendanceData) ? attendanceData : []);
        setEmployees(Array.isArray(employeesData) ? employeesData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLeaveAction = async (id, status) => {
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
        setLeaves(leaves.map((l) => (l._id === id ? { ...l, status } : l)));
      } else {
        const data = await res.json();
        console.error("Failed to update leave status:", data.message);
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  const handleManualAttendance = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://ems-backend.vercel.app/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...manualData,
          date: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        const newRecord = await res.json();
        setAttendance([newRecord, ...attendance]);
        setShowManualModal(false);
        setManualData({
          employeeId: "",
          department: "",
          checkIn: "09:00",
          status: "Present",
        });
        toast.success("Manual attendance record added successfully!");
      } else {
        toast.error("Failed to add manual attendance record.");
      }
    } catch (error) {
      console.error("Error creating attendance:", error);
      toast.error("An error occurred while adding attendance.");
    }
  };

  const filteredLeaves = leaves.filter(
    (l) =>
      l.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredAttendance = attendance.filter(
    (a) =>
      a.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredEmployeesList = employees.filter(
    (e) =>
      e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handlePrint = () => {
    const printContent = document.getElementById("report-content");
    const originalContent = document.body.innerHTML;
    const printStyles = `
      <style>
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        h1 { text-align: center; color: #333; }
        .print-header { margin-bottom: 30px; border-bottom: 2px solid #6D28D9; padding-bottom: 10px; }
        @media print {
          .no-print { display: none; }
          body { color: black !important; background: white !important; }
        }
      </style>
    `;

    const win = window.open("", "", "height=700,width=900");
    win.document.write(
      "<html><head><title>EMS Report - " + activeTab.toUpperCase() + "</title>",
    );
    win.document.write(printStyles);
    win.document.write("</head><body>");
    win.document.write('<div class="print-header">');
    win.document.write(
      "<h1>Saxena's Group - " +
        (activeTab === "leaves"
          ? "Leave Requests Report"
          : "Daily Attendance Report") +
        "</h1>",
    );
    win.document.write(
      "<p>Generated on: " + new Date().toLocaleString() + "</p>",
    );
    win.document.write("</div>");
    win.document.write(printContent.innerHTML);
    win.document.write("</body></html>");
    win.document.close();
    win.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Leaves & Attendance
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            Monitor employee presence and handle leave requests.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowManualModal(true)}
            className="btn-enterprise btn-mint px-8 py-4 rounded-2xl flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Mark Attendance
          </button>
          <button
            onClick={handlePrint}
            className="btn-enterprise btn-lavender px-8 py-4 rounded-2xl flex items-center gap-2"
          >
            <Printer className="w-5 h-5" />
            Print Report
          </button>
        </div>
      </div>

      {/* Manual Attendance Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowManualModal(false)}
          ></div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-[#0a0a1a] border border-white/10 rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                Manual Attendance
              </h3>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-slate-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form
              onSubmit={handleManualAttendance}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                  Select Employee
                </label>
                <select
                  required
                  className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-[#10B981] appearance-none"
                  value={manualData.employeeId}
                  onChange={(e) => {
                    const emp = employees.find(
                      (emp) => emp._id === e.target.value,
                    );
                    setManualData({
                      ...manualData,
                      employeeId: e.target.value,
                      department: emp ? emp.department : "",
                    });
                  }}
                >
                  <option value="" className="bg-[#0a0a1a]">
                    Choose Employee
                  </option>
                  {employees.map((emp) => (
                    <option
                      key={emp._id}
                      value={emp._id}
                      className="bg-[#0a0a1a]"
                    >
                      {emp.name} ({emp.department || "No Dept"})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                  Department
                </label>
                <input
                  type="text"
                  required
                  readOnly
                  placeholder="Employee Department"
                  className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 outline-none cursor-not-allowed"
                  value={manualData.department}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                    Check In
                  </label>
                  <input
                    type="time"
                    required
                    className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-[#10B981]"
                    value={manualData.checkIn}
                    onChange={(e) =>
                      setManualData({ ...manualData, checkIn: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                    Status
                  </label>
                  <select
                    className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-[#10B981] appearance-none"
                    value={manualData.status}
                    onChange={(e) =>
                      setManualData({ ...manualData, status: e.target.value })
                    }
                  >
                    <option value="Present" className="bg-[#0a0a1a]">
                      Present
                    </option>
                    <option value="Late" className="bg-[#0a0a1a]">
                      Late
                    </option>
                    <option value="Half Day" className="bg-[#0a0a1a]">
                      Half Day
                    </option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="btn-enterprise btn-mint py-4 rounded-2xl font-black uppercase tracking-widest text-xs mt-4"
              >
                Log Entry
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-white/5 backdrop-blur-md p-2 rounded-3xl w-fit border border-white/10 shadow-2xl overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab("leaves")}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === "leaves"
              ? "bg-[#6D28D9] text-white shadow-xl shadow-[#6D28D9]/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <FileText className="w-4 h-4" />
          Leave Requests
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === "attendance"
              ? "bg-[#6D28D9] text-white shadow-xl shadow-[#6D28D9]/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          Daily Attendance
        </button>
        <button
          onClick={() => setActiveTab("employees")}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === "employees"
              ? "bg-[#6D28D9] text-white shadow-xl shadow-[#6D28D9]/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Users className="w-4 h-4" />
          Employee Directory
        </button>
      </div>

      {/* Main Content Area */}
      <div id="report-content" className="flex flex-col gap-8">
        {/* Universal Filters */}
        <div className="no-print bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-4 flex flex-col md:flex-row items-center gap-6 shadow-2xl">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder={`Search ${activeTab === "leaves" ? "employee name or ID..." : "employee or department..."}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-bold text-white shadow-xl"
            />
          </div>
          <button className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "leaves" && (
            <motion.div
              key="leaves"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5">
                      <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                        Employee
                      </th>
                      <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                        Leave Type
                      </th>
                      <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                        Duration
                      </th>
                      <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                        Status
                      </th>
                      <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="py-20 text-center">
                          <div className="w-10 h-10 border-4 border-[#6D28D9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
                            Synchronizing Leaves...
                          </p>
                        </td>
                      </tr>
                    ) : filteredLeaves.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-20 text-center text-slate-500 font-bold italic"
                        >
                          No pending leave requests found.
                        </td>
                      </tr>
                    ) : (
                      filteredLeaves.map((leave) => (
                        <tr
                          key={leave._id}
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          <td className="py-6 px-8">
                            <div className="flex flex-col">
                              <span className="text-white font-black tracking-tight">
                                {leave.employeeName}
                              </span>
                              <span className="text-[10px] text-[#10B981] font-black uppercase tracking-widest">
                                {leave.employeeId}
                              </span>
                            </div>
                          </td>
                          <td className="py-6 px-8">
                            <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                              {leave.leaveType}
                            </span>
                          </td>
                          <td className="py-6 px-8">
                            <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                              <Clock className="w-4 h-4 text-[#10B981]" />
                              {new Date(leave.startDate).toLocaleDateString()}
                              <ChevronRight className="w-4 h-4 text-slate-600" />
                              {new Date(leave.endDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="py-6 px-8">
                            <span
                              className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                leave.status === "Approved"
                                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                  : leave.status === "Rejected"
                                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                    : "bg-lavender-500/10 text-lavender-400 border-lavender-500/20"
                              }`}
                            >
                              {leave.status}
                            </span>
                          </td>
                          <td className="py-6 px-8 text-right no-print">
                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  handleLeaveAction(leave._id, "Approved")
                                }
                                className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                                title="Approve Request"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleLeaveAction(leave._id, "Rejected")
                                }
                                className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                                title="Reject Request"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                              <button className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "attendance" && (
            <motion.div
              key="attendance"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5">
                      <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                        Employee
                      </th>
                      <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                        Department
                      </th>
                      <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                        Check In
                      </th>
                      <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                        Check Out
                      </th>
                      <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest text-right">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="py-20 text-center">
                          <div className="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
                            Syncing Presence...
                          </p>
                        </td>
                      </tr>
                    ) : filteredAttendance.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-20 text-center text-slate-500 font-bold italic"
                        >
                          No attendance records found for today.
                        </td>
                      </tr>
                    ) : (
                      filteredAttendance.map((record) => (
                        <tr
                          key={record._id}
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          <td className="py-6 px-8">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center text-white font-black text-lg">
                                {record.employee?.name?.charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-white font-black tracking-tight">
                                  {record.employee?.name}
                                </span>
                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                  {new Date(record.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-8">
                            <span className="text-sm font-bold text-slate-300 flex items-center gap-2">
                              <User className="w-4 h-4 text-lavender-400" />
                              {record.department || "General"}
                            </span>
                          </td>
                          <td className="py-6 px-8">
                            <span className="text-sm font-black text-[#10B981] font-mono">
                              {record.checkIn}
                            </span>
                          </td>
                          <td className="py-6 px-8">
                            <span className="text-sm font-black text-rose-400 font-mono">
                              {record.checkOut || "In Session"}
                            </span>
                          </td>
                          <td className="py-6 px-8 text-right">
                            <span
                              className={`inline-flex px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                record.status === "present"
                                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "employees" && (
            <motion.div
              key="employees"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5">
                      <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                        Employee Entity
                      </th>
                      <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                        Designation
                      </th>
                      <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                        Contact Info
                      </th>
                      <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                        Status
                      </th>
                      <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="py-20 text-center">
                          <div className="w-10 h-10 border-4 border-[#6D28D9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
                            Accessing Directory...
                          </p>
                        </td>
                      </tr>
                    ) : filteredEmployeesList.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-20 text-center text-slate-500 font-bold italic"
                        >
                          No employees found in the directory.
                        </td>
                      </tr>
                    ) : (
                      filteredEmployeesList.map((emp) => (
                        <tr
                          key={emp._id}
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          <td className="py-6 px-8">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#6D28D9]/20">
                                {emp.name?.charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-white font-black tracking-tight text-base group-hover:text-[#6D28D9] transition-colors">
                                  {emp.name}
                                </span>
                                <span className="text-[10px] text-[#10B981] font-black uppercase tracking-widest">
                                  ID: {emp._id.slice(-6).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-8">
                            <span className="text-sm font-bold text-slate-300">
                              {emp.designation}
                            </span>
                          </td>
                          <td className="py-6 px-8">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-400">
                                {emp.email}
                              </span>
                              <span className="text-[10px] text-slate-600 font-black">
                                {emp.contact}
                              </span>
                            </div>
                          </td>
                          <td className="py-6 px-8">
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                              Active
                            </span>
                          </td>
                          <td className="py-6 px-8 text-right">
                            <button
                              onClick={() => {
                                setManualData({
                                  ...manualData,
                                  employeeId: emp._id,
                                  department: emp.designation, // Defaulting department to designation
                                });
                                setShowManualModal(true);
                              }}
                              className="px-4 py-2 rounded-xl bg-[#6D28D9]/10 text-[#6D28D9] hover:bg-[#6D28D9] hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-[#6D28D9]/20"
                            >
                              Log Attendance
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
