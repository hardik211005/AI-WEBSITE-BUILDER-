import { generateResponse } from "../config/openRouter.js"
import extractJson from "../utils/extractJson.js"
import Website from "../models/website.model.js"
import User from "../models/user.model.js"

const SYSTEM_PROMPT = `You are an expert web developer. When given a description, return ONLY valid raw JSON in this exact format:
{
  "code": "<complete single-file HTML website with inline CSS and JS>",
  "title": "Website title here"
}`

export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.json({ user: null })
        }
        return res.json(req.user)
    } catch (error) {
        return res.status(500).json({ message: `get current user error ${error}` })
    }
}

export const createProject = async (req, res) => {
    try {
        const { initial_prompt } = req.body
        const userId = req.user._id

        if (!initial_prompt?.trim()) {
            return res.status(400).json({ message: "Prompt is required" })
        }

        // Website pehle create karo
        const website = await Website.create({
            user: userId,
            latestCode: "<!-- generating -->",
            conversation: [{ role: "user", content: initial_prompt }]
        })

        // AI se generate karo
        const fullPrompt = `${SYSTEM_PROMPT}\n\nUser request: ${initial_prompt}`
        const aiText = await generateResponse(fullPrompt)
        const parsed = await extractJson(aiText)

        // Update karo generated code se
        website.latestCode = parsed?.code || aiText
        website.title = parsed?.title || "Untitled Website"
        website.conversation.push({ role: "ai", content: "Website generated successfully!" })
        await website.save()
        await User.findByIdAndUpdate(userId, { $inc: { credits: -10 } })

        return res.json({ projectId: website._id })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `create project error ${error}` })
    }
}