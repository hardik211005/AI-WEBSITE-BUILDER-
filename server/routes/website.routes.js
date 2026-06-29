import express from "express"

import isAuth from "../middlewares/isAuth.js"
import { changes, deleteWebsite, deploy, generateWebsite, getAll, getBySlug, getWebsiteById } from "../controllers/website.controllers.js"


const websiteRouter=express.Router()

websiteRouter.post("/generate",isAuth,generateWebsite)
websiteRouter.get("/get-all",isAuth,getAll)
websiteRouter.get("/:id",isAuth,getWebsiteById)
websiteRouter.post("/:id/changes",isAuth,changes)
websiteRouter.post("/:id/deploy",isAuth,deploy)
websiteRouter.get("/slug/:slug",getBySlug)
websiteRouter.delete('/:id', isAuth, deleteWebsite)

export default websiteRouter