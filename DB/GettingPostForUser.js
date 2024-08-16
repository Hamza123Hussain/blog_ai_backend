import express from 'express'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../FireBaseConfig.js'

const UserPosts = express.Router()

UserPosts.get('/', async (req, res) => {
  try {
    // Extract the email from the query parameters
    const { email } = req.query

    // Validate the email parameter
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email parameter',
      })
    }

    // Define the query to fetch documents where CreatedBy matches the provided email
    const q = query(collection(db, 'Posts'), where('CreatedBy', '==', email))

    // Execute the query
    const querySnapshot = await getDocs(q)

    // Extract the document data
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include document ID if needed
      ...doc.data(),
    }))

    // Send success response with the posts
    res.status(200).json(posts)
  } catch (error) {
    console.error('Error retrieving posts:', error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    })
  }
})

export default UserPosts
