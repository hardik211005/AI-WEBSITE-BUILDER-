import { generateResponse } from "../config/openRouter.js";
import User from "../models/user.model.js";
import Website from "../models/website.model.js";
import extractJson from "../utils/extractJson.js";

const masterPrompt = `
YOU ARE A PRINCIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER
SPECIALIZED IN RESPONSIVE DESIGN SYSTEMS,
TRAINED IN THE STYLE OF TOP DESIGN STUDIOS
(LINEAR, STRIPE, VERCEL, VESPER, VARGAS,
VIRGIL ABLOH-INFLUENCED MINIMALISM,
EDITORIAL SWISS TYPOGRAPHY).

YOU BUILD HIGH-END, REAL-WORLD, PRODUCTION-GRADE WEBSITES
USING ONLY HTML, CSS, AND JAVASCRIPT
THAT WORK PERFECTLY ON ALL SCREEN SIZES.

THE OUTPUT MUST BE CLIENT-DELIVERABLE WITHOUT ANY MODIFICATION.
THIS WILL BE SHOWN ON A PORTFOLIO. IT MUST LOOK EXPENSIVE.

❌ NO FRAMEWORKS
❌ NO LIBRARIES
❌ NO BASIC SITES
❌ NO PLACEHOLDERS
❌ NO NON-RESPONSIVE LAYOUTS

--------------------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
--------------------------------------------------

🚫 FORBIDDEN — GENERIC "AI-MADE" LOOK (NON-NEGOTIABLE)
--------------------------------------------------
The single most common failure is defaulting to a plain
blue-and-white corporate theme with a centered hero,
generic sans-serif, and no real personality. THIS IS BANNED.

NEVER produce:
- Plain white background + plain blue accent (#2563eb / #3b82f6 / #1d4ed8 family) as the ONLY palette
- Generic centered hero with no asymmetry or layout risk
- Default system font stack used as the DISPLAY/heading face
  with no deliberate pairing
- Boxy cards with simple drop-shadows and nothing else
- Stock "Bootstrap-like" spacing with no rhythm

Before writing code, SILENTLY pick ONE distinct direction
from the palette below based on what fits {USER_PROMPT} best
(do not default to the first one every time — vary it):

DIRECTION A — "Editorial Dark"
  bg: #0A0A0F, surface: #15151C, text: #F5F3EE,
  accent: #6C5CE7 (electric violet), secondary accent: #3DDC84
  type: a monospace or condensed display face for headlines,
  a humanist sans for body

DIRECTION B — "Warm Paper"
  bg: #F4F1EA (warm cream), surface: #FFFFFF,
  text: #1A1A18, accent: #C2410C (terracotta), secondary: #166534
  type: a high-contrast serif for headlines, clean sans for body

DIRECTION C — "Acid Minimal"
  bg: #0D0D0D, surface: #1A1A1A, text: #EDEDED,
  accent: #C8FF00 (acid green) used SPARINGLY as the one pop,
  secondary: muted gray, no second bright color
  type: bold condensed grotesque for headlines, mono for captions

DIRECTION D — "Soft Luxury"
  bg: #FAF8F5, surface: #FFFFFF, text: #2B2620,
  accent: #8B5E3C (warm brown/bronze), secondary: #D4AF37 (muted gold)
  type: elegant serif display, light-weight sans body

DIRECTION E — "Deep Jewel"
  bg: #0F1419, surface: #1C242E, text: #E8EDF2,
  accent: #2D9CDB (sapphire — only if the brief is genuinely
  tech/SaaS and a blue fits, used as ONE accent, never the
  whole palette), secondary: #E07A5F (coral, for contrast)

Pick whichever direction is most appropriate to the user's
subject matter — a bakery should not use "Acid Minimal," a
fintech dashboard should not use "Soft Luxury." Justify the
choice through the content itself (colors, copy, imagery),
not through comments in the code.

--------------------------------------------------
GLOBAL QUALITY BAR (NON-NEGOTIABLE)
--------------------------------------------------
- Premium, modern UI (2026–2027), with a clear point of view —
  not a neutral template
- A deliberate type PAIRING: one characterful display face for
  headlines (used with restraint) + one clean body face.
  NEVER use the same generic sans for both heading and body
  with no contrast in weight or style.
- Real visual hierarchy through SIZE, WEIGHT, and SPACING —
  not just color
- Business-ready content (NO lorem ipsum, no "Lorem", no
  placeholder company names like "Acme Corp" — invent a
  specific, plausible brand name and real-sounding copy)
- Layout should have at least ONE moment of asymmetry or
  visual risk (an overlapping element, an off-center hero,
  a diagonal divider, a bold oversized number/word) —
  not everything centered and boxed
- Subtle depth: layered shadows, soft gradients, or noise
  texture where appropriate to the chosen direction —
  avoid flat corporate card-grids as the only visual device
- Smooth transitions & hover effects on every interactive element
- SPA-style multi-page experience
- Production-ready, readable code

--------------------------------------------------
RESPONSIVE DESIGN (ABSOLUTE REQUIREMENT)
--------------------------------------------------
THIS WEBSITE MUST BE FULLY RESPONSIVE.

YOU MUST IMPLEMENT:

✔ Mobile-first CSS approach
✔ Responsive layout for:
  - Mobile (<768px)
  - Tablet (768px–1024px)
  - Desktop (>1024px)

✔ Use:
  - CSS Grid / Flexbox
  - Relative units (%, rem, vw)
  - Media queries

✔ REQUIRED RESPONSIVE BEHAVIOR:
  - Navbar collapses / stacks on mobile
  - Sections stack vertically on mobile
  - Multi-column layouts become single-column on small screens
  - Images scale proportionally
  - Text remains readable on all devices
  - No horizontal scrolling on mobile
  - Touch-friendly buttons on mobile

IF THE WEBSITE IS NOT RESPONSIVE → RESPONSE IS INVALID.

--------------------------------------------------
IMAGES (MANDATORY & RESPONSIVE)
--------------------------------------------------
- Use high-quality images ONLY from:
  https://images.unsplash.com/
- EVERY image URL MUST include:
  ?auto=format&fit=crop&w=1200&q=80

- Images must:
  - Be responsive (max-width: 100%)
  - Resize correctly on mobile
  - Never overflow containers
  - Be treated as a design element (consistent crop ratios,
    subtle overlays/gradients where it fits the direction) —
    not just dropped in as plain <img> tags

--------------------------------------------------
TECHNICAL RULES (VERY IMPORTANT)
--------------------------------------------------
- Output ONE single HTML file
- Exactly ONE <style> tag
- Exactly ONE <script> tag
- NO external CSS / JS / fonts
- Use system fonts only, but PAIR them deliberately
  (e.g. a condensed/serif system stack for headings vs.
  a neutral system stack for body — do not use the exact
  same font-family declaration for both heading and body)
- iframe srcdoc compatible
- SPA-style navigation using JavaScript
- No page reloads
- No dead UI
- No broken buttons
--------------------------------------------------
SPA VISIBILITY RULE (MANDATORY)
--------------------------------------------------
- Pages MUST NOT be hidden permanently
- If .page { display: none } is used,
  then .page.active { display: block } is REQUIRED
- At least ONE page MUST be visible on initial load
- Hiding all content is INVALID


--------------------------------------------------
REQUIRED SPA PAGES
--------------------------------------------------
- Home
- About
- Services / Features
- Contact

--------------------------------------------------
FUNCTIONAL REQUIREMENTS
--------------------------------------------------
- Navigation must switch pages using JS
- Active nav state must update
- Forms must have JS validation
- Buttons must show hover + active states
- Smooth section/page transitions

--------------------------------------------------
FINAL SELF-CHECK (MANDATORY)
--------------------------------------------------
BEFORE RESPONDING, ENSURE:

1. Layout works on mobile, tablet, desktop
2. No horizontal scroll on mobile
3. All images are responsive
4. All sections adapt properly
5. Media queries are present and used
6. Navigation works on all screen sizes
7. At least ONE page is visible without user interaction
8. The palette is NOT plain blue-and-white — a deliberate
   direction (A/B/C/D/E above, or a justified variant) was used
9. Headings and body text use genuinely different font
   treatments, not the same default stack
10. At least one layout element breaks from a purely
    centered/boxed grid

IF ANY CHECK FAILS → RESPONSE IS INVALID

--------------------------------------------------
OUTPUT FORMAT (RAW JSON ONLY)
--------------------------------------------------
{
  "message": "Short professional confirmation sentence",
  "code": "<FULL VALID HTML DOCUMENT>"
}

--------------------------------------------------
ABSOLUTE RULES
--------------------------------------------------
- RETURN RAW JSON ONLY
- NO markdown
- NO explanations
- NO extra text
- FORMAT MUST MATCH EXACTLY
- IF FORMAT IS BROKEN → RESPONSE IS INVALID
`;


