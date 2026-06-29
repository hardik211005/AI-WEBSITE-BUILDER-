import { ArrowLeft, SparklesIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react"
import axios from "axios"
import { serverUrl } from '../App'
import { Loader2Icon } from "lucide-react"

const PHASES = [
  "Analyzing your idea…",
  "Designing layout & structure…",
  "Writing HTML & CSS…",
  "Adding animations & interactions…",
  "Final quality checks…",
]

function Generate() {
  const navigate = useNavigate()

  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [error, setError] = useState("")

  // -------------------------------
  // GENERATE WEBSITE (same logic)
  // -------------------------------
  const handleGenerateWebsite = async () => {
    if (!prompt.trim()) return

    setError("")
    setLoading(true)

    try {
      const result = await axios.post(
        `${serverUrl}/api/website/generate`,
        { prompt },
        { withCredentials: true }
      )

      setProgress(100)
      setLoading(false)
      navigate(`/editor/${result.data.websiteId}`)
    } catch (error) {
      setLoading(false)
      setError(error?.response?.data?.message || "Something went wrong")
      console.log(error)
    }
  }

  // -------------------------------
  // PROGRESS BAR LOGIC (same)
  // -------------------------------
  useEffect(() => {
    if (!loading) {
      setPhaseIndex(0)
      setProgress(0)
      return
    }

    let value = 0
    let phase = 0

    const interval = setInterval(() => {
      const increment =
        value < 20
          ? Math.random() * 1.5
          : value < 60
          ? Math.random() * 1.2
          : Math.random() * 0.6

      value += increment

      if (value >= 93) value = 93

      phase = Math.min(
        Math.floor((value / 100) * PHASES.length),
        PHASES.length - 1
      )

      setProgress(Math.floor(value))
      setPhaseIndex(phase)
    }, 1200)

    return () => clearInterval(interval)
  }, [loading])

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      {/* TOP NAVBAR — matches Editor.jsx */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#111827]/95 backdrop-blur">
        <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            className="p-2 rounded-lg hover:bg-white/10 transition"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-semibold truncate">
              Genweb<span className="text-zinc-400">.ai</span>
            </h1>
            <p className="text-xs text-zinc-400 truncate">
              Build your website with AI
            </p>
          </div>
        </div>
      </div>

      {/* PAGE BODY */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 text-xs mb-6 w-fit text-zinc-300">
            <SparklesIcon size={14} className="text-violet-300" />
            AI website generation
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3">
            Build Websites with
            <span className="block bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Real AI Power
            </span>
          </h1>

          <p className="text-sm text-zinc-400 mb-8 max-w-xl">
            This process may take several minutes. genweb.ai focuses on
            quality, not shortcuts.
          </p>

          <h2 className="text-lg font-semibold mb-3">
            Describe your website
          </h2>

          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            placeholder="Example: Build a modern SaaS landing page for an AI resume builder. Use a dark premium theme, hero section, feature grid, testimonials, pricing cards, FAQ and footer. Keep it responsive and smooth."
            className="w-full h-64 p-5 rounded-2xl bg-black/40 border border-white/10 outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-violet-500/40"
          />

          {error && (
            <p className="mt-3 text-sm text-red-400">{error}</p>
          )}

          <button
            onClick={handleGenerateWebsite}
            disabled={!prompt.trim() || loading}
            className={`w-full mt-5 py-3.5 rounded-2xl font-semibold text-base transition flex items-center justify-center gap-2 ${
              prompt.trim() && !loading
                ? "bg-white text-black hover:scale-[1.01]"
                : "bg-white/15 text-zinc-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <Loader2Icon size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Website"
            )}
          </button>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
            >
              <div className="flex justify-between mb-2 text-xs text-zinc-400">
                <span>{PHASES[phaseIndex]}</span>
                <span>{progress}%</span>
              </div>

              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.8 }}
                />
              </div>

              <div className="text-center text-xs text-zinc-400 mt-3">
                Estimated time remaining:{" "}
                <span className="text-white font-medium">~8–12 minutes</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Generate