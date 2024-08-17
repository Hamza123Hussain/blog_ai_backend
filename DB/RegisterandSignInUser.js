import { Router } from 'express'
import multer from 'multer'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { auth, db, Storage } from '../FireBaseConfig.js'

// Set up multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() })

const UserRouter = Router()

// Handle user registration and image upload
UserRouter.post('/', upload.single('image'), async (req, res) => {
  try {
    const { email, password, Name } = req.body
    const image = req.file

    if (!email || !password || !Name) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Missing required fields' })
    }

    // Create a new user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    if (userCredential.user) {
      const userId = userCredential.user.uid

      if (image) {
        // Sanitize the email to be URL-friendly
        const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_')
        const imagePath = `images/${sanitizedEmail}/${image.originalname}` // Directly use the path string
        const imageRef = ref(Storage, imagePath)
        const imageBuffer = image.buffer

        try {
          // Upload the image to Firebase Storage
          await uploadBytes(imageRef, imageBuffer)
          // Get the download URL for the image
          const imageUrl = await getDownloadURL(imageRef)

          // Add user details to Firestore
          await setDoc(doc(db, 'Users', userId), {
            Name: Name,
            email: email,
            userID: userId,
            CreatedAt: Date.now(),
            imageUrl: imageUrl, // Store image URL in Firestore
          })

          // Send success response
          return res.status(201).json({ success: true, imageUrl })
        } catch (storageError) {
          console.error('Error uploading image:', storageError)
          return res
            .status(500)
            .json({ status: 'error', message: 'Error uploading image' })
        }
      } else {
        // No image uploaded, create user without image
        await setDoc(doc(db, 'Users', userId), {
          Name: Name,
          email: email,
          userID: userId,
          CreatedAt: Date.now(),
        })

        // Send success response
        return res
          .status(201)
          .json({ success: true, message: 'User created successfully' })
      }
    } else {
      return res
        .status(400)
        .json({ status: 'error', message: 'User creation failed' })
    }
  } catch (error) {
    console.error('Error creating user:', error)
    if (error.code === 'auth/email-already-in-use') {
      return res
        .status(400)
        .json({ status: 'error', message: 'Email already in use' })
    } else {
      return res
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

      if (userDoc.exists()) {
        // Send user data as JSON response
        res.status(200).json(userDoc.data())
      } else {
        res.status(404).json({ error: 'User data not found' })
      }
    } else {
      res.status(400).json({ error: 'User not registered' })
    }
  } catch (error) {
    if (
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/user-not-found'
    ) {
      // Handle wrong password or user not found errors
      res.status(500).json({ error: 'Invalid email or password' })
    } else {
      // Handle other errors
      console.error('Error during login:', error)
      res.status(401).json({ error: `Server error: ${error.message}` })
    }
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