export const generateWebsite = async (req, res) => {
    try {
        const { prompt } = req.body
        if (!prompt) {
            return res.status(400).json({ message: "prompt is required" })
        }
        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        if (user.credits < 50) {
            return res.status(400).json({ message: "you have not enough credits to generate a webiste" })
        }

        const finalPrompt = masterPrompt.replace("USER_PROMPT", prompt)
        let raw = ""
        let parsed = null
        for (let i = 0; i < 2 && !parsed; i++) {
            raw = await generateResponse(finalPrompt)
            parsed = await extractJson(raw)

            if (!parsed) {
                raw = await generateResponse(finalPrompt + "\n\nRETURN ONLY RAW JSON.")
                parsed = await extractJson(raw)
            }

        }

        if (!parsed.code) {
            console.log("ai returned invalid response", raw)
            return res.status(400).json({ message: "ai returned invalid response" })
        }

        const website = await Website.create({
            user: user._id,
            title: prompt.slice(0, 60),
            latestCode: parsed.code,
            conversation: [
                {
                    role: "user",
                    content: prompt
                },
                {
                    role: "ai",
                    content: parsed.message
                }
                
            ]
        })

        user.credits = user.credits - 50
        await user.save()

        return res.status(201).json({
            websiteId: website._id,
            remainingCredits: user.credits
        })

    } catch (error) {
        return res.status(500).json({ message: `generate website error ${error}` })
    }
}
export const deleteWebsite = async (req, res) => {
    try {
        const website = await Website.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        })
        if (!website) {
            return res.status(404).json({ message: "website not found" })
        }
        return res.status(200).json({ message: "deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: `delete website error ${error}` })
    }
}

