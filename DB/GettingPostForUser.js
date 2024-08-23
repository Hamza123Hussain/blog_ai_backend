import express from 'express'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../FireBaseConfig.js'

const UserPosts = express.Router()

UserPosts.get('/', async (req, res) => {
  try {
    // Extract the Name from the query parameters
    const { Name } = req.query

    // Validate the Name parameter
    if (!Name || typeof Name !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid Name parameter',
      })
    }

    // Define the query to fetch documents where CreatedBy matches the provided Name
    const q = query(collection(db, 'Posts'), where('CreatedBy', '==', Name))

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
