import React, { useState, useEffect } from "react";
import { Clock, LogIn, LogOut, Calendar } from "lucide-react";
import { motion } from "motion/react";

export default function EmployeeAttendance() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [activeRecord, setActiveRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const departments = ["Engineering", "Design", "Marketing", "HR", "Sales"];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [user.id]);

  const fetchAttendance = () => {
    const token = localStorage.getItem("token");
    fetch("https://ems-backend.vercel.app/api/attendance", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const myData = Array.isArray(data)
          ? data.filter((a) => a.employee?.email === user.email)
          : [];
        setAttendanceData(
          myData.sort((a, b) => new Date(b.date) - new Date(a.date)),
        );

        // Check if currently clocked in (last record has no checkOut and is from today)
        const today = new Date().toISOString().split("T")[0];
        const lastRecord = myData[0];
        if (
          lastRecord &&
          !lastRecord.checkOut &&
          lastRecord.date.split("T")[0] === today
        ) {
          setIsClockedIn(true);
          setActiveRecord(lastRecord);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching attendance:", err);
        setLoading(false);
      });
  };

  const handleToggleClock = () => {
    const timeStr = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const token = localStorage.getItem("token");

    if (!isClockedIn) {
      if (!selectedDepartment) {
        alert("Please select a department before clocking in.");
        return;
      }
      // Clock In
      fetch("https://ems-backend.vercel.app/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employeeId: user.id,
          department: selectedDepartment,
          status: "Present",
          date: new Date().toISOString(),
          checkIn: timeStr,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?._id) {
            setIsClockedIn(true);
            setActiveRecord(data);
            fetchAttendance();
          }
        })
        .catch((err) => console.error("Error clocking in:", err));
    } else {
      // Clock Out
      fetch(
        `https://ems-backend.vercel.app/api/attendance/${activeRecord._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ checkOut: timeStr }),
        },
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?._id) {
            setIsClockedIn(false);
            setActiveRecord(null);
            fetchAttendance();
          }
        })
        .catch((err) => console.error("Error clocking out:", err));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            My Attendance
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            Record your daily work hours and view professional history.
          </p>
        </div>
      </div>

      {/* Clock In/Out Widget */}
      <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>

        <div className="flex flex-col items-center md:items-start gap-4 relative z-10">
          <div className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#10B981]" />
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tighter">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
          <div className="text-sm font-bold text-slate-400 mt-2 flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isClockedIn
                  ? "bg-[#10B981] animate-pulse shadow-[0_0_10px_#10B981]"
                  : "bg-slate-700"
              }`}
            ></div>
            {isClockedIn ? (
              <span className="text-[#10B981] uppercase tracking-widest text-[10px] font-black">
                Active Session
              </span>
            ) : (
              <span className="uppercase tracking-widest text-[10px] font-black">
                System Offline
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full md:w-80 relative z-10">
          {!isClockedIn && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                Work Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all font-bold text-white appearance-none shadow-xl"
              >
                <option value="" className="bg-[#0a0a1a]">
                  Select Department
                </option>
                {departments.map((dept) => (
                  <option key={dept} value={dept} className="bg-[#0a0a1a]">
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleToggleClock}
            className={`relative overflow-hidden group px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center gap-4 justify-center ${
              isClockedIn
                ? "bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white"
                : "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981] hover:text-white"
            }`}
          >
            {isClockedIn ? (
              <>
                <LogOut className="w-5 h-5" />
                <span>Clock Out</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Clock In</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="card-enterprise">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-3">
            <Clock className="w-6 h-6 text-lavender-400" />
            Attendance History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="py-5 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                  Date
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                  Department
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                  Login In
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                  Log Out
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-500 uppercase tracking-widest text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-500 font-black text-sm uppercase tracking-widest">
                        Syncing...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : attendanceData.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-12 text-center text-slate-500 font-bold italic"
                  >
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                attendanceData.map((record) => (
                  <tr
                    key={record._id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-5 px-8 text-sm font-black text-white">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-5 px-8 text-sm text-slate-400 font-bold">
                      {record.department || "--"}
                    </td>
                    <td className="py-5 px-8 text-sm text-slate-300 font-bold">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                        {record.checkIn}
                      </div>
                    </td>
                    <td className="py-5 px-8 text-sm text-slate-300 font-bold">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-rose-500" />
                        {record.checkOut || (
                          <span className="text-slate-500 italic text-[10px] uppercase tracking-widest">
                            In Session
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          record.status === "present"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
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
      </div>
    </motion.div>
  );
}
