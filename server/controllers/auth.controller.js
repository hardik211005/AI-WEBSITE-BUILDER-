import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
export const googleAuth = async (req, res) => {
  try {
    const { name, email, avatar } = req.body
    if (!email) {
      return res.status(400).json({ message: "email is required" })
    }
    let user = await User.findOne({ email })
    if (!user) {
      user = await User.create({ name, email, avatar })
    }
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    return res.status(200).json({ ...user._doc, token })
  } catch (error) {
    console.log("google auth error:", error.message)
    return res.status(500).json({ message: "google auth error", error: error.message })
  }
}


export const logOut = async (req, res) => {
  try {
    return res.status(200).json({ message: "log out successfully" })
  } catch (error) {
    return res.status(500).json({ message: `log out error ${error}` })
  }
}