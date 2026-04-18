import React from "react";
import {
  Printer,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "inactive":
      return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    case "on leave":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    default:
      return "bg-slate-500/10 text-slate-500 border-slate-500/20";
  }
};

const getProgressColor = (percent) => {
  if (percent >= 80) return "bg-[#10B981]";
  if (percent >= 50) return "bg-[#6D28D9]";
  if (percent >= 30) return "bg-amber-500";
  return "bg-rose-500";
};

export default function EmployeeTable({ employees, loading }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6">
      <style>
        {`
          :root {
            --lavender-50: #f5f3ff;
            --lavender-100: #ede9fe;
            --lavender-200: #ddd6fe;
            --lavender-400: #a78bfa;
            --lavender-600: #7c3aed;
            --mint-50: #f0fdfa;
            --mint-100: #ccfbf1;
            --mint-200: #99f6e4;
            --mint-400: #2dd4bf;
            --mint-600: #0d9488;
          }
          .bg-lavender-100 { background-color: var(--lavender-100); }
          .text-lavender-700 { color: #6d28d9; }
          .border-lavender-200 { border-color: var(--lavender-200); }
          .bg-lavender-400 { background-color: var(--lavender-400); }
          .bg-mint-100 { background-color: var(--mint-100); }
          .text-mint-700 { color: #0f766e; }
          .border-mint-200 { border-color: var(--mint-200); }
          .bg-mint-400 { background-color: var(--mint-400); }
          
          @media print {
            body { 
              background: white !important; 
              color: black !important;
              padding: 0;
              margin: 0;
            }
            .no-print { 
              display: none !important; 
            }
            .print-only { 
              display: block !important; 
            }
            .print-container {
              width: 100% !important;
              max-width: 100% !important;
              padding: 20px !important;
              margin: 0 !important;
              border: none !important;
              box-shadow: none !important;
            }
            .print-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #eee;
              padding-bottom: 20px;
            }
            table {
              width: 100% !important;
              border-collapse: collapse !important;
              font-size: 10px !important;
            }
            th, td {
              border: 1px solid #ddd !important;
              padding: 8px !important;
              text-align: left !important;
            }
            th {
              background-color: #f8fafc !important;
              color: #1e293b !important;
            }
            .progress-bar {
              border: 1px solid #ddd !important;
              height: 10px !important;
              width: 100px !important;
            }
            .progress-fill {
              background-color: #7c3aed !important;
              height: 100% !important;
            }
          }
          .print-only { display: none; }
        `}
      </style>

      <div className="flex justify-between items-center no-print px-4">
        <h3 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
          <Users className="w-8 h-8 text-[#6D28D9]" />
          Employee Directory
        </h3>
        <button
          onClick={handlePrint}
          className="btn-enterprise btn-lavender px-6 py-3 rounded-2xl flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden print-container">
        {/* Print Only Header */}
        <div className="print-only print-header">
          <h1 className="text-2xl font-bold">
            EMTS - Employee Management System
          </h1>
          <p className="text-sm text-slate-500">
            Official Employee List Report
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Generated on: {new Date().toLocaleDateString()}
          </p>
        </div>

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
                  Experience
                </th>
                <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                  Shift
                </th>
                <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                  Remuneration
                </th>
                <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                  KPI Progress
                </th>
                <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-[#6D28D9] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-500 font-black text-xs uppercase tracking-widest">
                        Synchronizing Records...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-20 text-center text-slate-500 font-bold italic"
                  >
                    No corporate entities discovered in the database.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr
                    key={emp._id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6D28D9] to-[#10B981] flex items-center justify-center text-white font-black text-xl shadow-xl group-hover:rotate-3 transition-transform duration-500">
                          {emp.name?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-white text-lg tracking-tight group-hover:text-[#6D28D9] transition-colors">
                            {emp.name}
                          </h4>
                          <div className="flex flex-col gap-1 mt-1">
                            <span className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                              <Mail className="w-3.5 h-3.5 text-slate-600" />
                              {emp.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2 text-sm font-black text-slate-300">
                          <Briefcase className="w-4 h-4 text-lavender-400" />
                          {emp.department || "General"}
                        </span>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-6">
                          Joined: {emp.doj || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2 text-sm font-bold text-slate-300">
                          <TrendingUp className="w-4 h-4 text-mint-400" />
                          {emp.experience || "Fresh"}
                        </span>
                        <span className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest ml-6">
                          {emp.qualification || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                        <Clock className="w-3.5 h-3.5" />
                        {emp.workingTime || "9AM - 5PM"}
                      </span>
                    </td>
                    <td className="py-6 px-8">
                      <span className="flex items-center gap-1.5 text-base font-black text-white tracking-tighter">
                        <DollarSign className="w-4 h-4 text-[#10B981]" />
                        {emp.salary?.toLocaleString() || "0"}
                      </span>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex flex-col gap-2 min-w-[140px]">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-500">Efficiency</span>
                          <span className="text-lavender-400">
                            {emp.progressReport || 0}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${emp.progressReport || 0}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${getProgressColor(emp.progressReport || 0)}`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <span
                        className={`inline-flex px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(emp.status)}`}
                      >
                        {emp.status || "Active"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
