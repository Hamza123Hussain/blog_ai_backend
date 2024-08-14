import express from 'express'
import { addDoc, collection } from 'firebase/firestore'

import { v4 as uuidv4 } from 'uuid'
import { auth, db } from '../FireBaseConfig.js'

const Create_Update_Router = express.Router()

//MIDDLEWARE USE WITH FRONTEND
// // Middleware to verify Firebase ID token
// const verifyToken = async (req, res, next) => {
//   const token = req.headers.authorization?.split('Bearer ')[1]

//   if (!token) {
//     return res.status(401).json({ status: 'error', message: 'Unauthorized' })
//   }

//   try {
//     const decodedToken = await auth.currentUser.getIdToken(true) // Verify the token
//     req.user = decodedToken
//     next()
//   } catch (error) {
//     console.error('Error verifying token:', error)
//     return res.status(401).json({ status: 'error', message: 'Unauthorized' })
//   }
// }

// // Apply the verifyToken middleware to all routes
// Create_Update_Router.use(verifyToken)

Create_Update_Router.post('/', async (req, res) => {
  const randomId = uuidv4()

  try {
    const { text, email } = req.body

    // Add a new document to the 'Posts' collection
    await addDoc(collection(db, 'Posts', email), {
      CreatedBy: email,
      PostID: randomId,
      Text: text,
      comments: 0,
      likes: 0,
    })

    // Send success response
    res.status(201).json({
      status: 'success',
      message: 'Post added successfully',
      post: {
        PostID: randomId,
        CreatedBy: email,
        Text: text,
        comments: 0,
        likes: 0,
      },
    })
  } catch (error) {
    console.error('Error adding post:', error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    })
  }
})

export default Create_Update_Router
