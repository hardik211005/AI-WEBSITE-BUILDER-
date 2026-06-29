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
    }, [userData])}