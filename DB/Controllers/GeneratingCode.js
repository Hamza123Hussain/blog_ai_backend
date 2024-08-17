import { doc, setDoc } from 'firebase/firestore'
import { v4 as uuid } from 'uuid'
import { db } from '../../Firebase.js'

export const CodeController = async (_, res) => {
  const RandomID = uuid()
  try {
    // // Generate the blog title using Gemini AI
    // const Gemni_Response = await chatSessions.sendMessage(BlogTitlePrompt)
    // const BlogTitleAi = Gemni_Response.response.text()
    await setDoc(doc(db, 'CodeGenerator', RandomID), { message: '' })
    res.status(200).json(true)
  } catch (error) {
    res.status(500).json(error)
  }
}
