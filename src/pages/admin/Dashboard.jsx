import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  ClipboardList,
  PlayCircle,
  CheckSquare,
  AlertCircle,
  Users,
  MessageSquare,
  BarChart3,
  PieChart as PieIcon,
  Printer,
  Check,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Colors matching the lavender and dark theme
const THEME_COLORS = {
  lavender: "#6D28D9",
  mint: "#10B981",
  purple: "#8B5CF6",
  amber: "#F59E0B",
  rose: "#F43F5E",
  indigo: "#6366F1",
};

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
          Completed
        </span>
      );
    case "in-progress":
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          In Progress
        </span>
      );
    case "pending":
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
          Pending
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
          {status || "N/A"}
        </span>
      );
  }
};

/**
 * Shimmer effect for skeleton loading state
 */
const SkeletonLoader = ({ className }) => (
  <div className={`animate-pulse bg-white/10 rounded-lg ${className}`}></div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [inlineTaskData, setInlineTaskData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    newQueries: 0,
    activeTasks: 0,
  });

  // Recharts Data for Analytics
  const analyticsData = useMemo(() => {
    return {
      monthlyAttendance: [
        { name: "Jan", present: 85 },
        { name: "Feb", present: 88 },
        { name: "Mar", present: 92 },
        { name: "Apr", present: 90 },
        { name: "May", present: 95 },
        { name: "Jun", present: 93 },
      ],
      deptDistribution: [
        { name: "Engineering", value: 35, color: THEME_COLORS.lavender },
        { name: "Design", value: 25, color: THEME_COLORS.mint },
        { name: "HR", value: 15, color: THEME_COLORS.purple },
        { name: "Sales", value: 25, color: THEME_COLORS.amber },
      ],
    };
  }, []);

  // Protected Route Check & Data Fetching
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksRes, employeesRes, leavesRes, queriesRes] =
          await Promise.all([
            fetch("https://ems-backend.vercel.app/api/tasks", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("https://ems-backend.vercel.app/api/employees", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("https://ems-backend.vercel.app/api/leaves", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("https://ems-backend.vercel.app/api/contact", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        const [tasksData, employeesData, leavesData, queriesData] =
          await Promise.all([
            tasksRes.ok ? tasksRes.json() : Promise.resolve([]),
            employeesRes.ok ? employeesRes.json() : Promise.resolve([]),
            leavesRes.ok ? leavesRes.json() : Promise.resolve([]),
            queriesRes.ok ? queriesRes.json() : Promise.resolve([]),
          ]);

        setTasks(Array.isArray(tasksData) ? tasksData : []);
        setDashboardStats({
          totalEmployees: Array.isArray(employeesData)
            ? employeesData.length
            : 0,
          pendingLeaves: Array.isArray(leavesData)
            ? leavesData.filter((l) => l.status === "Pending").length
            : 0,
          newQueries: Array.isArray(queriesData)
            ? queriesData.filter((q) => q.status !== "Resolved").length
            : 0,
          activeTasks: Array.isArray(tasksData)
            ? tasksData.filter((t) => t.status === "in-progress").length
            : 0,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleInlineTaskSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://ems-backend.vercel.app/api/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(inlineTaskData),
        },
      );
      if (res.ok) {
        setEditingTaskId(null);
        // Refresh stats and tasks
        const updatedTasks = tasks.map((t) =>
          t._id === id ? { ...t, ...inlineTaskData } : t,
        );
        setTasks(updatedTasks);
        // Optionally re-fetch to get accurate stats if many things changed
      }
    } catch (err) {
      console.error("Error updating task inline:", err);
    }
  };

  // Debounce search input for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter tasks based on debounced search term
  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        task.assignedTo?.name
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase()),
    );
  }, [tasks, debouncedSearch]);

  const handlePrint = () => {
    const printContent = document.getElementById("dashboard-tasks");
    const win = window.open("", "", "height=700,width=900");
    const printStyles = `
      <style>
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-family: sans-serif; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 12px; }
        th { background-color: #f8fafc; color: #64748b; font-weight: 800; text-transform: uppercase; }
        h1 { text-align: center; color: #1e293b; margin-bottom: 5px; }
        .print-header { margin-bottom: 30px; border-bottom: 2px solid #6D28D9; padding-bottom: 10px; text-align: center; }
        @media print { .no-print { display: none; } body { color: black !important; } }
      </style>
    `;
    win.document.write(
      "<html><head><title>Corporate Task Report</title>" +
        printStyles +
        "</head><body>",
    );
    win.document.write(
      '<div class="print-header"><h1>Saxena\'s Group - Corporate Task Report</h1>',
    );
    win.document.write(
      "<p>Generated on: " + new Date().toLocaleString() + "</p></div>",
    );
    win.document.write(printContent.innerHTML);
    win.document.write("</body></html>");
    win.document.close();
    win.print();
  };

  const StatCard = ({ label, value, icon: Icon, color, trend }) => (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col gap-6 group hover:scale-105 transition-all relative overflow-hidden">
      <div
        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}
      ></div>
      <div className="flex items-center justify-between relative z-10">
        <div
          className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform`}
        >
          <Icon className="w-7 h-7" />
        </div>
        {trend && (
          <span className="text-[10px] font-black text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-lg border border-[#10B981]/20">
            {trend}
          </span>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
          {label}
        </p>
        {loading ? (
          <SkeletonLoader className="h-10 w-20" />
        ) : (
          <p className="text-4xl font-black text-white tracking-tighter">
            {value}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-bold uppercase tracking-widest">
            Corporate Ecosystem Intelligence & Analytics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrint}
            className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-3 font-bold text-sm"
          >
            <Printer className="w-5 h-5" />
            Print Status
          </button>
          <Link
            to="/admin/add-task"
            className="btn-enterprise btn-lavender px-8 py-4 rounded-2xl flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Operation
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          label="Total Entities"
          value={dashboardStats.totalEmployees}
          icon={Users}
          color="bg-[#6D28D9]"
          trend="Active Workforce"
        />
        <StatCard
          label="Pending Requests"
          value={dashboardStats.pendingLeaves}
          icon={ClipboardList}
          color="bg-amber-500"
          trend="Critical Status"
        />
        <StatCard
          label="Active Queries"
          value={dashboardStats.newQueries}
          icon={MessageSquare}
          color="bg-blue-500"
          trend="Requires Action"
        />
        <StatCard
          label="In-Progress"
          value={dashboardStats.activeTasks}
          icon={PlayCircle}
          color="bg-[#10B981]"
          trend="High Efficiency"
        />
      </div>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Attendance Bar Chart */}
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-lavender-500/10 flex items-center justify-center text-lavender-400 border border-lavender-500/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Attendance Analytics
            </h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.monthlyAttendance}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff05"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  fontWeight={800}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  fontWeight={800}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#ffffff05" }}
                  contentStyle={{
                    backgroundColor: "#1a1a3a",
                    borderRadius: "24px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                    padding: "20px",
                  }}
                  itemStyle={{
                    fontWeight: 800,
                    textTransform: "uppercase",
                    fontSize: "10px",
                  }}
                />
                <Bar
                  dataKey="present"
                  fill={THEME_COLORS.lavender}
                  radius={[10, 10, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution Pie Chart */}
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-mint-500/10 flex items-center justify-center text-mint-400 border border-mint-500/20">
              <PieIcon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Department Distribution
            </h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.deptDistribution}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {analyticsData.deptDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a3a",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div id="dashboard-tasks" className="card-enterprise">
        <div className="no-print card-header-lavender flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="pl-11 w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all text-sm font-bold text-white shadow-sm placeholder:text-slate-500"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 text-sm font-black text-slate-300 hover:text-[#6D28D9] px-6 py-2.5 rounded-lg hover:bg-white/10 transition-all border border-white/20 shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="py-5 px-8 text-xs font-black text-slate-500 uppercase tracking-widest no-print">
                  #
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                  Project Name
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                  Employee Name
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                  Department
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-500 uppercase tracking-widest text-right">
                  Due Date
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                  Progress
                </th>
                <th className="py-5 px-8 text-xs font-black text-slate-500 uppercase tracking-widest text-right no-print">
                  Action
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
                        Synchronizing Intelligence...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredTasks.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-20 text-center text-slate-500 font-bold italic"
                  >
                    No corporate tasks found in the network.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task, index) => (
                  <tr
                    key={task._id}
                    className={`${editingTaskId === task._id ? "bg-lavender-50/10" : "hover:bg-white/[0.02]"} transition-colors group`}
                  >
                    <td className="py-5 px-8 text-sm font-black text-slate-600 no-print">
                      {(index + 1).toString().padStart(2, "0")}
                    </td>
                    <td className="py-5 px-8">
                      {editingTaskId === task._id ? (
                        <input
                          type="text"
                          className="text-sm font-black text-slate-800 bg-white border border-lavender-200 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-lavender-500 w-full"
                          value={inlineTaskData.title}
                          onChange={(e) =>
                            setInlineTaskData({
                              ...inlineTaskData,
                              title: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <h4 className="font-black text-white text-sm tracking-tight group-hover:text-[#6D28D9] transition-colors">
                          {task.title}
                        </h4>
                      )}
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-lavender-400">
                          {task.assignedTo?.name?.charAt(0) || "U"}
                        </div>
                        <span className="text-sm font-bold text-slate-300">
                          {task.assignedTo?.name || "Unassigned"}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      {editingTaskId === task._id ? (
                        <input
                          type="text"
                          className="text-[10px] font-black text-slate-800 bg-white border border-lavender-200 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-lavender-500 uppercase tracking-widest"
                          value={inlineTaskData.department}
                          onChange={(e) =>
                            setInlineTaskData({
                              ...inlineTaskData,
                              department: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <span className="px-3 py-1 rounded-lg bg-[#6D28D9]/10 text-[#6D28D9] text-[10px] font-black uppercase tracking-widest border border-[#6D28D9]/20">
                          {task.department || "General"}
                        </span>
                      )}
                    </td>
                    <td className="py-5 px-8 text-right text-sm font-bold text-slate-400">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "No Date"}
                    </td>
                    <td className="py-5 px-8 text-sm">
                      {editingTaskId === task._id ? (
                        <select
                          className="text-xs font-medium bg-white border border-lavender-200 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-lavender-500"
                          value={inlineTaskData.status}
                          onChange={(e) =>
                            setInlineTaskData({
                              ...inlineTaskData,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        getStatusBadge(task.status)
                      )}
                    </td>
                    <td className="py-5 px-8 text-right no-print">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {editingTaskId === task._id ? (
                          <>
                            <button
                              onClick={() => handleInlineTaskSave(task._id)}
                              className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingTaskId(null)}
                              className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingTaskId(task._id);
                                setInlineTaskData(task);
                              }}
                              className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                              title="Direct Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all">
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
    </motion.div>
  );
}
