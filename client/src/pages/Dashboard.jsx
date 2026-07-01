import { Check, Plus, Share2, Trash2, LogOut } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function Dashboard() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const initials = userData?.name
    ? userData.name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const authHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };
  };

  useEffect(() => {
    const handleGetAllWebsites = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-all`, authHeader());
        setWebsites(result.data || []);
      } catch (error) {
        setError(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    handleGetAllWebsites();
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = async (site) => {
    try {
      await navigator.clipboard.writeText(site.deployUrl);
      setCopiedId(site._id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this website? This cannot be undone.")) return;
    try {
      setDeletingId(id);
      await axios.delete(`${serverUrl}/api/website/${id}`, authHeader());
      setWebsites((prev) => prev.filter((w) => w._id !== id));
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      dispatch(setUserData(null));
      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(120,0,60,0.22),transparent_28%),radial-gradient(circle_at_top_center,rgba(130,70,255,0.32),transparent_32%),radial-gradient(circle_at_top_right,rgba(60,20,140,0.20),transparent_28%),linear-gradient(to_bottom,#050505,#050505)] pointer-events-none" />

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

          {/* Profile button + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="rounded-full bg-zinc-700/80 flex items-center justify-center text-sm font-semibold border border-white/20 overflow-hidden w-[42px] h-[42px]"
            >
              {userData?.avatar ? (
                <img src={userData.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </button>

            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-3 w-48 rounded-xl bg-[#0d111a] border border-white/10 shadow-lg shadow-black/40 overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium truncate">{userData?.name || "User"}</p>
                  <p className="text-xs text-zinc-400 truncate">{userData?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </nav>

      <div className="relative z-8 max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-[30px] font-semibold tracking-tight">My Projects</h1>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-5 py-1 rounded-xl bg-[#6D5DF6] hover:bg-[#7a6bff] transition text-white font-medium text-lg shadow-lg shadow-violet-500/20"
          >
            <Plus size={20} />
            Create New
          </button>
        </div>

        {loading && <div className="mt-24 text-center text-zinc-400">Loading Your Websites...</div>}
        {error && !loading && <div className="mt-24 text-center text-red-400">{error}</div>}
        {!loading && !error && websites?.length === 0 && (
          <div className="mt-24 text-center text-zinc-400">You have no websites</div>
        )}

        {!loading && !error && websites?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {websites.map((w, i) => {
              const copied = copiedId === w._id;
              const deleting = deletingId === w._id;

              return (
                <motion.div
                  key={w._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl bg-[#0d111a] border border-white/10 overflow-hidden hover:border-white/20 transition flex flex-col"
                >
                  <div
                    className="relative h-40 bg-[#0d111a] cursor-pointer border-b border-white/10"
                    onClick={() => navigate(`/editor/${w._id}`)}
                  >
                    {w.latestCode ? (
                      <>
                        <iframe srcDoc={w.latestCode} title={w.title} className="absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white" />
                        <div className="absolute inset-0 bg-black/30" />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-2xl">No Preview</div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col gap-4 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold line-clamp-2">{w.title}</h3>
                      <span className="shrink-0 px-2.5 py-1 rounded-full text-xs bg-white/10 text-zinc-200 whitespace-nowrap">Website</span>
                    </div>

                    <p className="text-xs text-zinc-400">
                      Last Updated {new Date(w.updatedAt).toLocaleDateString("en-GB")}
                    </p>

                    <div className="mt-auto flex gap-2">
                      {w.deployed ? (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCopy(w)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            copied
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-white/10 hover:bg-white/20 border border-white/10"
                          }`}
                        >
                          {copied ? <><Check size={14} />Link Copied</> : <><Share2 size={14} />Share Link</>}
                        </motion.button>
                      ) : (
                        <button
                          onClick={() => navigate(`/editor/${w._id}`)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/10 hover:bg-white/20 border border-white/10 transition"
                        >
                          Open
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(w._id)}
                        disabled={deleting}
                        className="px-3 py-2 rounded-xl text-sm font-medium bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;