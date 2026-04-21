import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Users,
  Clock,
  PieChart,
  Mail,
  Phone,
  User,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  HeartHandshake,
  CreditCard,
  Sparkles,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";
import LeaveApplicationModal from "../components/LeaveApplicationModal";

import khushi from "../assets/project image/khushi.jpeg";
import mayuri from "../assets/project image/mayuri.jpeg";
import saniya from "../assets/project image/saniya.jpeg";

const featureColorClasses = {
  emerald: "bg-[#6D28D9]/10 text-[#6D28D9] shadow-[#6D28D9]/5",
  blue: "bg-[#10B981]/10 text-[#10B981] shadow-[#10B981]/5",
  purple: "bg-[#8B5CF6]/10 text-[#8B5CF6] shadow-[#8B5CF6]/5",
};

export default function Home() {
  const navigate = useNavigate();
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    queryType: "",
    message: "",
  });

  const [contactLoading, setContactLoading] = useState(false);

  const handleContactChange = (e) => {
    setContactForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    try {
      const res = await fetch("https://ems-backend.vercel.app/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Message sent successfully!");
        setContactForm({
          name: "",
          email: "",
          phone: "",
          queryType: "",
          message: "",
        });
      } else {
        alert(data.message || "Failed to send message");
      }
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setContactLoading(false);
    }
  };

  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
    return null;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    const role =
      user.role ||
      (user.email === "admin@saxenagroup.com" ? "admin" : "employee");
    return role === "admin" ? "/admin/dashboard" : "/employee/dashboard";
  };

  const getProfileLink = () => {
    if (!user) return "/login";
    const role =
      user.role ||
      (user.email === "admin@saxenagroup.com" ? "admin" : "employee");
    return role === "admin" ? "/admin/profile" : "/employee/profile";
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] font-sans text-slate-100 overflow-hidden selection:bg-[#6D28D9] selection:text-white">
      {/* Navigation Component */}
      <Navbar
        user={user}
        handleLogout={handleLogout}
        getDashboardLink={getDashboardLink}
        getProfileLink={getProfileLink}
        onApplyLeaveClick={() => setIsLeaveModalOpen(true)}
      />

      {/* Hero Section Component */}
      <HeroSection onApplyLeaveClick={() => setIsLeaveModalOpen(true)} />

      <LeaveApplicationModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
      />

      {/* About Us Section */}
      <section
        id="about"
        className="py-32 bg-[#0a0a1a] relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-black text-white mb-8 tracking-tighter">
                Redefining <br />
                <span className="text-[#6D28D9]">Workforce Management</span>
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed font-medium mb-10">
                Saxena's Group is at the forefront of the HR revolution. We've
                built an ecosystem that combines human intuition with 3D-driven
                AI insights to create the most efficient workplace environment
                on the planet.
              </p>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: "Founded", value: "2024" },
                  { label: "Employees", value: "500+" },
                  { label: "Success Rate", value: "99%" },
                  { label: "AI Accuracy", value: "99.9%" },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-black text-white">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring" }}
              className="relative perspective-1000"
            >
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotateX: [0, 5, 0],
                  rotateY: [0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 w-full aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(109,40,217,0.2)] preserve-3d"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#6D28D9] to-[#10B981] opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  <div className="relative w-full h-full bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 flex items-center justify-center overflow-hidden group">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute w-[150%] h-[150%] bg-[conic-gradient(from_0deg,transparent,rgba(109,40,217,0.3),transparent)]"
                    ></motion.div>
                    <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                      <div className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center shadow-2xl border border-white/20 transform-gpu group-hover:scale-110 transition-transform duration-500">
                        <Sparkles className="w-12 h-12 text-[#6D28D9]" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white tracking-tight">
                          AI HR Systems
                        </h4>
                        <p className="text-slate-400 font-bold text-sm mt-2">
                          The Future of EMS
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3D Floating Elements */}
                <motion.div
                  animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-10 right-10 w-20 h-20 bg-[#6D28D9]/20 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center shadow-xl z-20"
                >
                  <Zap className="w-10 h-10 text-[#6D28D9]" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -15, 0], x: [0, -15, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute bottom-10 left-10 w-16 h-16 bg-[#10B981]/20 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center shadow-xl z-20"
                >
                  <ShieldCheck className="w-8 h-8 text-[#10B981]" />
                </motion.div>
              </motion.div>

              {/* Decorative Background 3D Elements */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#6D28D9]/10 rounded-full blur-[100px] -z-10"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#10B981]/10 rounded-full blur-[100px] -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-32 bg-[#0a0a1a] relative overflow-hidden"
      >
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(109,40,217,0.05),transparent)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight"
            >
              Everything You Need to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D28D9] to-[#10B981]">
                Manage Your Team
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 max-w-2xl mx-auto font-bold uppercase tracking-widest text-xs"
            >
              Streamline your HR workflows with our comprehensive suite of tools
              designed for modern businesses.
            </motion.p>
          </div>

          {/* Employee Profile Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-32">
            {[
              {
                name: "Khushi Saxena",
                role: "Senior HR & Founder",
                image: khushi,
              },
              {
                name: "Mayuri bhatnagar",
                role: "Technical Lead",
                image: mayuri,
              },
              {
                name: "saniya",
                role: "Operations Manager",
                image: saniya,
              },
            ].map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-4 shadow-2xl transition-all hover:border-[#6D28D9]/50 overflow-hidden"
              >
                {/* Square Image Container */}
                <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden bg-slate-800">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                  />
                  {/* Subtle Dark Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-100 transition-opacity duration-700 group-hover:opacity-0 z-10"></div>
                </div>

                {/* Text Details */}
                <div className="mt-6 px-4 pb-4">
                  <h4 className="text-xl font-bold text-white tracking-tight transition-colors group-hover:text-[#6D28D9]">
                    {member.name}
                  </h4>
                  <p className="text-sm font-black text-[#8B5CF6]/70 uppercase tracking-widest mt-1">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 perspective-1000">
            {[
              {
                icon: Users,
                title: "Employee Directory",
                desc: "Centralize all employee records and documents securely.",
                color: "emerald",
                image:
                  "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop",
              },
              {
                icon: Clock,
                title: "Attendance Tracking",
                desc: "Monitor clock-ins, leaves, and shifts in real-time.",
                color: "blue",
                image:
                  "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop",
              },
              {
                icon: PieChart,
                title: "Payroll Management",
                desc: "Automate salary calculations and distributions.",
                color: "purple",
                image:
                  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop",
              },
              {
                icon: TrendingUp,
                title: "Performance Management",
                desc: "Set goals, track progress, and evaluate team achievements.",
                color: "emerald",
                image:
                  "https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=800&auto=format&fit=crop",
              },
              {
                icon: HeartHandshake,
                title: "Benefits Administration",
                desc: "Manage health, retirement, and wellness programs seamlessly.",
                color: "blue",
                image:
                  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
              },
              {
                icon: CreditCard,
                title: "Compensation & Rewards",
                desc: "Design and execute competitive salary and bonus structures.",
                color: "purple",
                image:
                  "https://images.unsplash.com/photo-1567113463300-1025f5d37615?q=80&w=800&auto=format&fit=crop",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{
                  rotateX: 5,
                  rotateY: -5,
                  translateZ: 20,
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(109, 40, 217, 0.2)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: (idx % 3) * 0.1,
                }}
                className="rounded-[2.5rem] bg-[#1a1a3a] border border-white/5 hover:border-[#6D28D9]/50 transition-all group relative overflow-hidden preserve-3d flex flex-col"
              >
                {/* Feature Image Header */}
                <div className="relative h-48 w-full overflow-hidden bg-white/5">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a3a] via-[#1a1a3a]/20 to-transparent"></div>
                </div>

                <div className="p-10 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6D28D9]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-6 ${featureColorClasses[feature.color]}`}
                  >
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed font-bold text-sm">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-[#0a0a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1a1a3a] rounded-[3.5rem] overflow-hidden shadow-2xl border border-white/10 relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(16,185,129,0.05),transparent)] pointer-events-none"></div>

            <div className="grid lg:grid-cols-2">
              <div className="p-12 lg:p-20 text-white relative z-10">
                <h2 className="text-5xl font-black mb-8 tracking-tighter">
                  Contact <br />
                  <span className="text-[#6D28D9]">Saxena's Group</span>
                </h2>
                <p className="text-slate-400 mb-12 text-lg font-bold uppercase tracking-widest text-xs">
                  Ready to transform your HR? <br /> Get in touch with our
                  experts today.
                </p>
                <div className="space-y-8">
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#6D28D9] transition-all group-hover:shadow-[0_0_20px_rgba(109,40,217,0.4)]">
                      <Mail className="w-7 h-7 text-[#6D28D9] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">
                        Email Us
                      </p>
                      <p className="font-black text-slate-100 text-lg">
                        contact@saxenagroup.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#10B981] transition-all group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                      <Phone className="w-7 h-7 text-[#10B981] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">
                        Call Us
                      </p>
                      <p className="font-black text-slate-100 text-lg">
                        +91 98765 43210
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#0f0f2d] p-12 lg:p-20 relative z-10 border-l border-white/10">
                <form className="space-y-8" onSubmit={handleContactSubmit}>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] ml-2">
                      Full Name
                    </label>
                    <div className="relative group">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#6D28D9] transition-colors" />
                      <input
                        type="text"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        required
                        spellCheck="false"
                        className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-black text-white placeholder:text-slate-600 shadow-inner"
                        placeholder="Full Name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] ml-2">
                      Corporate Email
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#10B981] transition-colors" />
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        required
                        spellCheck="false"
                        className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-[#10B981] outline-none transition-all font-black text-white placeholder:text-slate-600 shadow-inner"
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] ml-2">
                        Employee Phone
                      </label>
                      <div className="relative group">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#6D28D9] transition-colors" />
                        <input
                          type="tel"
                          name="phone"
                          value={contactForm.phone}
                          onChange={handleContactChange}
                          required
                          className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-black text-white placeholder:text-slate-600 shadow-inner"
                          placeholder="+91 00000 00000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] ml-2">
                        Query Type
                      </label>
                      <div className="relative group">
                        <HelpCircle className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#10B981] transition-colors" />
                        <select
                          name="queryType"
                          value={contactForm.queryType}
                          onChange={handleContactChange}
                          required
                          className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-[#10B981] outline-none transition-all font-black text-white placeholder:text-slate-600 shadow-inner appearance-none"
                        >
                          <option value="" className="bg-[#0f0f2d]">
                            Select Query Type
                          </option>
                          <option value="General" className="bg-[#0f0f2d]">
                            General Inquiry
                          </option>
                          <option value="Technical" className="bg-[#0f0f2d]">
                            Technical Support
                          </option>
                          <option value="HR" className="bg-[#0f0f2d]">
                            HR & Recruitment
                          </option>
                          <option value="Payroll" className="bg-[#0f0f2d]">
                            Payroll & Benefits
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] ml-2">
                      Message
                    </label>
                    <div className="relative group">
                      <MessageSquare className="absolute left-6 top-10 w-5 h-5 text-slate-500 group-focus-within:text-[#6D28D9] transition-colors" />
                      <textarea
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        required
                        rows="4"
                        className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-[#6D28D9] outline-none transition-all font-black text-white placeholder:text-slate-600 shadow-inner resize-none"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={contactLoading}
                    className="btn-enterprise btn-lavender w-full py-5 text-lg mt-4 flex items-center justify-center gap-3"
                  >
                    {contactLoading ? (
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Send Message
                        <Mail className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />

      {/* Leave Application Modal */}
      <LeaveApplicationModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
      />
    </div>
  );
}
