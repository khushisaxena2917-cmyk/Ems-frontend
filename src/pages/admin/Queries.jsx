import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  MessageSquare,
  Search,
  Filter,
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  Printer,
  ExternalLink,
} from "lucide-react";

export default function Queries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://ems-backend.vercel.app/api/contact",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        setQueries(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching queries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQueries();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    // API call to update status would go here
    setQueries(queries.map((q) => (q._id === id ? { ...q, status } : q)));
  };

  const filteredQueries = queries.filter((q) => {
    const matchesSearch =
      q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || q.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handlePrint = () => {
    const printContent = document.getElementById("queries-table");
    const win = window.open("", "", "height=700,width=900");
    const printStyles = `
      <style>
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-family: sans-serif; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 12px; }
        th { background-color: #f8fafc; color: #64748b; font-weight: 800; text-transform: uppercase; }
        h1 { text-align: center; color: #1e293b; margin-bottom: 5px; }
        .print-header { margin-bottom: 30px; border-bottom: 2px solid #6D28D9; padding-bottom: 10px; text-align: center; }
        .status-badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 10px; text-transform: uppercase; }
        @media print { .no-print { display: none; } body { color: black !important; } }
      </style>
    `;
    win.document.write(
      "<html><head><title>Contact Queries Report</title>" +
        printStyles +
        "</head><body>",
    );
    win.document.write(
      '<div class="print-header"><h1>Saxena\'s Group - Contact Queries Report</h1>',
    );
    win.document.write(
      "<p>Generated on: " + new Date().toLocaleString() + "</p></div>",
    );
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
            Contact Queries
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            Manage user inquiries and corporate communications.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="btn-enterprise btn-lavender px-8 py-4 rounded-2xl flex items-center gap-2"
        >
          <Printer className="w-5 h-5" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Stats */}
        <div className="lg:col-span-4 grid sm:grid-cols-3 gap-6">
          {[
            {
              label: "Total Queries",
              value: queries.length,
              icon: MessageSquare,
              color: "lavender",
            },
            {
              label: "Pending Response",
              value: queries.filter((q) => q.status !== "Resolved").length,
              icon: Clock,
              color: "rose",
            },
            {
              label: "Resolved",
              value: queries.filter((q) => q.status === "Resolved").length,
              icon: CheckCircle,
              color: "emerald",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-6 flex items-center gap-6"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-400 border border-${stat.color}-500/20`}
              >
                <stat.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {stat.label}
                </p>
                <p className="text-3xl font-black text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Table */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-4 flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white shadow-xl"
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Filter className="w-5 h-5 text-slate-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 md:w-48 px-6 py-4 rounded-2xl bg-[#0a0a1a] border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white appearance-none"
              >
                <option value="all">All Queries</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div
            id="queries-table"
            className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                      User
                    </th>
                    <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                      Category
                    </th>
                    <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                      Message Preview
                    </th>
                    <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="py-6 px-8 text-xs font-black text-slate-500 uppercase tracking-widest text-right no-print">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="py-20 text-center">
                        <div className="w-10 h-10 border-4 border-lavender-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
                          Loading Queries...
                        </p>
                      </td>
                    </tr>
                  ) : filteredQueries.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-20 text-center text-slate-500 font-bold italic"
                      >
                        No queries matched your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredQueries.map((query) => (
                      <tr
                        key={query._id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="py-6 px-8">
                          <div className="flex flex-col">
                            <span className="text-white font-black tracking-tight">
                              {query.name}
                            </span>
                            <span className="text-xs text-slate-500 font-bold">
                              {query.email}
                            </span>
                          </div>
                        </td>
                        <td className="py-6 px-8">
                          <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                            {query.queryType || "General"}
                          </span>
                        </td>
                        <td className="py-6 px-8 max-w-xs">
                          <p className="text-slate-400 text-sm font-medium truncate">
                            {query.message}
                          </p>
                        </td>
                        <td className="py-6 px-8">
                          <span
                            className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                              query.status === "Resolved"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : query.status === "In Progress"
                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                  : "bg-lavender-500/10 text-lavender-400 border-lavender-500/20"
                            }`}
                          >
                            {query.status || "New"}
                          </span>
                        </td>
                        <td className="py-6 px-8 text-right no-print">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button className="p-2.5 rounded-xl bg-white/5 text-emerald-400 hover:bg-emerald-500/10 transition-all">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-2.5 rounded-xl bg-white/5 text-rose-400 hover:bg-rose-500/10 transition-all">
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
        </div>
      </div>
    </motion.div>
  );
}
