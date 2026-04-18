import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Zap, Star, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const images = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=2070&auto=format&fit=crop",
];

const FloatingElement = ({
  children,
  delay = 0,
  duration = 4,
  className = "",
}) => (
  <motion.div
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
    className={className}
  >
    {children}
  </motion.div>
);

const HeroSection = ({ onApplyLeaveClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-[#0a0a1a] overflow-hidden perspective-1000">
      {/* 3D Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <FloatingElement
          delay={0}
          className="absolute top-1/4 left-10 opacity-20 hidden lg:block"
        >
          <Star className="w-16 h-16 text-[#6D28D9] blur-sm" />
        </FloatingElement>
        <FloatingElement
          delay={1}
          className="absolute bottom-1/4 right-20 opacity-20 hidden lg:block"
        >
          <Shield className="w-20 h-20 text-[#10B981] blur-sm" />
        </FloatingElement>
        <FloatingElement
          delay={2}
          className="absolute top-1/3 right-1/4 opacity-10 hidden lg:block"
        >
          <Sparkles className="w-24 h-24 text-purple-400 blur-md" />
        </FloatingElement>
      </div>

      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt="Professional Workspace"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 2, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              transition: { duration: 1.5, ease: "easeInOut" },
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-transparent"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left preserve-3d">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.8, delay: 0.2 },
              }}
              className="inline-flex items-center gap-3 mb-8 px-6 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[#10B981] text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl"
            >
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              Empowering Global Enterprise
            </motion.div>

            <div className="relative mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1, delay: 0.4 },
                }}
                className="text-6xl lg:text-8xl font-semibold text-white leading-[0.9] tracking-tighter"
              >
                Empower <span className="text-[#8B5CF6]">Your</span> <br />
                <motion.span
                  initial={{ opacity: 0, z: -100 }}
                  animate={{
                    opacity: 1,
                    z: 0,
                    transition: { duration: 1, delay: 0.6 },
                  }}
                  className="inline-block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#10B981] drop-shadow-[0_10px_30px_rgba(109,40,217,0.5)] italic font-black"
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                  }}
                >
                  Workforce
                </motion.span>
              </motion.h1>

              {/* Subtle 3D Depth Decoration */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute -top-10 -left-10 w-20 h-20 border-t-2 border-l-2 border-[#6D28D9]/30 rounded-tl-3xl hidden lg:block"
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, delay: 0.8 },
              }}
              className="text-xl text-slate-300 mb-12 max-w-xl leading-relaxed mx-auto lg:mx-0 font-medium tracking-tight"
            >
              Saxena's Group redefining the future of HR. Experience the next
              generation of workforce management with our AI-driven ecosystem.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, delay: 1 },
              }}
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotateX: 5, rotateY: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="btn-enterprise btn-lavender px-16 py-5 rounded-2xl text-lg shadow-[0_0_8px_rgba(109,40,217,0.4)] hover:shadow-[0_0_15px_rgba(109,40,217,0.6)] transition-shadow duration-300 flex items-center gap-2 group"
                >
                  Get Started
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Visual 3D Content for Right Side */}
          <div className="hidden lg:flex justify-center items-center perspective-1000">
            <motion.div
              initial={{ opacity: 0, rotateY: 30, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              transition={{ duration: 1.5, delay: 1 }}
              className="relative w-[500px] h-[500px] preserve-3d"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#6D28D9]/20 to-[#10B981]/20 rounded-[4rem] blur-[60px] animate-pulse"></div>
              <div className="absolute inset-0 border-2 border-white/5 rounded-[4rem] transform rotate-3 scale-95 transition-transform group-hover:rotate-0"></div>
              <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-[4rem] border border-white/10 shadow-2xl flex items-center justify-center p-12">
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { icon: Zap, label: "Fast", color: "text-amber-400" },
                    {
                      icon: Star,
                      label: "Premium",
                      color: "text-lavender-400",
                    },
                    { icon: Shield, label: "Secure", color: "text-mint-400" },
                    {
                      icon: Sparkles,
                      label: "AI Powered",
                      color: "text-blue-400",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ translateZ: 50, scale: 1.1 }}
                      className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 shadow-xl preserve-3d"
                    >
                      <item.icon className={`w-12 h-12 ${item.color}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
