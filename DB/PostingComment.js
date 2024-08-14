import express from 'express'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../FireBaseConfig.js'
import { v4 as uuidv4 } from 'uuid'

const CommentRouter = express.Router()

CommentRouter.post('/', async (req, res) => {
  const randomId = uuidv4()
  try {
    const { message, UserID, POSTID } = req.body

    // Fetch the user document from Firestore
    const userDoc = await getDoc(doc(db, 'Users', UserID))

    if (userDoc.exists()) {
      const User = userDoc.data()

      // Update the post document with the new comment
      await updateDoc(doc(db, 'Posts', POSTID), {
        comments: arrayUnion({
          CommentID: randomId,
          Text: message,
          UserName: User.Name,
          UserID: UserID,
          CreatedAt: Date.now(),
        }),
      })

      res.status(200).json({ Message: 'Comment Done' })
    } else {
      res.status(404).json({ Message: 'NO USER' })
    }
  } catch (error) {
    console.error('Error adding comment:', error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    })
  }
})

export default CommentRouter
