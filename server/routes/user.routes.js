import express from "express"
import { getCurrentUser, createProject } from "../controllers/user.controllers.js"
import isAuth from "../middlewares/isAuth.js"

const userRouter = express.Router()

userRouter.get("/me", isAuth, getCurrentUser)
userRouter.post("/project", isAuth, createProject)  

export default userRouter