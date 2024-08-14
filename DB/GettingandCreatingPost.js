import express from 'express'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'

import { v4 as uuidv4 } from 'uuid'
import { db } from '../FireBaseConfig.js'

const Create_Get_Router = express.Router()

// Create_Update_Router.use(verifyToken)

Create_Get_Router.post('/', async (req, res) => {
  const randomId = uuidv4()

  try {
    const { text, email } = req.body

    // Create a document reference with the specific ID
    const docRef = doc(db, 'Posts', randomId)

    // Set the document data
    await setDoc(docRef, {
      CreatedBy: email,
      PostID: randomId,
      Text: text,
      comments: [],
      // likes: [],
    })

    // Send success response
    res.status(201).json({
      status: 'success',
      message: 'Post added successfully',
      post: {
        PostID: randomId,
        CreatedBy: email,
        Text: text,
        comments: [],
        // likes: [],
      },
    })
  } catch (error) {
    console.error('Error adding post:', error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message, // Include specific error message
    })
  }
})

Create_Get_Router.get('/GetAll', async (_, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'Posts'))

    const posts = []
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() })
    })

    if (posts.length > 0) {
      return res.status(200).json(posts)
    } else {
      return res.status(404).json({ message: 'No data exists' })
    }
  } catch (error) {
    console.error('Error retrieving posts:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    })
  }
})

export default Create_Get_Router
