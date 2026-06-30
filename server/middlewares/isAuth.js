import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(400).json({ message: "token not found" })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    if (!req.user) {
      return res.status(404).json({ message: "user not found" })
    }
    next()
  } catch (error) {
    console.error("isAuth crash:", error)
    return res.status(500).json({ 
      message: "invalid token", 
      error: error.message,
      stack: error.stack 
    })
  }
}

export default isAuth