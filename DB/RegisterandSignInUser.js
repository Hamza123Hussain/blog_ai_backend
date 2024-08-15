import { Router } from 'express'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../FireBaseConfig.js'

const UserRouter = Router()
UserRouter.post('/', async (req, res) => {
  try {
    const { email, password, Name } = req.body

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
        Name: Name,
        email: email,
        userID: userId,
        CreatedAt: Date.now(),
      })

      // Send success response with user and post information
      res.status(201).json(true)
    } else {
      res.status(400).json({ status: 'error', message: 'User creation failed' })
    }
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      // Specific error for existing email
      res.status(400).json({ status: 'error', message: 'Email already in use' })
    } else {
      // Handle other errors
      console.error('Error creating user:', error)
      res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' })
    }
  }
})

UserRouter.post('/Login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Sign in the user with email and password
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )

    // If sign-in is successful
    if (userCredential) {
      // Retrieve user data from Firestore
      const userDoc = await getDoc(doc(db, 'Users', userCredential.user.uid))

      if (userDoc) {
        // Send user data as JSON response
        res.status(200).json(userDoc.data())
      } else {
        res.status(404).json({ error: 'User data not found' })
      }
    } else {
      res.status(400).json({ error: 'User not registered' })
    }
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message}` })
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
