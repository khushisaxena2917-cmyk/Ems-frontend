import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "motion/react";
import {
  User,
  Briefcase,
  MapPin,
  Calendar,
  Users,
  FileCheck,
  Globe,
  Award,
  Linkedin,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
} from "lucide-react";

import khushi from "../../assets/project image/khushi.jpeg";
const HRProfile = () => {
  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const userData = JSON.parse(userStr);
          // Only fetch if we have a real ID (not demo-)
          if (userData.id && !userData.id.startsWith("demo-")) {
            const response = await axios.get(
              `https://ems-backend.vercel.app/api/auth/users/${userData.id}`,
            );
            setUser({ ...userData, ...response.data });
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (!user && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a1a]">
        <div className="w-12 h-12 border-4 border-[#6D28D9] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Provide defaults for missing fields from the schema
  const profileData = {
    name: user?.name || "Khushi Saxena",
    email: user?.email || "admin@saxenagroup.com",
    education:
      user?.qualification ||
      user?.education ||
      "Master in Computer Science (MCS)",
    role: user?.role || "Senior HR & Founder",
    company: user?.company || "Saxena's Group of Industries",
    location: user?.location || user?.department || "Corporate Office, India",
    dob: user?.dob || "2002-03-01",
    zodiac: user?.zodiac || "Aquarius ♒",
    linkedin: user?.linkedin || "#",
    website: user?.website || "#",
    employeesManaged: user?.employeesManaged || "2,500+",
    leaveRequests: user?.leaveRequests || "14",
    projects: user?.projects || "48",
    summary:
      user?.summary ||
      `As the Founder and Senior HR at Saxena's Group of Industries, I bring a unique blend of technical expertise and strategic leadership. With a Master in Computer Science (MCS), I have pioneered digital transformation in human capital management, bridging the gap between cutting-edge technology and workforce optimization.`,
    tags: user?.tags || [
      "Strategic Leadership",
      "Tech-Driven HR",
      "Industrial Growth",
      "MCS Graduate",
      "Founder mindset",
    ],
    profilePicture: user?.profilePicture || khushi,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10 p-6 sm:p-10 bg-gradient-to-br from-lavender-50 to-mint-50 min-h-screen"
    >
      <style>
        {`
          :root {
            --lavender-100: #ede9fe;
            --lavender-600: #7c3aed;
            --mint-100: #ccfbf1;
            --mint-400: #2dd4bf;
            --mint-600: #0d9488;
          }
          .glass-card {
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.4);
          }
          .profile-glow {
            box-shadow: 0 0 30px rgba(45, 212, 191, 0.4);
          }
          .floating {
            animation: floating 3s ease-in-out infinite;
          }
          @keyframes floating {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>

      {/* Hero Profile Section */}
      <motion.div
        whileHover={{ y: -5 }}
        className="glass-card rounded-[3rem] p-10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center gap-10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-lavender-200 to-mint-200 opacity-20 rounded-bl-[10rem] -mr-20 -mt-20"></div>

        {/* Profile Image */}
        <div className="relative group">
          <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-lavender-400 to-mint-400 p-1 profile-glow floating overflow-hidden">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white/50">
              <img
                src={
                  profileData.profilePicture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=7c3aed&color=fff&size=200`
                }
                alt={profileData.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white p-3 rounded-full shadow-lg border border-mint-200 z-10">
            <Award className="w-6 h-6 text-mint-600" />
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              {profileData.name}
              <Sparkles className="w-8 h-8 text-amber-400 floating" />
            </h1>
            <p className="text-lavender-600 text-xl font-bold mt-2 flex items-center gap-2 justify-center lg:justify-start">
              <GraduationCap className="w-6 h-6" />
              {profileData.education}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-lavender-100 flex items-center justify-center text-lavender-600 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Current Role
                </p>
                <p className="text-slate-800 font-bold uppercase">
                  {profileData.role}
                </p>
                <p className="text-slate-500 text-sm">{profileData.company}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-mint-100 flex items-center justify-center text-mint-600 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Location
                </p>
                <p className="text-slate-800 font-bold">Corporate Office</p>
                <p className="text-slate-500 text-sm">{profileData.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Birth Date
                </p>
                <p className="text-slate-800 font-bold">
                  {new Date(profileData.dob).toLocaleDateString()}
                </p>
                <p className="text-slate-500 text-sm">{profileData.zodiac}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Contact
                </p>
                <p className="text-slate-800 font-bold">{profileData.email}</p>
                <div className="flex gap-3 mt-1">
                  <a
                    href={profileData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-4 h-4 text-slate-400 hover:text-lavender-600 cursor-pointer" />
                  </a>
                  <a
                    href={profileData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="w-4 h-4 text-slate-400 hover:text-mint-600 cursor-pointer" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Interactive Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            label: "Total Employees Managed",
            value: profileData.employeesManaged,
            icon: Users,
            color: "bg-gradient-to-br from-lavender-500 to-indigo-600",
          },
          {
            label: "Active Leave Requests",
            value: profileData.leaveRequests,
            icon: FileCheck,
            color: "bg-gradient-to-br from-mint-400 to-mint-600",
          },
          {
            label: "Industry Projects",
            value: profileData.projects,
            icon: Globe,
            color: "bg-gradient-to-br from-sky-400 to-indigo-500",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05, rotateY: 10 }}
            className="glass-card p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-xl group cursor-default"
          >
            <div
              className={`w-16 h-16 rounded-3xl ${stat.color} flex items-center justify-center text-white shadow-lg mb-6 group-hover:rotate-12 transition-transform`}
            >
              <stat.icon className="w-8 h-8" />
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              {stat.value}
            </p>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-2">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Professional Summary Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="glass-card rounded-[3rem] p-10 shadow-xl border-l-8 border-l-mint-400"
      >
        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 mb-6">
          <Award className="w-8 h-8 text-mint-600" />
          Professional Summary
        </h2>
        <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
          <p>{profileData.summary}</p>
          <div className="flex flex-wrap gap-3 pt-4">
            {profileData.tags.map((tag, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-full bg-white/60 border border-white/40 text-xs font-bold text-slate-500 shadow-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HRProfile;
