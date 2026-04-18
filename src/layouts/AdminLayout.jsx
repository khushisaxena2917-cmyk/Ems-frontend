import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  CalendarCheck,
  BarChart3,
  Settings,
  ShieldCheck,
  Bell,
  LogOut,
  Building2,
  Menu,
  UserCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AdminLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const navItems = [
    {
      name: "Dashboard Overview",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Employee Management",
      path: "/admin/employees",
      icon: Users,
    },
    {
      name: "Contact Queries",
      path: "/admin/queries",
      icon: MessageSquare,
    },
    {
      name: "Leave & Attendance",
      path: "/admin/leaves-attendance",
      icon: CalendarCheck,
    },
    {
      name: "Reports & Analytics",
      path: "/admin/reports",
      icon: BarChart3,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
    {
      name: "User Management",
      path: "/admin/users",
      icon: ShieldCheck,
    },
    {
      name: "Notifications",
      path: "/admin/notifications",
      icon: Bell,
    },
    {
      name: "HR Profile",
      path: "/admin/profile",
      icon: UserCircle,
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1a1a3a] text-slate-300 w-64 border-r border-white/10">
      <div className="h-20 flex items-center px-6 border-b border-white/10 bg-[#6D28D9] shrink-0">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotateY: 180 }}
            className="w-10 h-10  rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            <Building2 className="w-6 h-6 text-[#6D28D9]" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-white uppercase leading-none">
              Saxena's Group
            </span>
            <span className="text-[10px] font-bold text-[#10B981] tracking-[0.2em] uppercase">
              Admin Portal
            </span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4">
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-[#6D28D9] text-white font-black shadow-[0_10px_20px_-5px_rgba(109,40,217,0.4)]"
                    : "hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-[#10B981]"
                  }`}
                />
                <span className="text-sm uppercase tracking-widest font-bold">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-white/10 bg-white/[0.02] backdrop-blur-md">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-4 px-3 py-4 rounded-2xl bg-white/5 border border-white/10 mb-6 group cursor-pointer transition-all hover:bg-white/10"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center text-white font-black shadow-lg shadow-[#6D28D9]/20 overflow-hidden border-2 border-white/20 group-hover:border-[#10B981]/50 transition-colors">
              {user.profilePicture || user.email === "admin@saxenagroup.com" ? (
                <img
                  src={
                    user.profilePicture ||
                    "https://i.ibb.co/v4YvXzq/saniya-khan.jpg"
                  }
                  alt="Khushi Saxena"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <span className="text-xl">{user.name?.charAt(0) || "K"}</span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10B981] border-2 border-[#1a1a3a] rounded-full shadow-sm"></div>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-black text-white truncate uppercase tracking-tight group-hover:text-[#10B981] transition-colors">
              {user.name || "Khushi Saxena"}
            </span>
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em] truncate mt-0.5">
              {user.role || "Senior HR & Founder"}
            </span>
          </div>
        </motion.div>
        <Link
          to="/login"
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all font-black uppercase tracking-widest text-[11px] border border-white/5 hover:border-rose-500/20 active:scale-95 shadow-lg"
        >
          <LogOut className="w-4 h-4" />
          Terminate Session
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-50">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#0a0a1a]/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden h-20 bg-[#0a0a1a] border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-[#6D28D9]" />
            </div>
            <span className="text-lg font-black tracking-tighter text-white uppercase leading-none">
              Saxena's Group
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-x-hidden relative">
          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#6D28D9]/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#10B981]/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
