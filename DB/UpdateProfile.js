import { updateDoc, doc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import express from 'express'
import multer from 'multer'

const UpdateRouter = express.Router()
// Set up multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() })
UpdateRouter.post('/', upload.single('image'), async (req, res) => {
  try {
    const { Name, email, userID } = req.body
    const image = req.file

    if (!email || !Name) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Missing required fields' })
    }

    // Initialize imageUrl outside the condition
    let imageUrl

    if (image) {
      // Sanitize the email to be URL-friendly
      const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_')
      const imagePath = `images/${sanitizedEmail}/${image.originalname}`
      const imageRef = ref(Storage, imagePath)
      const imageBuffer = image.buffer

      try {
        // Upload the image to Firebase Storage
        await uploadBytes(imageRef, imageBuffer)
        // Get the download URL for the image
        imageUrl = await getDownloadURL(imageRef)
      } catch (storageError) {
        console.error('Error uploading image:', storageError)
        return res
          .status(500)
          .json({ status: 'error', message: 'Error uploading image' })
      }
    }

    // Prepare update data
    const updateData = {
      Name,
      UpdatedAt: Date.now(),
    }

    // Conditionally add imageUrl to update data if an image was uploaded
    if (imageUrl) {
      updateData.imageUrl = imageUrl
    }

    // Update the document in Firestore
    await updateDoc(doc(db, 'Users', userID), updateData)

    // Send a success response
    return res.status(201).json({
      success: true,
      message: 'User updated successfully',
      imageUrl: imageUrl || null,
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal server error' })
  }
})

export default UpdateRouter
