import express from 'express'
import { chatSessions } from '../GemniConfig.js'

const AI_Router = express.Router()

AI_Router.post('/', async (req, res) => {
  try {
    const { text, title } = req.body

    // Create the prompt for generating the blog title
    const BlogTitlePrompt = `Read the ${title} for the description that I have given for the blog. Just give me the Title in plain string and do not include any symbols, just alphanumeric, that you think is the best for the Blog and no other text, just one single title.`

    // Generate the blog title using Gemini AI
    const Gemni_Response = await chatSessions.sendMessage(BlogTitlePrompt)
    const BlogTitleAi = Gemni_Response.response.text()

    // Create the prompt for generating the blog description
    const BlogDescriptionPrompt = `Read the ${BlogTitleAi} and the ${text} given and then provide me just the description for the blog and nothing else. Do not include any symbols or hashs. Just make the description alpha numeric`

    // Generate the blog description using Gemini AI
    const Gemni_Response2 = await chatSessions.sendMessage(
      BlogDescriptionPrompt
    )
    const BlogDescriptionAI = Gemni_Response2.response.text()

    // Check if the generated description is valid
    if (BlogDescriptionAI) {
      // Respond with the generated blog title and description
      res.status(200).json({
        Title: BlogTitleAi,
        Description: BlogDescriptionAI,
      })
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Failed to generate blog description.',
      })
    }
  } catch (error) {
    console.error('Error processing request:', error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    })
  }
})

export default AI_Router
