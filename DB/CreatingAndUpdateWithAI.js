import express from 'express'
import { chatSessions } from '../GemniConfig.js'

const AI_Router = express.Router()

AI_Router.post('/', async (req, res) => {
  try {
    const { text, title } = req.body

    // Create the prompt for generating the blog title
    const BlogTitlePrompt = `Based on the ${title} I have given for the blog, suggest a single, concise title for the blog post. Provide only one title that is straightforward and relevant to the ${title}. The title should be in plain text, alphanumeric only, without any special characters or symbols. Do not include any additional explanations or suggestions, just the title.
`

    // Generate the blog title using Gemini AI
    const Gemni_Response = await chatSessions.sendMessage(BlogTitlePrompt)
    const BlogTitleAi = Gemni_Response.response.text()

    // Create the prompt for generating the blog description
    const CommentDescriptionPrompt = `Read the blog title "${BlogTitleAi}" and the text "${text}" given, and then provide me just the blog description. Ensure the description is concise and captures the essence of the text in plain alpha-numeric text. Do not include any symbols, hashtags, or additional formatting.
`

    // Generate the blog description using Gemini AI
    const Gemni_Response2 = await chatSessions.sendMessage(
      CommentDescriptionPrompt
    )
    const CommentDescriptionAI = Gemni_Response2.response.text()

    // Check if the generated description is valid
    if (CommentDescriptionAI) {
      // Respond with the generated blog title and description
      res.status(200).json({
        Title: BlogTitleAi,
        Description: CommentDescriptionAI,
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

AI_Router.post('/comment', async (req, res) => {
  try {
    const { text } = req.body

    // Create the prompt for generating the blog description
    const CommentDescriptionPrompt = `Read  the ${text} given and provide me a 1-5 line comment. only the comment in alphanumeric and no other data`

    // Generate the blog description using Gemini AI
    const Gemni_Response2 = await chatSessions.sendMessage(
      CommentDescriptionPrompt
    )
    const CommentDescriptionAI = Gemni_Response2.response.text()
    if (CommentDescriptionAI) {
      res.status(200).json(CommentDescriptionAI)
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
