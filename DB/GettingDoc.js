import express from 'express'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../FireBaseConfig.js'

const Get_router = express.Router()

Get_router.get('/', async (req, res) => {
  try {
    // Extract ID from query parameters
    const { ID } = req.query

    // Check if ID is provided
    if (!ID) {
      return res.status(400).json({ error: 'ID query parameter is required' })
    }

    // Fetch the document from Firestore
    const docRef = doc(db, 'Posts', ID)
    const docSnap = await getDoc(docRef)

    // Check if the document exists
    if (!docSnap.exists()) {
      // Return dummy data when no document is found
      return res.status(404).json(false)
    }

    // Return the document data
    return res.status(200).json(docSnap.data())
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error fetching document:', error)
    return res
      .status(500)
      .json({ error: 'An error occurred while fetching the document' })
  }
})

export default Get_router
