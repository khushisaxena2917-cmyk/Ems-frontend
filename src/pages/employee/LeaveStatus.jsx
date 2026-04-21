import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

const LeaveStatus = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("https://ems-backend.vercel.app/api/leaves", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        // Filter only current user's leave requests
        const myLeaves = Array.isArray(data)
          ? data.filter(
              (leave) =>
                leave.employee?.email === user.email ||
                leave.employeeId === user.id ||
                leave.employeeName === user.name,
            )
          : [];
        setLeaveRequests(myLeaves);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching leave requests:", err);
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [user.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <h1 className="text-2xl font-black text-white tracking-tight">
        My Leave Requests
      </h1>
      <div className="card-enterprise">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-white/40">
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Leave Type
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Start Date
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  End Date
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Reason
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-[#6D28D9] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-500 font-black text-sm uppercase tracking-widest">
                        Loading...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : leaveRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-12 text-center text-slate-500 font-bold italic"
                  >
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                leaveRequests.map((req) => (
                  <tr
                    key={req._id}
                    className="hover:bg-white/60 transition-colors group"
                  >
                    <td className="py-5 px-8 text-sm font-black text-white">
                      {req.leaveType}
                    </td>
                    <td className="py-5 px-8 text-sm font-bold text-slate-300">
                      {new Date(req.startDate).toLocaleDateString()}
                    </td>
                    <td className="py-5 px-8 text-sm font-bold text-slate-300">
                      {new Date(req.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-5 px-8 text-sm font-bold text-slate-300">
                      {req.reason}
                    </td>
                    <td className="py-5 px-8 text-right">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          req.status === "Approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : req.status === "Rejected"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default LeaveStatus;
