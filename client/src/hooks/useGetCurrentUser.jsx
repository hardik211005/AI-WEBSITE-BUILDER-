import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function useGetCurrentUser() {
    const dispatch = useDispatch()
    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const token = localStorage.getItem("token")
                const result = await axios.get(`${serverUrl}/api/user/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                dispatch(setUserData(result.data))
            } catch (error) {
                console.log(error)
            }
        }
        getCurrentUser()
    }, [])
}

export default useGetCurrentUser