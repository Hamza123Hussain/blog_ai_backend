import { doc, getDoc } from 'firebase/firestore'
import express from 'express'
import { db } from '../FireBaseConfig.js'

const GetRouter = express.Router()

// Function to retrieve a single user by UserName
GetRouter.get('/user', async (req, res) => {
  try {
    const { UserName } = req.query // Extract UserName from the request parameters

    // Reference to the user document
    const userDocRef = doc(db, 'Users', UserName)

    // Fetch the user document
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      // If the user document exists, send the user data
      return res.status(200).json(userDoc.data())
    } else {
      // If the user document does not exist, send an error message
      return res.status(404).json({ success: false, message: 'User not found' })
    }
  } catch (error) {
    // Handle any errors that occurred during the fetch
    console.error('Error fetching user:', error)
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' })
  }
})

export default GetRouter
