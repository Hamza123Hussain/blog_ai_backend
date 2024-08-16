import express from 'express'
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../FireBaseConfig.js'
const Updated_Delete_Router = express.Router()
Updated_Delete_Router.put('/', async (req, res) => {
  try {
    const { Text, POSTID } = req.body

    // Reference to the specific document
    const postDocRef = doc(db, 'Posts', POSTID)

    // Update the document with new text
    await updateDoc(postDocRef, {
      Text: Text,
    })

    // Retrieve the updated document
    const updatedDoc = await getDoc(postDocRef)

    if (updatedDoc.exists()) {
      // Send back the updated document data
      res.status(200).json(
        true
        // post: {
        //   id: updatedDoc.id,
        //   ...updatedDoc.data(),
        // },
      )
    } else {
      // In case the document does not exist (shouldn't happen if we just updated it)
      res.status(404).json({ message: 'Document not found' })
    }
  } catch (error) {
    console.error('Error updating post:', error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    })
  }
})

Updated_Delete_Router.delete('/:POSTID', async (req, res) => {
  try {
    const { POSTID } = req.params // Retrieve POSTID from URL parameters
    await deleteDoc(doc(db, 'Posts', POSTID))
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    })
  }
})

export default Updated_Delete_Router
