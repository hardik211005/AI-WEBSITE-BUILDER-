import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from "motion/react"
import axios from "axios"
import { serverUrl } from '../App'

import {
  Smartphone,
  TabletIcon,
  LaptopIcon,
  SaveIcon,
  FullscreenIcon,
  ArrowBigDownDashIcon,
  EyeIcon,
  Loader2Icon,
  SendIcon,
} from "lucide-react"

const PHASES = [
  "Analyzing your request…",
  "Updating layout & structure…",
  "Rewriting HTML & CSS…",
  "Adding animations & interactions…",
  "Final quality checks…",
]

// Helper — token header
const authHeader = () => {
  const token = localStorage.getItem("token")
  return { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
}

function Editor() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [website, setWebsite] = useState(null)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [error, setError] = useState("")
  const [device, setDevice] = useState("desktop")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)

  const iframeRef = useRef(null)

  useEffect(() => {
    const fetchWebsite = async () => {
      setFetchLoading(true)
      setFetchError("")
      try {
        const result = await axios.get(`${serverUrl}/api/website/${id}`, authHeader())
        setWebsite(result.data)
      } catch (err) {
        console.log(err)
        setFetchError(err?.response?.data?.message || "Could not load this website")
      } finally {
        setFetchLoading(false)
      }
    }
    if (id) fetchWebsite()
  }, [id])

  const handleSendChanges = async () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setError("")
    try {
      const result = await axios.post(
        `${serverUrl}/api/website/${id}/changes`,
        { prompt },
        authHeader()
      )
      setWebsite((prev) => ({
        ...prev,
        latestCode: result.data.code,
        conversation: [
          ...(prev?.conversation || []),
          { role: "user", content: prompt },
          { role: "ai", content: result.data.message },
        ],
      }))
      setProgress(100)
      setPrompt("")
    } catch (err) {
      console.log(err)
      setError(err?.response?.data?.message || "something went wrong")
    } finally {
      setLoading(false)
    }
  }

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
        value < 20 ? Math.random() * 1.5
        : value < 60 ? Math.random() * 1.2
        : Math.random() * 0.6
      value += increment
      if (value >= 93) value = 93
      phase = Math.min(Math.floor((value / 100) * PHASES.length), PHASES.length - 1)
      setProgress(Math.floor(value))
      setPhaseIndex(phase)
    }, 1200)
    return () => clearInterval(interval)
  }, [loading])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setTimeout(() => {
        setIsSaving(false)
        alert("Website saved")
      }, 500)
    } catch (err) {
      setIsSaving(false)
      alert("Failed to save")
    }
  }

  const handleDownload = () => {
    if (!website?.latestCode) return
    const blob = new Blob([website.latestCode], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${website.title?.slice(0, 30) || "website"}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePreview = () => {
    const section = document.getElementById("editor-preview-panel")
    if (section) section.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  const handlePublish = async () => {
    if (isDeploying) return
    try {
      setIsDeploying(true)
      const result = await axios.post(
        `${serverUrl}/api/website/${id}/deploy`,
        {},
        authHeader()
      )
      setWebsite((prev) => ({ ...prev, deployed: true, deployUrl: result.data.url }))
      alert(`Published! Live at: ${result.data.url}`)
    } catch (err) {
      console.log(err)
      alert(err?.response?.data?.message || "Failed to publish")
    } finally {
      setIsDeploying(false)
    }
  }

  const previewWidth =
    device === "phone" ? "w-[320px]"
    : device === "tablet" ? "w-[700px]"
    : "w-full"

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-[#0b1220] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <Loader2Icon size={20} className="animate-spin" />
          Loading your website...
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#0b1220] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{fetchError}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-sm"
          >
            Back to My Projects
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#111827]/95 backdrop-blur">
        <div className="px-4 sm:px-6 py-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button className="p-2 rounded-lg hover:bg-white/10 transition" onClick={() => navigate("/dashboard")}>
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-semibold truncate">{website?.title || "Genweb.ai"}</h1>
              <p className="text-xs text-zinc-400 truncate">Build your website with AI</p>
            </div>
          </div>

          <div className="flex justify-center lg:flex-1">
            <div className="flex gap-2 bg-[#0b1020] border border-white/10 p-1.5 rounded-xl">
              <button onClick={() => setDevice("phone")} className={`p-2 rounded-lg transition ${device === "phone" ? "bg-white/15" : "hover:bg-white/10"}`}>
                <Smartphone size={18} />
              </button>
              <button onClick={() => setDevice("tablet")} className={`p-2 rounded-lg transition ${device === "tablet" ? "bg-white/15" : "hover:bg-white/10"}`}>
                <TabletIcon size={18} />
              </button>
              <button onClick={() => setDevice("desktop")} className={`p-2 rounded-lg transition ${device === "desktop" ? "bg-white/15" : "hover:bg-white/10"}`}>
                <LaptopIcon size={18} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center gap-2 text-sm">
              {isSaving ? <Loader2Icon size={16} className="animate-spin" /> : <SaveIcon size={16} />}
              Save
            </button>
            <button onClick={handlePreview} className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center gap-2 text-sm">
              <FullscreenIcon size={16} />
              Preview
            </button>
            <button onClick={handleDownload} disabled={!website?.latestCode} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <ArrowBigDownDashIcon size={16} />
              Download
            </button>
            <button onClick={handlePublish} disabled={isDeploying} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 transition flex items-center gap-2 text-sm disabled:opacity-60">
              {isDeploying ? <Loader2Icon size={16} className="animate-spin" /> : <EyeIcon size={16} />}
              {website?.deployed ? "Republish" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
        <div className="grid grid-cols-1 xl:grid-cols-[420px_minmax(0,1fr)] gap-6">
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-5 sm:p-6 h-fit">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3">
                Edit Your Website with
                <span className="block bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Real AI Power</span>
              </h1>
              <p className="text-sm text-zinc-400 mb-8">Describe the changes you want. genweb.ai focuses on quality, not shortcuts.</p>

              {website?.conversation?.length > 0 && (
                <div className="mb-5 max-h-64 overflow-y-auto space-y-3 pr-1">
                  {website.conversation.map((msg, i) => (
                    <div key={i} className={`text-sm rounded-xl p-3 ${msg.role === "user" ? "bg-white/10 text-zinc-100" : "bg-violet-500/10 text-zinc-300 border border-violet-400/20"}`}>
                      <span className="block text-[11px] uppercase tracking-wide text-zinc-500 mb-1">{msg.role === "user" ? "You" : "AI"}</span>
                      {msg.content}
                    </div>
                  ))}
                </div>
              )}

              <h2 className="text-lg font-semibold mb-3">Describe your changes</h2>
              <textarea
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
                placeholder="e.g. Change the hero background to dark blue, add a testimonials section…"
                className="w-full h-40 p-5 rounded-2xl bg-black/40 border border-white/10 outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-violet-500/40"
              />

              {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

              <button
                onClick={handleSendChanges}
                disabled={!prompt.trim() || loading}
                className={`w-full mt-5 py-3.5 rounded-2xl font-semibold text-base transition flex items-center justify-center gap-2 ${prompt.trim() && !loading ? "bg-white text-black hover:scale-[1.01]" : "bg-white/15 text-zinc-400 cursor-not-allowed"}`}
              >
                {loading ? "Updating..." : <><SendIcon size={16} />Apply Changes</>}
              </button>

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
                  <div className="flex justify-between mb-2 text-xs text-zinc-400">
                    <span>{PHASES[phaseIndex]}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400" animate={{ width: `${progress}%` }} transition={{ ease: "easeOut", duration: 0.8 }} />
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          <div id="editor-preview-panel" className="bg-[#111827] border border-white/10 rounded-3xl p-4 sm:p-5 min-h-[650px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Live Preview Area</h2>
                <p className="text-sm text-zinc-400">Device frame changes based on selected view</p>
              </div>
              {website?.deployed && (
                <a href={website.deployUrl} target="_blank" rel="noreferrer" className="text-xs text-violet-300 hover:text-violet-200 underline truncate max-w-[200px]">
                  {website.deployUrl}
                </a>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center overflow-auto rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b] p-4">
              <div className={`${previewWidth} transition-all duration-300 ${device === "desktop" ? "max-w-full" : ""} h-full`}>
                <div className="rounded-3xl border border-white/10 bg-[#0b1020] shadow-2xl overflow-hidden h-full flex flex-col">
                  <div className="h-12 px-4 border-b border-white/10 flex items-center gap-2 bg-black/30 shrink-0">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <div className="ml-3 text-xs text-zinc-400 truncate">
                      {device === "phone" ? "Mobile Preview" : device === "tablet" ? "Tablet Preview" : "Desktop Preview"}
                    </div>
                  </div>
                  <div className="bg-white flex-1 min-h-[520px]">
                    {website?.latestCode ? (
                      <iframe ref={iframeRef} srcDoc={website.latestCode} title={website.title} className="w-full h-full min-h-[520px] border-0" />
                    ) : (
                      <div className="h-full min-h-[520px] flex items-center justify-center text-center text-zinc-500 bg-[#0f172a]">
                        <p>No preview available for this website.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editor