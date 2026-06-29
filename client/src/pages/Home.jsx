import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react"
import LoginModal from '../components/LoginModal'
import { useDispatch, useSelector } from 'react-redux'
import { Loader2 } from "lucide-react"
import { serverUrl } from '../App'
import axios from 'axios'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

function Home() {
    const [openLogin, setOpenLogin] = useState(false)
    const { userData } = useSelector(state => state.user)
    const [openProfile, setOpenProfile] = useState(false)
    const [websites, setWebsites] = useState(null)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const getAuthHeader = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, getAuthHeader())
            localStorage.removeItem("token")
            dispatch(setUserData(null))
            setOpenProfile(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!userData) return setOpenLogin(true)
        if (!input.trim()) return
        try {
            setLoading(true)
            const result = await axios.post(`${serverUrl}/api/user/project`,
                { initial_prompt: input },
                getAuthHeader()
            )
            setLoading(false)
            navigate(`/editor/${result.data.projectId}`)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        if (!userData) return
        const handleGetAllWebsites = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-all`, getAuthHeader())
                setWebsites(result.data || [])
            } catch (error) {
                console.log(error)
            }
        }
        handleGetAllWebsites()
    }, [userData])

    const initials = userData?.name
        ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : ''

    return (
        <div
            className='relative h-screen w-screen text-white overflow-hidden font-sans flex flex-col'
            style={{ backgroundColor: '#000000' }}
        >

            {/* Purple radial glow */}
            <div className='pointer-events-none fixed inset-0 z-0'
                style={{
                    background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(100,40,180,0.55) 0%, rgba(60,20,120,0.18) 55%, transparent 100%)'
                }}
            />

            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/10 bg-black/10 backdrop-blur-xl">
  {/* left logo */}
  <div
    className="flex items-center gap-2 font-bold text-2xl cursor-pointer"
    onClick={() => navigate("/")}
  >
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
      <path
        d="M4 22L13 6L22 22"
        stroke="white"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 16H18.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M20 8L24 14L20 20"
        stroke="white"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
    GenWebAI
  </div>

  {/* center nav */}
  <div className="hidden md:flex items-center gap-9 text-base text-zinc-300">
    <span
      className="hover:text-white cursor-pointer transition"
      onClick={() => navigate("/")}
    >
      Home
    </span>
    <span
      className="hover:text-white cursor-pointer transition"
      onClick={() => navigate("/dashboard")}
    >
      My Projects
    </span>
    <span
      className="text-white cursor-pointer transition"
      onClick={() => navigate("/community")}
    >
      Community
    </span>
    <span
      className="hover:text-white cursor-pointer transition"
      onClick={() => navigate("/pricing")}
    >
      Pricing
    </span>
  </div>

  {/* right side */}
  <div className="flex items-center gap-3">
    <button
      onClick={() => navigate("/pricing")}
      className="px-5 py-2 rounded-full border border-white/20 text-sm md:text-base hover:bg-white/10 transition bg-white/5"
    >
      Credits :{" "}
      <span className="text-purple-200">{userData?.credits ?? 10}</span>
    </button>

    <button className="rounded-full bg-zinc-700/80 flex items-center justify-center text-sm md:text-base font-semibold border border-white/20 overflow-hidden w-[42px] h-[42px] backdrop-blur-md">
      {userData?.avatar ? (
        <img
          src={userData.avatar}
          alt="avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        initials
      )}
    </button>
  </div>
</nav>

            {/* ── Hero ── */}
            <section className='relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 min-h-0'>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className='flex items-center gap-2 border border-white/15 rounded-full px-1.5 pr-4 py-1 text-sm mb-4 cursor-pointer'
                    onClick={() => navigate('/pricing')}
                >
                    <span className='bg-indigo-600 text-xs font-semibold px-3 py-1 rounded-full'>NEW</span>
                    <span className='text-zinc-200'>Try 30 days free trial option</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className='font-bold max-w-3xl leading-tight'
                    style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', letterSpacing: '-0.02em' }}
                >
                    Turn thoughts into websites<br />instantly, with AI.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className='mt-3 text-zinc-400 text-base max-w-md leading-relaxed'
                >
                    Create, customize and publish website faster than ever with our AI Site Builder.
                </motion.p>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onSubmit={handleSubmit}
                    className='mt-6 w-full max-w-2xl rounded-2xl p-4 relative'
                    style={{
                        background: 'linear-gradient(180deg, rgba(21, 18, 28, 0.55) 0%, rgba(30,18,60,0.85) 100%)',
                        border: '1px solid rgba(37, 30, 54, 0.6)',
                        backdropFilter: 'blur(12px)',
                    }}
                >
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        rows={3}
                        placeholder='Describe your presentation in details'
                        className='w-full bg-transparent outline-none text-white placeholder-zinc-400 resize-none text-sm leading-relaxed'
                    />
                    <div className='flex justify-end mt-2'>
                        <button
                            type='submit'
                            className='flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition hover:opacity-90 active:scale-95'
                            style={{ background: 'linear-gradient(90deg, #c084fc, #7c3aed)' }}
                        >
                            {loading ? (
                                <>Creating... <Loader2 className='animate-spin w-4 h-4' /></>
                            ) : 'Create with AI'}
                        </button>
                    </div>
                </motion.form>
            </section>

            {openLogin && <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />}
        </div>
    )
}

export default Home