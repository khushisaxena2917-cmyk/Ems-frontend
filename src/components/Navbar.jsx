import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, UserCircle, LayoutDashboard } from "lucide-react";
import { motion } from "motion/react";

const Navbar = ({
  user,
  handleLogout,
  getDashboardLink,
  getProfileLink,
  onApplyLeaveClick,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#6D28D9] shadow-2xl border-b border-white/10"
          : "bg-[#6D28D9] border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with 3D effect */}
          <div className="flex-shrink-0 group">
            <Link to="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotateY: 180, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] transform perspective-1000"
              >
                <Building2 className="w-7 h-7 text-[#6D28D9]" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-white uppercase leading-none">
                  Saxena's Group
                </span>
                <span className="text-[10px] font-bold text-[#10B981] tracking-[0.3em] uppercase">
                  Enterprise
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Home", to: "/" },
              { label: "About", href: "#about" },
              { label: "Contact", href: "#contact" },
              {
                label: "Apply for Leave",
                onClick: onApplyLeaveClick,
                show: !!onApplyLeaveClick,
              },
            ]
              .filter((link) => link.show !== false)
              .map((link, idx) =>
                link.onClick ? (
                  <button
                    key={idx}
                    onClick={link.onClick}
                    className="relative text-sm font-black text-white/90 hover:text-white transition-colors group py-2 cursor-pointer"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#10B981] transition-all duration-300 group-hover:w-full shadow-[0_0_8px_#10B981]"></span>
                  </button>
                ) : link.to ? (
                  <Link
                    key={idx}
                    to={link.to}
                    className="relative text-sm font-black text-white/90 hover:text-white transition-colors group py-2"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#10B981] transition-all duration-300 group-hover:w-full shadow-[0_0_8px_#10B981]"></span>
                  </Link>
                ) : (
                  <a
                    key={idx}
                    href={link.href}
                    className="relative text-sm font-black text-white/90 hover:text-white transition-colors group py-2"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#10B981] transition-all duration-300 group-hover:w-full shadow-[0_0_8px_#10B981]"></span>
                  </a>
                ),
              )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center justify-end">
            {user ? (
              <button
                onClick={handleLogout}
                className="px-8 py-2.5 bg-rose-500 text-white rounded-lg text-sm font-black hover:bg-rose-600 hover:scale-105 active:scale-95 transition-all shadow-[0_5px_15px_rgba(244,63,94,0.3)] uppercase tracking-widest"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-8 py-2.5 bg-[#10B981] text-white rounded-lg text-sm font-black hover:bg-[#059669] hover:scale-105 active:scale-95 transition-all shadow-[0_5px_15px_rgba(16,185,129,0.3)] uppercase tracking-widest flex items-center gap-2"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
