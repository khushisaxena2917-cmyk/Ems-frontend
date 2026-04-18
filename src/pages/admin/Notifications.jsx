import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Clock, CheckCircle, XCircle, AlertCircle, Info, Trash2, Settings, Filter, Search, Calendar, User, MessageSquare } from "lucide-react";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: "leave", title: "New Leave Request", message: "Saniya Khan has requested a 3-day sick leave.", time: "10 minutes ago", status: "unread", icon: Calendar, color: "lavender" },
    { id: 2, type: "query", title: "Contact Query", message: "You have a new general inquiry from Jane Doe.", time: "2 hours ago", status: "unread", icon: MessageSquare, color: "blue" },
    { id: 3, type: "system", title: "System Update", message: "EMS v2.4 successfully deployed to corporate servers.", time: "5 hours ago", status: "read", icon: Info, color: "emerald" },
    { id: 4, type: "alert", title: "Attendance Warning", message: "Marketing department shows unusually low attendance today.", time: "1 day ago", status: "read", icon: AlertCircle, color: "rose" },
    { id: 5, type: "task", title: "Task Completed", message: "Rahul Sharma has finished the Q1 performance report.", time: "2 days ago", status: "read", icon: CheckCircle, color: "mint" }
  ]);

  const [filter, setFilter] = useState("all");

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, status: "read" } : n));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => filter === "all" || n.status === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Enterprise Notifications</h1>
          <p className="text-slate-400 mt-2 font-medium">Global system alerts and pending operational tasks.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-3 font-bold text-sm">
            <CheckCircle className="w-4 h-4" />
            Mark All Read
          </button>
          <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
        {/* Navigation / Filters */}
        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-6 shadow-2xl flex flex-col gap-4">
          {[
            { id: "all", label: "All Alerts", count: notifications.length },
            { id: "unread", label: "Unread", count: notifications.filter(n => n.status === "unread").length },
            { id: "read", label: "Archive", count: notifications.filter(n => n.status === "read").length }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                filter === item.id
                  ? "bg-[#6D28D9] text-white shadow-xl shadow-[#6D28D9]/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{item.label}</span>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] ${filter === item.id ? "bg-white/20 text-white" : "bg-white/5 text-slate-500"}`}>{item.count}</span>
            </button>
          ))}
        </div>

        {/* Notifications Feed */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center bg-white/5 rounded-[3rem] border border-white/5"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-black text-white tracking-tight uppercase">No Alerts Found</h3>
                <p className="text-slate-500 font-bold mt-2">All corporate systems are operating nominally.</p>
              </motion.div>
            ) : (
              filteredNotifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`relative p-8 rounded-[2.5rem] border transition-all flex flex-col sm:flex-row items-center sm:items-start gap-8 group ${
                    notif.status === "unread" 
                    ? "bg-white/5 border-[#6D28D9]/30 shadow-2xl" 
                    : "bg-white/[0.02] border-white/5"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-xl transition-transform group-hover:rotate-6 ${
                    notif.color === "lavender" ? "bg-lavender-500/10 text-lavender-400 border-lavender-500/20 shadow-lavender-500/5" :
                    notif.color === "blue" ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/5" :
                    notif.color === "emerald" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5" :
                    notif.color === "rose" ? "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/5" :
                    "bg-white/10 text-white border-white/10 shadow-white/5"
                  }`}>
                    <notif.icon className="w-7 h-7" />
                  </div>

                  <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-xl font-black text-white tracking-tight uppercase">{notif.title}</h3>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5" />
                        {notif.time}
                      </div>
                    </div>
                    <p className="text-slate-400 font-bold leading-relaxed">{notif.message}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
                      {notif.status === "unread" && (
                        <button 
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="px-6 py-2.5 rounded-xl bg-[#6D28D9] text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#6D28D9]/20 hover:scale-105 transition-all"
                        >
                          Mark as Read
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(notif.id)}
                        className="px-6 py-2.5 rounded-xl bg-white/5 text-rose-400 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10 transition-all border border-rose-500/10"
                      >
                        Delete Alert
                      </button>
                    </div>
                  </div>

                  {notif.status === "unread" && (
                    <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-[#10B981] shadow-[0_0_15px_#10B981] animate-pulse"></div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
