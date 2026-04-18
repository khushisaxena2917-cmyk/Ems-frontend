import React from "react";
import { motion } from "motion/react";
import {
  Users,
  Clock,
  CreditCard,
  TrendingUp,
  HeartPulse,
  Award,
  ChevronRight,
  Monitor,
  Layout,
  Smartphone,
  Sparkles,
  Zap,
  ShieldCheck,
  MousePointer2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Showcase = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Employee Directory",
      description: "Centralize all employee records and documents securely.",
      icon: <Users className="w-8 h-8" />,
      color: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-400",
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Attendance Tracking",
      description: "Monitor clock-ins, leaves, and shifts in real-time.",
      icon: <Clock className="w-8 h-8" />,
      color: "from-emerald-500/20 to-emerald-600/20",
      iconColor: "text-emerald-400",
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Payroll Management",
      description: "Automate salary calculations and distributions.",
      icon: <CreditCard className="w-8 h-8" />,
      color: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-400",
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Performance Management",
      description: "Set goals, track progress, and evaluate team achievements.",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-amber-500/20 to-amber-600/20",
      iconColor: "text-amber-400",
      image:
        "https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Benefits Administration",
      description:
        "Manage health, retirement, and wellness programs seamlessly.",
      icon: <HeartPulse className="w-8 h-8" />,
      color: "from-rose-500/20 to-rose-600/20",
      iconColor: "text-rose-400",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Compensation & Rewards",
      description:
        "Design and execute competitive salary and bonus structures.",
      icon: <Award className="w-8 h-8" />,
      color: "from-indigo-500/20 to-indigo-600/20",
      iconColor: "text-indigo-400",
      image:
        "https://images.unsplash.com/photo-1567113463300-1025f5d37615?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Header / Nav */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
            <Layout className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase leading-none">
              Saxena's Group
            </span>
            <span className="text-[10px] font-black tracking-[0.3em] text-purple-500 uppercase">
              Enterprise
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {[
            { label: "Home", to: "/" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
            { label: "Apply for Leave", to: "/employee/apply-leave" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => (item.to ? navigate(item.to) : null)}
              className="text-sm font-bold text-slate-400 hover:text-white transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Next-Gen EMS Platform
              </span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
              Revolutionizing <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400">
                Workforce Potential.
              </span>
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12 max-w-lg">
              Experience the future of Human Capital Management with our
              3D-accelerated, AI-driven ecosystem designed for high-performance
              enterprises.
            </p>
            <div className="flex items-center gap-6">
              <button className="px-10 py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                Get Started
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5 transition-all">
                  <Monitor className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">
                  Watch Demo
                </span>
              </button>
            </div>
          </motion.div>

          {/* 3D Mockup Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative perspective-2000"
          >
            {/* Laptop Mockup */}
            <div className="relative z-10 p-4 bg-slate-800 rounded-[2.5rem] border-[12px] border-slate-900 shadow-[0_50px_100px_rgba(0,0,0,0.5)] transform-gpu rotate-y-[-10deg] rotate-x-[5deg]">
              <div className="relative aspect-[16/10] bg-[#0a0a1a] rounded-xl overflow-hidden border border-white/5">
                {/* Simulated UI */}
                <div className="absolute inset-0 p-6 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30"></div>
                      <div className="h-4 w-24 bg-white/5 rounded-full"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/5"></div>
                      <div className="w-8 h-8 rounded-full bg-white/5"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col justify-between">
                      <Users className="w-4 h-4 text-blue-400" />
                      <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="h-24 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col justify-between">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="h-24 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col justify-between">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-6 relative overflow-hidden">
                    <div className="h-4 w-1/3 bg-white/10 rounded-full mb-6"></div>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/5"></div>
                            <div className="h-3 w-32 bg-white/5 rounded-full"></div>
                          </div>
                          <div className="h-3 w-16 bg-white/5 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 z-20 w-24 h-24 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 flex items-center justify-center shadow-2xl"
            >
              <Zap className="w-10 h-10 text-amber-400" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-10 -left-10 z-20 w-20 h-20 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl"
            >
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </motion.div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="mt-40 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative p-0 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.08] transition-all duration-500 overflow-hidden flex flex-col"
            >
              {/* Feature Image */}
              <div className="relative h-64 w-full bg-white/5 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/40 to-transparent"></div>
              </div>

              <div className="p-10 relative">
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                <div
                  className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 ${feature.iconColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl relative z-10`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-purple-400 transition-colors relative z-10">
                  {feature.title}
                </h3>
                <p className="text-slate-400 font-medium leading-relaxed group-hover:text-slate-300 transition-colors relative z-10">
                  {feature.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-purple-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3D Showcase Image Section */}
        <div className="mt-40 bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-[#0a0a1a] rounded-[4rem] p-12 lg:p-24 border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-black tracking-tighter mb-8 leading-none">
                Experience the <br />
                <span className="text-purple-400">3D Dimension</span> of HR.
              </h2>
              <p className="text-lg text-slate-300 font-medium leading-relaxed mb-10">
                Our platform isn't just a database; it's a living ecosystem.
                Visualize organizational structures, track performance metrics
                in real-time, and manage your workforce with unprecedented
                clarity.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time data synchronization",
                  "AI-powered predictive analytics",
                  "Immersive 3D organizational charts",
                  "Secure enterprise-grade encryption",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm font-bold text-slate-400"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative aspect-square flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[40px] border-white/5 rounded-full"
              ></motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-20 border-[20px] border-purple-500/10 rounded-full"
              ></motion.div>

              <div className="relative z-10 w-80 h-80 bg-gradient-to-br from-purple-600 to-blue-600 rounded-[3rem] shadow-[0_0_100px_rgba(109,40,217,0.4)] flex items-center justify-center overflow-hidden border border-white/20 transform-gpu rotate-y-12 rotate-x-12">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-40 h-40 text-white/20 absolute -top-10 -right-10" />
                  <Users className="w-40 h-40 text-white" />
                  <Zap className="w-32 h-32 text-white/20 absolute -bottom-10 -left-10" />
                </motion.div>
              </div>

              <MousePointer2 className="absolute top-1/2 left-1/2 w-12 h-12 text-white shadow-2xl -translate-x-1/2 -translate-y-1/2 z-20 animate-bounce" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-20 border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Layout className="w-4 h-4 text-purple-400" />
            </div>
            <span className="font-black uppercase tracking-widest text-sm">
              Saxena's Group Enterprise
            </span>
          </div>
          <div className="flex gap-10">
            {["Privacy", "Terms", "Documentation", "Support"].map((item) => (
              <span
                key={item}
                className="text-xs font-bold text-slate-500 hover:text-white cursor-pointer transition-colors uppercase tracking-widest"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            © 2026 Saxena's Group. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Showcase;
