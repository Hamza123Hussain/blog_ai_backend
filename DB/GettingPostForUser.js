import express from 'express'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../FireBaseConfig.js'
const UserPosts = express.Router()
UserPosts.get('/', async (req, res) => {
  try {
    // Define the query to fetch documents where CreatedBy is 'hamzahussain'
    const q = query(
      collection(db, 'Posts'),
      where('CreatedBy', '==', 'hamzahussain14.hh@Gmail.com')
    )

    // Execute the query
    const querySnapshot = await getDocs(q)

    // Extract the document data
    const posts = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }))

    // Send success response with the posts
    res.status(200).json({
      status: 'success',
      message: 'Posts retrieved successfully',
      posts: posts,
    })
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
