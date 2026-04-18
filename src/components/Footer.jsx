import React from "react";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import { motion } from "motion/react";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a1a] text-slate-400 py-20 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(109,40,217,0.03),transparent)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="flex items-center justify-center gap-3 mb-10 group">
          <motion.div
            whileHover={{ rotateY: 180 }}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg"
          >
            <Building2 className="w-6 h-6 text-[#6D28D9]" />
          </motion.div>
          <span className="text-2xl font-black text-white tracking-tighter uppercase">
            SAXENA'S GROUP
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-12 text-xs font-black uppercase tracking-[0.2em]">
          <Link to="/" className="hover:text-[#6D28D9] transition-colors">
            Home
          </Link>
          <a
            href="#about"
            className="hover:text-[#6D28D9] transition-colors text-slate-400"
          >
            About Us
          </a>
          <a
            href="#contact"
            className="hover:text-[#10B981] transition-colors text-slate-400"
          >
            Contact
          </a>
          <Link
            to="/employee/apply-leave"
            className="hover:text-[#6D28D9] transition-colors"
          >
            Apply for Leave
          </Link>
          <Link
            to="/project-details"
            className="hover:text-[#6D28D9] transition-colors"
          >
            Project Details
          </Link>
          <Link
            to="/dashboard"
            className="hover:text-[#6D28D9] transition-colors"
          >
            Dashboard
          </Link>
        </div>

        <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto mb-10"></div>

        <p className="text-[10px] mb-10 font-bold uppercase tracking-[0.3em] opacity-40">
          © {new Date().getFullYear()} Saxena's Group of Industries. Global
          Enterprise.
        </p>

        <div className="flex justify-center gap-10 text-[9px] font-black uppercase tracking-[0.4em] opacity-30">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Cookie Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
