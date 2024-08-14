import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, setDoc, arrayUnion } from 'firebase/firestore'
import { auth, db } from '../FireBaseConfig.js'

const UserRouter = Router()

UserRouter.post('/', async (req, res) => {
  const randomId = uuidv4()

  try {
    const { email, password, name } = req.body

    // Create a new user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    if (userCredential.user) {
      const userId = userCredential.user.uid

      // Add user details to Firestore
      await setDoc(doc(db, 'Users', userId), {
        Name: name,
        email: email,
        userID: userId,
        CreatedAt: Date.now(),
      })

      // Initialize the user's post in Firestore
      await setDoc(doc(db, 'Posts', email), {
        PostID: randomId,
        CreatedBy: email,
        Text: '',
        ImageURL: '',
        comments: 0,
        likes: 0,
      })

      // Send success response with user and post information
      res.status(201).json({
        status: 'success',
        message: 'User and post created successfully',
        user: {
          userID: userId,
          email: email,
          name: name,
        },
      })
    } else {
      res.status(400).json({ status: 'error', message: 'User creation failed' })
    }
  } catch (error) {
    // Handle errors and send error response
    console.error('Error creating user or post:', error)
    res.status(500).json({ status: 'error', message: 'Internal server error' })
  }
})

UserRouter.post('/Login', async (req, res) => {
  try {
    const { email, password } = req.body
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    if (userCredential) {
      res.status(200).json(userCredential.user)
    } else {
      res.status(400).json('USER NOT REGISTERED')
    }
  } catch (error) {
    res.status(404).json(`error : ${error}`)
  }
})

UserRouter.get('/Signout', async (_, res) => {
  try {
    await signOut(auth)
    res.status(200).json(true)
  } catch (error) {
    res.status(404).json(`error : ${error}`)
  }
})
export default UserRouter
