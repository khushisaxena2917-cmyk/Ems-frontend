import React, { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Edit2,
  Camera,
  Save,
  X,
  Briefcase,
} from "lucide-react";

export default function EmployeeProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: user.firstName || user.name?.split(" ")[0] || "Saniya",
    lastName: user.lastName || user.name?.split(" ")[1] || "Khan",
    email: user.email || "employee@saxenagroup.com",
    phone: user.phone || "+91 98765 43210",
    department: user.department || "Design",
    role: user.role || "Employee",
    dob: "2000-01-01",
    gender: "Female",
    address: "New Delhi, India",
    profilePic:
      user.email === "employee@saxenagroup.com"
        ? "https://i.ibb.co/v4YvXzq/saniya-khan.jpg"
        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/employees/${user.id || user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: `${profile.firstName} ${profile.lastName}`,
            phone: profile.phone,
            department: profile.department,
            dob: profile.dob,
            gender: profile.gender,
            address: profile.address,
            profilePicture: profile.profilePic,
          }),
        },
      );

      if (res.ok) {
        const updatedEmployee = await res.json();
        // Sync local storage
        const updatedUser = {
          ...user,
          name: updatedEmployee.name,
          phone: updatedEmployee.phone,
          department: updatedEmployee.department,
          profilePicture: updatedEmployee.profilePicture,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("An error occurred while saving your profile.");
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10 max-w-5xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Employee Profile
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            Manage your corporate identity and personal preferences.
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-enterprise btn-lavender px-8 py-4 rounded-2xl"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4 inline mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-enterprise btn-mint px-8 py-4 rounded-2xl"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl group">
        {/* Cover Photo with 3D effect */}
        <div className="h-48 sm:h-64 bg-gradient-to-br from-[#6D28D9] via-[#4F46E5] to-[#10B981] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          ></motion.div>
        </div>

        <div className="px-8 sm:px-12 pb-12">
          {/* Avatar & Basic Info */}
          <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-8 -mt-20 sm:-mt-24 mb-12">
            <div className="relative group/avatar">
              <div className="w-40 h-40 rounded-[2.5rem] border-8 border-[#0a0a1a] bg-[#1a1a3a] shadow-2xl overflow-hidden flex items-center justify-center transform group-hover/avatar:rotate-3 transition-transform duration-500">
                <img
                  src={profile.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {isEditing && (
                <label className="absolute bottom-2 right-2 w-12 h-12 bg-[#6D28D9] rounded-2xl text-white flex items-center justify-center shadow-xl hover:bg-[#7c3aed] transition-all border-4 border-[#0a0a1a] hover:scale-110 cursor-pointer">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleProfilePicChange}
                    accept="image/*"
                  />
                </label>
              )}
            </div>

            <div className="text-center sm:text-left flex-1 pb-4">
              <h2 className="text-4xl font-black text-white tracking-tighter">
                {profile.firstName} {profile.lastName}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3">
                <p className="text-lavender-400 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 bg-lavender-500/10 px-3 py-1.5 rounded-lg border border-lavender-500/20">
                  <Briefcase className="w-3 h-3" />
                  {profile.role}
                </p>
                <p className="text-[#10B981] font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 bg-[#10B981]/10 px-3 py-1.5 rounded-lg border border-[#10B981]/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></div>
                  Active Status
                </p>
              </div>
            </div>
          </div>

          {/* Profile Form / Details */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Personal Information */}
            <div className="flex flex-col gap-8">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/5 pb-4">
                Personal Credentials
              </h3>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white shadow-xl"
                    />
                  ) : (
                    <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-white font-bold">
                      <User className="w-4 h-4 text-lavender-400" />
                      {profile.firstName}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white shadow-xl"
                    />
                  ) : (
                    <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-white font-bold">
                      <User className="w-4 h-4 text-lavender-400" />
                      {profile.lastName}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                    Birth Date
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dob"
                      value={profile.dob}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white shadow-xl"
                    />
                  ) : (
                    <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-white font-bold">
                      <Calendar className="w-4 h-4 text-lavender-400" />
                      {profile.dob}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                    Gender Identity
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white appearance-none shadow-xl"
                    >
                      <option value="Male" className="bg-[#0a0a1a]">
                        Male
                      </option>
                      <option value="Female" className="bg-[#0a0a1a]">
                        Female
                      </option>
                      <option value="Other" className="bg-[#0a0a1a]">
                        Other
                      </option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-white font-bold">
                      <User className="w-4 h-4 text-lavender-400" />
                      {profile.gender}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact & Department */}
            <div className="flex flex-col gap-8">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/5 pb-4">
                Corporate Contact
              </h3>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                  Work Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white shadow-xl"
                  />
                ) : (
                  <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-white font-bold">
                    <Mail className="w-4 h-4 text-lavender-400" />
                    {profile.email}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                  Mobile Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white shadow-xl"
                  />
                ) : (
                  <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-white font-bold">
                    <Phone className="w-4 h-4 text-lavender-400" />
                    {profile.phone}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                  Primary Department
                </label>
                {isEditing ? (
                  <select
                    name="department"
                    value={profile.department}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white appearance-none shadow-xl"
                  >
                    <option value="Engineering" className="bg-[#0a0a1a]">
                      Engineering
                    </option>
                    <option value="Design" className="bg-[#0a0a1a]">
                      Design
                    </option>
                    <option value="Marketing" className="bg-[#0a0a1a]">
                      Marketing
                    </option>
                    <option value="HR" className="bg-[#0a0a1a]">
                      Human Resources
                    </option>
                  </select>
                ) : (
                  <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-white font-bold">
                    <Building className="w-4 h-4 text-lavender-400" />
                    {profile.department}
                  </div>
                )}
              </div>
            </div>

            {/* Address - Full Width */}
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                Physical Address
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-lavender-500/50 outline-none transition-all font-bold text-white shadow-xl resize-none"
                />
              ) : (
                <div className="flex items-start gap-4 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-white font-bold leading-relaxed">
                  <MapPin className="w-4 h-4 text-lavender-400 mt-1" />
                  {profile.address}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
