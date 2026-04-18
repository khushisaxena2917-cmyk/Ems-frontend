import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BarChart3, TrendingUp, Calendar, Users, Download, Filter, FileText, LayoutGrid, ChevronDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("performance");

  const performanceData = [
    { name: "Engineering", score: 92, kpi: 88 },
    { name: "Design", score: 85, kpi: 90 },
    { name: "Marketing", score: 78, kpi: 82 },
    { name: "Sales", score: 88, kpi: 95 },
    { name: "HR", score: 95, kpi: 92 }
  ];

  const attendanceTrends = [
    { day: "Mon", present: 45, absent: 5 },
    { day: "Tue", present: 48, absent: 2 },
    { day: "Wed", present: 42, absent: 8 },
    { day: "Thu", present: 47, absent: 3 },
    { day: "Fri", present: 44, absent: 6 }
  ];

  const leaveDistribution = [
    { name: "Sick", value: 400, color: "#F43F5E" },
    { name: "Casual", value: 300, color: "#10B981" },
    { name: "Earned", value: 300, color: "#6D28D9" },
    { name: "Maternity", value: 200, color: "#3B82F6" }
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-400 mt-2 font-medium">Deep insights into organizational performance and trends.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-3 font-bold text-sm">
            <Filter className="w-4 h-4" />
            Time Range
          </button>
          <button className="btn-enterprise btn-lavender px-8 py-4 rounded-2xl flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 p-10 shadow-2xl flex flex-col gap-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6D28D9]/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-lavender-500/10 flex items-center justify-center text-lavender-400 border border-lavender-500/20 shadow-xl">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Performance Metrics</h2>
            </div>
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
              {["Bar", "Area", "Pie"].map((type) => (
                <button key={type} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === "Bar" ? "bg-[#6D28D9] text-white shadow-lg" : "text-slate-500 hover:text-white"}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[400px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  fontWeight={800} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  fontWeight={800} 
                  tickLine={false} 
                  axisLine={false} 
                  dx={-10}
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ 
                    backgroundColor: '#1a1a3a', 
                    borderRadius: '24px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    padding: '20px'
                  }}
                  itemStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px' }}
                />
                <Bar dataKey="score" fill="#6D28D9" radius={[10, 10, 0, 0]} barSize={40} />
                <Bar dataKey="kpi" fill="#10B981" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Stats */}
        <div className="flex flex-col gap-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 shadow-2xl flex flex-col gap-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">+12.5% this month</span>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Overall Efficiency</p>
              <p className="text-4xl font-black text-white tracking-tighter">88.4%</p>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
              <motion.div initial={{ width: 0 }} animate={{ width: "88.4%" }} transition={{ duration: 1 }} className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></motion.div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 shadow-2xl flex-1 flex flex-col gap-6 relative overflow-hidden group">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-lavender-400" />
              Leave Distribution
            </h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leaveDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={10}
                    dataKey="value"
                  >
                    {leaveDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a3a', borderRadius: '16px', border: '1px solid #ffffff10' }}
                    itemStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {leaveDistribution.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Trends */}
        <div className="lg:col-span-3 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 p-10 shadow-2xl flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <Calendar className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Attendance Trends</h2>
            </div>
            <button className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
              Weekly View
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrends}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} fontWeight={800} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} fontWeight={800} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a3a', borderRadius: '24px', border: '1px solid #ffffff10' }} />
                <Area type="monotone" dataKey="present" stroke="#10B981" fillOpacity={1} fill="url(#colorPresent)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
