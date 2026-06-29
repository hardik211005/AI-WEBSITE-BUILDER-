import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { ExternalLink, Sparkles } from "lucide-react";

function Community() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const dummyProjects = [
    {
      id: 1,
      title: "Modern SaaS Landing Page",
      description: "A clean landing page for a software startup with hero section, pricing and testimonials.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      author: "Hardik",
      date: "24/06/2026",
      tag: "SaaS",
    },
    {
      id: 2,
      title: "Portfolio Website UI",
      description: "Minimal personal portfolio design with projects showcase, about section and contact area.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
      author: "Aman",
      date: "20/06/2026",
      tag: "Portfolio",
    },
    {
      id: 3,
      title: "Ecommerce Home Page",
      description: "A stylish ecommerce homepage layout with featured products, banners and CTA sections.",
      image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200&auto=format&fit=crop",
      author: "Rohit",
      date: "18/06/2026",
      tag: "Ecommerce",
    },
    {
      id: 4,
      title: "Restaurant Landing Page",
      description: "Elegant restaurant site with menu showcase, reservations, and atmospheric hero imagery.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
      author: "Priya",
      date: "15/06/2026",
      tag: "Food",
    },
    {
      id: 5,
      title: "Fitness Studio Website",
      description: "High-energy gym website with class schedules, trainer profiles and membership plans.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
      author: "Karan",
      date: "12/06/2026",
      tag: "Health",
    },
    {
      id: 6,
      title: "Agency Creative Site",
      description: "Bold creative agency site with case studies, team section and animated interactions.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
      author: "Sneha",
      date: "10/06/2026",
      tag: "Agency",
    },
  ];

  const initials = userData?.name
    ? userData.name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="relative min-h-screen w-screen text-white font-sans flex flex-col" style={{ backgroundColor: "#000000" }}>

      {/* Purple radial glow */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(100,40,180,0.55) 0%, rgba(60,20,120,0.18) 35%, transparent 100%)"
      }} />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/10 bg-black/10 backdrop-blur-xl">
        <div className="flex items-center gap-2 font-bold text-2xl cursor-pointer" onClick={() => navigate("/")}>
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <path d="M4 22L13 6L22 22" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M7.5 16H18.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M20 8L24 14L20 20" stroke="white" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          GenWebAI
        </div>
        <div className="hidden md:flex items-center gap-9 text-base text-zinc-300">
          <span className="hover:text-white cursor-pointer transition" onClick={() => navigate("/")}>Home</span>
          <span className="hover:text-white cursor-pointer transition" onClick={() => navigate("/dashboard")}>My Projects</span>
          <span className="text-white cursor-pointer transition" onClick={() => navigate("/community")}>Community</span>
          <span className="hover:text-white cursor-pointer transition" onClick={() => navigate("/pricing")}>Pricing</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/pricing")} className="px-5 py-2 rounded-full border border-white/20 text-sm md:text-base hover:bg-white/10 transition bg-white/5">
            Credits : <span className="text-purple-200">{userData?.credits ?? 10}</span>
          </button>
          <button className="rounded-full bg-zinc-700/80 flex items-center justify-center text-sm font-semibold border border-white/20 overflow-hidden w-[42px] h-[42px] backdrop-blur-md">
            {userData?.avatar ? <img src={userData.avatar} alt="avatar" className="w-full h-full object-cover" /> : initials}
          </button>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 w-full">

        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-violet-400" />
              <span className="text-xs text-violet-400 uppercase tracking-widest font-medium">Community Showcase</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Built with{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                GenWebAI
              </span>
            </h1>
            <p className="mt-3 text-zinc-400 text-base max-w-md">
              Explore websites crafted by our community. Get inspired and build your own.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition text-white font-medium shadow-lg shadow-violet-500/20 self-start md:self-auto whitespace-nowrap"
          >
            <Sparkles size={16} />
            Create Your Own
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { label: "Websites Built", value: "2,400+" },
            { label: "Community Members", value: "840+" },
            { label: "Templates Used", value: "120+" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-6 py-4 text-center">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-zinc-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {dummyProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -6 }}
              className="group rounded-2xl overflow-hidden bg-[#0d111a] border border-white/10 hover:border-violet-500/40 transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d111a] via-transparent to-transparent" />

                {/* Tag pill */}
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur border border-white/10 text-zinc-200">
                  {project.tag}
                </span>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ExternalLink size={14} />
                    View Project
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-base font-semibold leading-snug mb-2">{project.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed flex-1">{project.description}</p>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold">
                      {project.author[0]}
                    </div>
                    <span className="text-sm text-zinc-300">{project.author}</span>
                  </div>
                  <span className="text-xs text-zinc-500">{project.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Community;