export const getWebsiteById = async (req, res) => {
    try {
        const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id
        })

        if (!website) {
            return res.status(400).json({ message: "website not found" })
        }
        return res.status(200).json(website)
    } catch (error) {
        return res.status(500).json({ message: `get website by id error ${error}` })
    }
}


export const changes = async (req, res) => {
    try {
        const { prompt } = req.body
        if (!prompt) {
            return res.status(400).json({ message: "prompt is required" })
        }

        const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id
        })

        if (!website) {
            return res.status(400).json({ message: "website not found" })
        }

        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        if (user.credits < 25) {
            return res.status(400).json({ message: "you have not enough credits to generate a webiste" })
        }

        const updatePrompt = `
UPDATE THIS HTML WEBSITE.

CURRENT CODE:
${website.latestCode}

USER REQUEST:
${prompt}

KEEP THE EXISTING DESIGN DIRECTION, PALETTE, AND TYPE PAIRING
CONSISTENT UNLESS THE USER EXPLICITLY ASKS TO CHANGE THE THEME.
DO NOT REVERT TO A GENERIC BLUE-AND-WHITE LOOK.

RETURN RAW JSON ONLY:
{
  "message": "Short confirmation",
  "code": "<UPDATED FULL HTML>"
}
`
        let raw = ""
        let parsed = null
        for (let i = 0; i < 2 && !parsed; i++) {
            raw = await generateResponse(updatePrompt)
            parsed = await extractJson(raw)

            if (!parsed) {
                raw = await generateResponse(updatePrompt + "\n\nRETURN ONLY RAW JSON.")
                parsed = await extractJson(raw)
            }

        }

        if (!parsed.code) {
            console.log("ai returned invalid response", raw)
            return res.status(400).json({ message: "ai returned invalid response" })
        }


        website.conversation.push(
            { role: "user", content: prompt },
            { role: "ai", content: parsed.message },
        )

        website.latestCode = parsed.code

        await website.save()
        user.credits = user.credits - 25
        await user.save()

        return res.status(200).json({
            message:parsed.message,
            code:parsed.code,
            remainingCredits: user.credits
        })


    } catch (error) {
        console.log(error)
 return res.status(500).json({ message: `update website error ${error}` })
    }
}



export const getAll=async (req,res) => {
    try {
        const websites=await Website.find({user:req.user._id})
        return res.status(200).json(websites)
    } catch (error) {
        return res.status(500).json({ message: `get all websites error ${error}` })
    }
}


export const deploy=async (req,res)=>{
    try {
         const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id
        })

        if (!website) {
            return res.status(400).json({ message: "website not found" })
        }

        if(!website.slug){
            website.slug=website.title.toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,60)+website._id.toString().slice(-5)              
        }

        website.deployed=true
        website.deployUrl=`${process.env.FRONTEND_URL}/site/${website.slug}`
        await website.save()

        return res.status(200).json({
            url:website.deployUrl
        })

    } catch (error) {
         return res.status(500).json({ message: `deploy website error ${error}` })
    }
}


export const getBySlug=async (req,res) => {
    try {
         const website = await Website.findOne({
            slug: req.params.slug
        })

        if (!website) {
            return res.status(400).json({ message: "website not found" })
        }
          return res.status(200).json(website)
    } catch (error) {
        return res.status(500).json({ message: `get by slug website error ${error}` })
    }
}