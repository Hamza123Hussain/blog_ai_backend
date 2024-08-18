import express from 'express'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../FireBaseConfig.js'
import { v4 as uuidv4 } from 'uuid'

const CommentRouter = express.Router()

// Add a comment to a post
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

      res
        .status(200)
        .json({ success: true, message: 'Comment added successfully' })
    } else {
      res.status(404).json({ success: false, message: 'User not found' })
    }
  } catch (error) {
    console.error('Error adding comment:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

// Delete a comment from a post
CommentRouter.post('/delete', async (req, res) => {
  try {
    const { POSTID, CommentID } = req.body

    console.log('Received POSTID:', POSTID)
    console.log('Received CommentID:', CommentID)

    // Fetch the post document from Firestore
    const postDoc = await getDoc(doc(db, 'Posts', POSTID))

    if (postDoc.exists()) {
      const postData = postDoc.data()
      console.log('Current Post Data:', postData)

      // Ensure comments is an array and filter out the comment to be deleted
      if (Array.isArray(postData.comments)) {
        const updatedComments = postData.comments.filter(
          (comment) => comment.CommentID !== CommentID
        )
        console.log('Updated Comments:', updatedComments)

        // Update the post document with the new comments array
        await updateDoc(doc(db, 'Posts', POSTID), {
          comments: updatedComments,
        })

        res
          .status(200)
          .json({ success: true, message: 'Comment deleted successfully' })
      } else {
        res
          .status(400)
          .json({ success: false, message: 'Comments field is not an array' })
      }
    } else {
      res.status(404).json({ success: false, message: 'Post not found' })
    }
  } catch (error) {
    console.error('Error deleting comment:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

export default CommentRouter
