import React, { useState, useEffect } from "react";
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Filter,
  LayoutDashboard,
  CheckSquare,
  ClipboardList,
  TrendingUp,
  Send,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-mint-100 text-mint-700 border-mint-200";
    case "in-progress":
      return "bg-lavender-100 text-lavender-700 border-lavender-200";
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return <CheckCircle2 className="w-4 h-4 text-mint-600" />;
    case "in-progress":
      return <PlayCircle className="w-4 h-4 text-lavender-600" />;
    case "pending":
      return <AlertCircle className="w-4 h-4 text-amber-600" />;
    default:
      return null;
  }
};

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [inlineTaskData, setInlineTaskData] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
  });
  const user = JSON.parse(localStorage.getItem("user") || "{}") || {};

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user.email) return;

    fetch("http://localhost:5000/api/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const myTasks = Array.isArray(data)
          ? data.filter((t) => t.assignedTo?.email === user.email)
          : [];
        setTasks(myTasks);

        // Calculate stats
        const newStats = myTasks.reduce(
          (acc, task) => {
            acc.total++;
            if (task.status === "completed") acc.completed++;
            else if (task.status === "in-progress") acc.inProgress++;
            else acc.pending++;
            return acc;
          },
          { total: 0, completed: 0, pending: 0, inProgress: 0 },
        );

        setStats(newStats);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setLoading(false);
      });
  }, [user.id, user.email]);

  const handleStatusChange = (id, newStatus) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Since updateTask returns the task object, we check if it has an _id
        if (data?._id) {
          setTasks((prev) => {
            const updated = prev.map((t) =>
              t._id === id ? { ...t, status: newStatus } : t,
            );
            // Re-calculate stats
            const newStats = updated.reduce(
              (acc, task) => {
                acc.total++;
                if (task.status === "completed") acc.completed++;
                else if (task.status === "in-progress") acc.inProgress++;
                else acc.pending++;
                return acc;
              },
              { total: 0, completed: 0, pending: 0, inProgress: 0 },
            );
            setStats(newStats);
            return updated;
          });
        }
      })
      .catch((err) => console.error("Error updating task status:", err));
  };

  const handleInlineSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inlineTaskData),
      });
      if (res.ok) {
        setEditingTaskId(null);
        const updated = tasks.map((t) =>
          t._id === id ? { ...t, ...inlineTaskData } : t,
        );
        setTasks(updated);
        // Re-calculate stats
        const newStats = updated.reduce(
          (acc, task) => {
            acc.total++;
            if (task.status === "completed") acc.completed++;
            else if (task.status === "in-progress") acc.inProgress++;
            else acc.pending++;
            return acc;
          },
          { total: 0, completed: 0, pending: 0, inProgress: 0 },
        );
        setStats(newStats);
      }
    } catch (err) {
      console.error("Error updating task inline:", err);
    }
  };

  const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-xl flex items-center gap-6 group hover:scale-105 transition-all">
      <div
        className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform`}
      >
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
          {label}
        </p>
        <p className="text-3xl font-black text-white mt-1">{value}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10"
    >
      <style>
        {`
          :root {
            --lavender-100: #746c99;
            --lavender-600: #7c6c97;
            --mint-100: #ccfbf1;
            --mint-600: #0d9488;
          }
        `}
      </style>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Welcome back, {user.name || "Employee"}!
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            Here's your productivity overview for today.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/employee/apply-leave")}
            className="btn-enterprise btn-lavender"
          >
            <Send className="w-5 h-5" />
            Apply for Leave
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          label="Total Tasks"
          value={stats.total}
          icon={ClipboardList}
          color="bg-gradient-to-br from-indigo-500 to-lavender-500"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={PlayCircle}
          color="bg-gradient-to-br from-lavender-500 to-indigo-600"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckSquare}
          color="bg-gradient-to-br from-mint-400 to-mint-600"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={AlertCircle}
          color="bg-gradient-to-br from-amber-400 to-amber-600"
        />
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-lavender-400" />
            My Active Tasks
          </h2>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg transition-all active:scale-95">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-lavender-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 font-bold tracking-tight">
                Loading your awesome tasks...
              </p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white/5 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-white/10">
              <ClipboardList className="w-16 h-16 mx-auto mb-6 opacity-20 text-lavender-400" />
              <p className="text-xl font-black text-white">
                No tasks assigned yet.
              </p>
              <p className="text-slate-400 font-medium mt-2">
                When you get tasks, they will sparkle here!
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <motion.div
                key={task._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-lavender-500/20 to-mint-500/20 opacity-20 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    {editingTaskId === task._id ? (
                      <select
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-white text-slate-800 outline-none"
                        value={inlineTaskData.status}
                        onChange={(e) =>
                          setInlineTaskData({
                            ...inlineTaskData,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In-Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(task.status)}`}
                      >
                        {getStatusIcon(task.status)}
                        {task.status}
                      </span>
                    )}
                    {editingTaskId === task._id ? (
                      <input
                        type="text"
                        className="text-2xl font-black text-slate-800 bg-white border border-lavender-200 rounded px-2 py-1 mt-4 outline-none w-full"
                        value={inlineTaskData.title}
                        onChange={(e) =>
                          setInlineTaskData({
                            ...inlineTaskData,
                            title: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <h3 className="text-2xl font-black text-white mt-4 group-hover:text-lavender-400 transition-colors leading-tight">
                        {task.title}
                      </h3>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        task.priority === "high"
                          ? "bg-rose-500 text-white"
                          : task.priority === "medium"
                            ? "bg-amber-400 text-white"
                            : "bg-slate-400 text-white"
                      }`}
                    >
                      {task.priority}
                    </div>
                    {editingTaskId !== task._id && (
                      <button
                        onClick={() => {
                          setEditingTaskId(task._id);
                          setInlineTaskData(task);
                        }}
                        className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-all"
                        title="Quick Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {editingTaskId === task._id ? (
                  <textarea
                    rows="2"
                    className="w-full text-slate-800 font-medium mb-8 bg-white border border-lavender-200 rounded-2xl px-4 py-3 outline-none text-sm resize-none"
                    value={inlineTaskData.description}
                    onChange={(e) =>
                      setInlineTaskData({
                        ...inlineTaskData,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                ) : (
                  <p className="text-slate-400 font-medium mb-8 line-clamp-2 leading-relaxed text-sm">
                    {task.description ||
                      "No description provided for this task."}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mb-8 relative z-10">
                  <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl text-[11px] font-bold text-slate-300 border border-white/20 shadow-sm">
                    <Calendar className="w-3.5 h-3.5 text-lavender-400" />
                    Due:{" "}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No deadline"}
                  </span>
                  <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl text-[11px] font-bold text-slate-300 border border-white/20 shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-mint-400" />
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-white/10 relative z-10">
                  {editingTaskId === task._id ? (
                    <div className="flex gap-3 w-full">
                      <button
                        onClick={() => handleInlineSave(task._id)}
                        className="flex-1 py-3 rounded-2xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingTaskId(null)}
                        className="px-6 py-3 rounded-2xl bg-white/5 text-slate-400 hover:text-white border border-white/10 transition-all font-black uppercase tracking-widest text-[10px]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-3">
                        {task.status !== "pending" && (
                          <button
                            onClick={() =>
                              handleStatusChange(task._id, "pending")
                            }
                            className="p-3 rounded-2xl bg-white/10 text-slate-400 hover:bg-amber-500/20 hover:text-amber-400 border border-white/20 shadow-sm transition-all hover:scale-110"
                            title="Mark as Pending"
                          >
                            <AlertCircle className="w-6 h-6" />
                          </button>
                        )}
                        {task.status !== "in-progress" && (
                          <button
                            onClick={() =>
                              handleStatusChange(task._id, "in-progress")
                            }
                            className="p-3 rounded-2xl bg-white/10 text-slate-400 hover:bg-lavender-500/20 hover:text-lavender-400 border border-white/20 shadow-sm transition-all hover:scale-110"
                            title="Mark as In-Progress"
                          >
                            <PlayCircle className="w-6 h-6" />
                          </button>
                        )}
                        {task.status !== "completed" && (
                          <button
                            onClick={() =>
                              handleStatusChange(task._id, "completed")
                            }
                            className="p-3 rounded-2xl bg-white/10 text-slate-400 hover:bg-mint-500/20 hover:text-mint-400 border border-white/20 shadow-sm transition-all hover:scale-110"
                            title="Mark as Completed"
                          >
                            <CheckCircle2 className="w-6 h-6" />
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                        Quick Action
                      </span>
                    </>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
